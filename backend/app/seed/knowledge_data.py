KNOWLEDGE_ENTRIES = [
    {
        "name": "Cystic Fibrosis",
        "aliases": ["CF"],
        "category": "Genetic / Respiratory",
        "summary": (
            "A genetic disorder caused by mutations in the CFTR gene that affects the lungs, "
            "digestive system, and other organs by producing unusually thick, sticky mucus."
        ),
        "symptoms": [
            "persistent cough",
            "frequent lung infections",
            "salty-tasting skin",
            "poor growth or weight gain",
            "difficulty breathing",
            "digestive issues",
        ],
        "causes": (
            "Inherited in an autosomal recessive pattern; caused by mutations in the CFTR gene, "
            "which affects a protein that regulates salt and water movement in cells."
        ),
        "management": (
            "Airway clearance techniques, CFTR modulator medications, enzyme supplements, and "
            "regular specialist care from a cystic fibrosis center."
        ),
        "prevalence_note": (
            "Considered one of the more well-known rare genetic disorders, more common in people "
            "of European descent."
        ),
        "resources": ["NORD (rarediseases.org)", "NIH GARD (rarediseases.info.nih.gov)"],
    },
    {
        "name": "Duchenne Muscular Dystrophy",
        "aliases": ["DMD"],
        "category": "Genetic / Neuromuscular",
        "summary": (
            "A progressive genetic muscle-wasting disorder caused by mutations in the dystrophin "
            "gene, primarily affecting boys and typically diagnosed in early childhood."
        ),
        "symptoms": [
            "delayed walking",
            "frequent falls",
            "difficulty rising from the floor",
            "progressive muscle weakness",
            "enlarged calf muscles",
        ],
        "causes": (
            "X-linked recessive mutation in the DMD gene, which normally produces dystrophin, a "
            "protein that stabilizes muscle fibers."
        ),
        "management": (
            "Corticosteroids, physical therapy, orthopedic and cardiac/respiratory monitoring, "
            "and emerging gene-targeted therapies."
        ),
        "prevalence_note": (
            "One of the more common forms of muscular dystrophy, though still classified as a "
            "rare disease overall."
        ),
        "resources": ["NORD (rarediseases.org)", "Muscular Dystrophy Association (mda.org)"],
    },
    {
        "name": "Huntington's Disease",
        "aliases": ["HD"],
        "category": "Genetic / Neurological",
        "summary": (
            "An inherited, progressive brain disorder that causes movement, cognitive, and "
            "psychiatric symptoms, usually appearing in mid-adulthood."
        ),
        "symptoms": [
            "involuntary jerking movements (chorea)",
            "difficulty with coordination",
            "cognitive decline",
            "mood changes",
            "difficulty speaking or swallowing",
        ],
        "causes": "Autosomal dominant expansion of a CAG repeat in the HTT gene.",
        "management": (
            "No cure; symptom-focused care including medication for movement or psychiatric "
            "symptoms, physical and speech therapy, and genetic counseling for families."
        ),
        "prevalence_note": (
            "Classified as a rare disease, with higher prevalence in populations of Western "
            "European descent."
        ),
        "resources": ["NORD (rarediseases.org)", "Huntington's Disease Society of America (hdsa.org)"],
    },
    {
        "name": "Amyotrophic Lateral Sclerosis",
        "aliases": ["ALS", "Lou Gehrig's disease"],
        "category": "Neurological",
        "summary": (
            "A progressive neurodegenerative disease affecting motor neurons in the brain and "
            "spinal cord, leading to loss of voluntary muscle control."
        ),
        "symptoms": [
            "muscle weakness",
            "muscle twitching (fasciculations)",
            "slurred speech",
            "difficulty swallowing",
            "progressive loss of mobility",
        ],
        "causes": (
            "Most cases are sporadic with an unknown trigger; a minority are inherited (familial "
            "ALS) and linked to specific gene mutations."
        ),
        "management": (
            "No cure; multidisciplinary care including medications that may slow progression, "
            "respiratory support, physical/speech therapy, and assistive devices."
        ),
        "prevalence_note": "Considered a rare disease, more commonly diagnosed in adults over 40.",
        "resources": ["NORD (rarediseases.org)", "ALS Association (als.org)"],
    },
    {
        "name": "Marfan Syndrome",
        "aliases": [],
        "category": "Genetic / Connective Tissue",
        "summary": (
            "A genetic disorder affecting the body's connective tissue, most notably impacting "
            "the heart, blood vessels, eyes, and skeleton."
        ),
        "symptoms": [
            "tall, slender build",
            "long limbs and fingers",
            "flexible joints",
            "vision problems (lens dislocation)",
            "aortic enlargement",
        ],
        "causes": "Autosomal dominant mutation in the FBN1 gene, affecting the protein fibrillin-1.",
        "management": (
            "Regular cardiac imaging, medications such as beta-blockers, activity modifications, "
            "and monitoring by a multidisciplinary specialist team."
        ),
        "prevalence_note": "Considered a rare genetic connective tissue disorder.",
        "resources": ["NORD (rarediseases.org)", "The Marfan Foundation (marfan.org)"],
    },
    {
        "name": "Ehlers-Danlos Syndromes",
        "aliases": ["EDS"],
        "category": "Genetic / Connective Tissue",
        "summary": (
            "A group of connective tissue disorders characterized by joint hypermobility, skin "
            "that stretches or bruises easily, and tissue fragility."
        ),
        "symptoms": [
            "joint hypermobility",
            "chronic joint pain",
            "stretchy or fragile skin",
            "easy bruising",
            "frequent joint dislocations",
        ],
        "causes": (
            "Varies by subtype; generally caused by mutations affecting collagen or related "
            "connective tissue proteins, with different inheritance patterns."
        ),
        "management": (
            "Physical therapy to stabilize joints, pain management, and monitoring for "
            "cardiovascular involvement in certain subtypes."
        ),
        "prevalence_note": (
            "Some subtypes are very rare, while the hypermobile subtype is diagnosed more "
            "frequently than the others."
        ),
        "resources": ["NORD (rarediseases.org)", "The Ehlers-Danlos Society (ehlers-danlos.com)"],
    },
    {
        "name": "Gaucher Disease",
        "aliases": [],
        "category": "Genetic / Metabolic",
        "summary": (
            "An inherited metabolic disorder in which a fatty substance builds up in the liver, "
            "spleen, and bone marrow due to a missing or faulty enzyme."
        ),
        "symptoms": [
            "enlarged liver or spleen",
            "bone pain or fractures",
            "fatigue",
            "easy bruising",
            "low blood cell counts",
        ],
        "causes": "Autosomal recessive mutation affecting the glucocerebrosidase enzyme.",
        "management": (
            "Enzyme replacement therapy, substrate reduction therapy, and regular monitoring of "
            "organ and bone involvement."
        ),
        "prevalence_note": (
            "A rare genetic metabolic disorder, with higher frequency in certain populations such "
            "as Ashkenazi Jewish communities."
        ),
        "resources": ["NORD (rarediseases.org)", "National Gaucher Foundation (gaucherdisease.org)"],
    },
    {
        "name": "Wilson Disease",
        "aliases": [],
        "category": "Genetic / Metabolic",
        "summary": (
            "A genetic disorder that causes copper to accumulate in the liver, brain, and other "
            "organs due to impaired copper transport."
        ),
        "symptoms": [
            "liver problems",
            "tremor or movement difficulties",
            "difficulty speaking",
            "behavioral or mood changes",
            "a copper-colored ring around the eye (Kayser-Fleischer ring)",
        ],
        "causes": (
            "Autosomal recessive mutation in the ATP7B gene, which normally helps transport "
            "copper out of the liver."
        ),
        "management": (
            "Copper-chelating medications, zinc therapy, dietary copper restriction, and in "
            "severe cases a liver transplant."
        ),
        "prevalence_note": (
            "Considered a rare inherited metabolic disorder, often diagnosed in adolescence or "
            "young adulthood."
        ),
        "resources": ["NORD (rarediseases.org)", "Wilson Disease Association (wilsondisease.org)"],
    },
    {
        "name": "Prader-Willi Syndrome",
        "aliases": ["PWS"],
        "category": "Genetic / Developmental",
        "summary": (
            "A genetic disorder present from birth that affects appetite regulation, growth, "
            "cognitive development, and behavior."
        ),
        "symptoms": [
            "poor muscle tone in infancy",
            "feeding difficulties as an infant",
            "constant hunger and weight gain later in childhood",
            "developmental delays",
            "short stature",
        ],
        "causes": (
            "Caused by the absence of active genes on a specific region of the paternally "
            "inherited chromosome 15."
        ),
        "management": (
            "Early growth hormone therapy, structured nutrition and physical activity plans, and "
            "behavioral/developmental support."
        ),
        "prevalence_note": "Classified as a rare genetic disorder, typically identified in infancy.",
        "resources": ["NORD (rarediseases.org)", "Prader-Willi Syndrome Association (pwsausa.org)"],
    },
    {
        "name": "Rett Syndrome",
        "aliases": [],
        "category": "Genetic / Neurological",
        "summary": (
            "A rare neurodevelopmental disorder, primarily affecting girls, that leads to a "
            "regression of language and motor skills after a period of apparently typical early "
            "development."
        ),
        "symptoms": [
            "loss of purposeful hand use",
            "repetitive hand movements",
            "loss of spoken language",
            "gait abnormalities",
            "slowed head growth",
        ],
        "causes": (
            "Most cases are linked to a mutation in the MECP2 gene, usually not inherited from a "
            "parent."
        ),
        "management": (
            "Supportive, multidisciplinary care including physical, occupational, and speech "
            "therapy, plus management of related seizures or other symptoms."
        ),
        "prevalence_note": (
            "Considered a rare neurodevelopmental disorder, predominantly diagnosed in females."
        ),
        "resources": ["NORD (rarediseases.org)", "International Rett Syndrome Foundation (rettsyndrome.org)"],
    },
    {
        "name": "Tuberous Sclerosis Complex",
        "aliases": ["TSC"],
        "category": "Genetic / Multisystem",
        "summary": (
            "A genetic disorder that causes non-cancerous tumors to form in multiple organs, "
            "most often the brain, skin, kidneys, and heart."
        ),
        "symptoms": [
            "seizures",
            "skin patches or growths",
            "developmental or learning differences",
            "kidney growths",
            "behavioral differences",
        ],
        "causes": "Mutation in the TSC1 or TSC2 gene, which normally help regulate cell growth.",
        "management": (
            "Seizure management, regular imaging to monitor tumor growth, mTOR-inhibitor "
            "medications, and developmental support."
        ),
        "prevalence_note": (
            "Classified as a rare genetic disorder, often identified in infancy or early childhood."
        ),
        "resources": ["NORD (rarediseases.org)", "TSC Alliance (tsalliance.org)"],
    },
    {
        "name": "Fragile X Syndrome",
        "aliases": [],
        "category": "Genetic / Developmental",
        "summary": (
            "An inherited genetic condition causing a range of developmental and intellectual "
            "disabilities, and the most common known inherited cause of intellectual disability."
        ),
        "symptoms": [
            "developmental delays",
            "learning difficulties",
            "anxiety or attention difficulties",
            "sensory sensitivities",
            "characteristic facial features in some individuals",
        ],
        "causes": (
            "Expansion of a repeated DNA segment on the FMR1 gene, located on the X chromosome."
        ),
        "management": (
            "Individualized educational support, behavioral therapy, and management of "
            "associated anxiety or attention symptoms."
        ),
        "prevalence_note": (
            "Considered a rare genetic disorder, more frequently and often more severely "
            "expressed in males."
        ),
        "resources": ["NORD (rarediseases.org)", "National Fragile X Foundation (fragilex.org)"],
    },
]
