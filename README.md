## 1. Project Name

# RareSense AI – A Centralized AI Platform for Rare Disease Detection, Early Disease Recognition, and Patient Support Using Machine Learning and Deep Learning

## 2. Problem Statement

The healthcare ecosystem contains a large amount of information about symptoms, hospitals, doctors, government healthcare schemes, NGOs, and emergency services. However, users often face difficulty finding **relevant, reliable, and location-specific healthcare information** quickly. Traditional healthcare information systems may require users to search through multiple platforms, making the process time-consuming and difficult, especially during urgent situations.

## 3. Proposed System

**RareSense AI** is an AI-powered healthcare assistance platform that provides users with a centralized system for accessing healthcare-related information and services. The system uses **Natural Language Processing (NLP), Retrieval-Augmented Generation (RAG), text embeddings, semantic similarity, Large Language Models (LLMs), and geolocation services** to understand user queries, retrieve relevant healthcare information, and provide context-aware responses.

The system also helps users discover **nearby hospitals, healthcare providers, NGOs, government healthcare schemes, emergency resources, and other healthcare information** through a single platform.

## 🚀 Features

* 🤖 AI-powered healthcare assistant
* 💬 Natural language healthcare queries
* 🧠 Retrieval-Augmented Generation (RAG)
* 🔎 Semantic knowledge retrieval using text embeddings
* 🏥 Hospital finder
* 👨‍⚕️ Doctor finder
* 📍 Location-based healthcare services
* 🚨 Emergency SOS functionality
* 🩺 Symptom checker
* 🧭 Healthcare Care Navigator
* 📚 Healthcare Knowledge Hub
* 🏛️ Government healthcare schemes finder
* 🤝 NGO directory
* 📄 Healthcare report analyzer
* 👤 User registration and authentication
* 🔐 Protected routes
* 👨‍💼 Admin dashboard
* 🗂️ Healthcare information management

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │  TypeScript + Vite  │
                         └──────────┬──────────┘
                                    │
                              REST API Calls
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   FastAPI Backend   │
                         │       Python        │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │   MongoDB    │      │     RAG      │      │ Geolocation  │
       │   Database   │      │   Pipeline   │      │   Services   │
       └──────────────┘      └──────┬───────┘      └──────────────┘
                                    │
                                    ▼
                            ┌────────────────┐
                            │ Text Embeddings│
                            └───────┬────────┘
                                    │
                                    ▼
                            ┌────────────────┐
                            │      LLM       │
                            │ AI Response    │
                            └────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* React Leaflet
* Leaflet
* Lucide React
* CSS

### Backend

* Python
* FastAPI
* Pydantic
* REST APIs

### Artificial Intelligence

* Natural Language Processing (NLP)
* Retrieval-Augmented Generation (RAG)
* Text Embeddings
* Semantic Similarity
* Cosine Similarity
* Large Language Models (LLMs)

### Database

* MongoDB

### Development Tools

* Git
* GitHub
* Visual Studio Code
* npm
* Python Virtual Environment

---

## 📁 Project Structure

```text
RareSense-AI/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── deps.py
│   │   │   └── security.py
│   │   │
│   │   ├── db/
│   │   │   └── mongodb.py
│   │   │
│   │   ├── models/
│   │   │   └── schemas.py
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── care_navigator.py
│   │   │   ├── chat.py
│   │   │   ├── emergency.py
│   │   │   ├── hospitals.py
│   │   │   ├── knowledge.py
│   │   │   ├── ngos.py
│   │   │   ├── reports.py
│   │   │   ├── schemes.py
│   │   │   └── symptoms.py
│   │   │
│   │   ├── seed/
│   │   │   ├── hospitals_data.py
│   │   │   ├── knowledge_data.py
│   │   │   ├── promote_admin.py
│   │   │   ├── research_india_schemes_ngos.json
│   │   │   ├── seed_hospitals.py
│   │   │   ├── seed_knowledge.py
│   │   │   └── seed_schemes_ngos.py
│   │   │
│   │   ├── services/
│   │   │   ├── embeddings.py
│   │   │   ├── geo.py
│   │   │   └── rag.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── assets/
│   │   │   ├── auth-side.webp
│   │   │   └── hero-bg.webp
│   │   │
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── SETUP.md
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/GullaKeerthana/RareSense-AI.git
```

Navigate into the project:

```bash
cd RareSense-AI
```

---

# 🔹 Backend Setup

