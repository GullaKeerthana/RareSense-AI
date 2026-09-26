import base64
import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from openai import AsyncOpenAI

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.db.mongodb import report_analyses_collection
from app.models.schemas import ReportAnalysisResponse

router = APIRouter(prefix="/reports", tags=["medical-report-analyzer"])
settings = get_settings()
client = AsyncOpenAI(api_key=settings.openai_api_key)

MAX_FILE_SIZE = 8 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

SYSTEM_PROMPT = (
    "You are RareSense AI's Medical Report Analyzer. You will be shown an image of a lab or "
    "medical report. Respond ONLY with a JSON object with keys: "
    "summary (a short plain-language paragraph explaining what the report shows, for a "
    "non-medical reader), "
    "key_findings (an array of short strings, each a specific value or result you can read "
    "from the report, in plain language), "
    "flagged_items (an array of short strings naming any values that appear outside a typical "
    "reference range as printed on the report itself — do not diagnose, just note what stands "
    "out and that it's worth discussing with a doctor). "
    "If the image is not readable or does not look like a medical report, say so honestly in "
    "summary and return empty arrays for the other fields."
)


@router.post("/analyze", response_model=ReportAnalysisResponse)
async def analyze_report(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Please upload a JPEG, PNG, or WEBP image of the report.")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large — please upload an image under 8MB.")

    b64 = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:{file.content_type};base64,{b64}"

    completion = await client.chat.completions.create(
        model=settings.openai_chat_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Analyze this medical report image."},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ],
            },
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )

    raw = completion.choices[0].message.content
    try:
        parsed = json.loads(raw) if raw else {}
    except json.JSONDecodeError:
        parsed = {}

    result = ReportAnalysisResponse(
        summary=parsed.get("summary") or "Could not read this report. Please try a clearer image.",
        key_findings=parsed.get("key_findings", []),
        flagged_items=parsed.get("flagged_items", []),
        disclaimer=(
            "This is an AI reading of your uploaded report for general understanding only — it "
            "is not a diagnosis. Always review your results with the doctor who ordered the test."
        ),
    )

    await report_analyses_collection.insert_one(
        {
            "user_id": str(user["_id"]),
            "filename": file.filename,
            "result": result.model_dump(),
            "created_at": datetime.now(timezone.utc),
        }
    )

    return result