### 2. Navigate to the backend

```bash
cd backend
```

### 3. Create a Python virtual environment

For Windows:

```bash
python -m venv venv
```

Activate the environment:

```bash
venv\Scripts\activate
```

For Linux/macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure environment variables

Create a `.env` file using:

```text
backend/.env.example
```

Add the required configuration values for the application, database, and AI services.

**Do not upload your `.env` file or API keys to GitHub.**

### 6. Start the backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🔹 Frontend Setup

### 7. Open a new terminal

Navigate to the frontend:

```bash
cd frontend
```

### 8. Install frontend dependencies

```bash
npm install
```

### 9. Configure environment variables

Create a `.env` file using:

```text
frontend/.env.example
```

Add the required frontend configuration values.

### 10. Start the frontend

```bash
npm run dev
```

The Vite development server will provide a local URL, usually:

```text
http://localhost:5173
```

---

## 🧠 AI Workflow

RareSense AI uses an AI-assisted information retrieval workflow.

```text
User Query
    │
    ▼
Natural Language Processing
    │
    ▼
Query Embedding
    │
    ▼
Semantic Similarity Search
    │
    ▼
Relevant Knowledge Retrieval
    │
    ▼
RAG Context Construction
    │
    ▼
Large Language Model
    │
    ▼
Context-Aware Response
```

The system retrieves relevant information before generating the final response.

---

## 🔎 Retrieval-Augmented Generation

The RAG pipeline helps the system retrieve relevant information from the available healthcare knowledge before generating an AI response.

The general process is:

1. User submits a healthcare-related query.
2. The query is processed using NLP techniques.
3. The query is converted into an embedding.
4. Relevant information is identified using semantic similarity.
5. Retrieved information is provided as context.
6. The LLM generates a natural-language response using the retrieved context.

---

## 📍 Location Services

RareSense AI includes location-based healthcare functionality.

The platform can help users discover nearby healthcare resources such as:

* Hospitals
* Doctors and healthcare providers
* NGOs
* Emergency resources

Geolocation information can be used to identify and organize nearby resources based on distance.

---

## 🔐 Authentication & Security

The application includes:

* User registration
* User login
* Authentication
* Protected routes
* Admin routes
* Admin management functionality

Sensitive information is stored using environment variables.

The following files should never contain real secrets in the GitHub repository:

```text
.env
API keys
Database credentials
Secret keys
Authentication credentials
```

---

## 👨‍💼 Admin Features

The platform includes an administration interface for managing healthcare information.

Admin functionality includes:

* Hospital management
* Healthcare knowledge management
* NGO management
* Government scheme management
* Dashboard management

---

## 📌 Main Modules

| Module          | Description                                     |
| --------------- | ----------------------------------------------- |
| AI Assistant    | Provides AI-powered healthcare assistance       |
| Symptom Checker | Helps users explore symptom-related information |
| Care Navigator  | Helps users navigate healthcare resources       |
| Hospital Finder | Helps users locate hospitals                    |
| Doctor Finder   | Helps users locate healthcare providers         |
| Emergency SOS   | Provides emergency assistance functionality     |
| Knowledge Hub   | Provides healthcare information                 |
| Scheme Finder   | Helps discover healthcare schemes               |
| NGO Directory   | Provides NGO information                        |
| Report Analyzer | Supports healthcare report analysis             |
| Admin Dashboard | Provides administrative functionality           |

---

## 🎯 Project Objectives

The main objectives of RareSense AI are:

1. Provide accessible healthcare information through natural language interaction.
2. Help users discover relevant healthcare resources.
3. Retrieve relevant information using semantic search and RAG.
4. Provide location-aware healthcare resource discovery.
5. Organize hospitals, NGOs, healthcare schemes, and knowledge in one platform.
6. Provide an easy-to-use AI-assisted healthcare interface.
7. Improve access to relevant healthcare information through intelligent retrieval.

---

## ⚠️ Disclaimer

RareSense AI is an educational and project-based healthcare assistance platform.

The information provided by the system should not be considered a substitute for professional medical advice, diagnosis, or treatment.

For medical emergencies or serious health concerns, users should contact qualified healthcare professionals or appropriate emergency services.

---

## 👩‍💻 Developer

**Keerthana Gulla**

B.Tech Computer Science & Engineering (Data Science)

---

## 🔗 GitHub Repository

[GitHub - RareSense AI](https://github.com/GullaKeerthana/RareSense-AI)

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
