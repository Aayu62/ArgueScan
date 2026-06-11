# backend/main.py - Updated with CORS Security Handshake
import os
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # ◄ 1. IMPORT MIDDLEWARE
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize FastAPI App
app = FastAPI(title="ArgueScan AI Engine", version="1.0")

# ◄ 2. CONFIGURE THE CORS SAFETY NET
# This tells the browser to allow any frontend page to safely fetch data from our API ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any frontend domain context
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],  # Allows Content-Type, Accept headers
)

# Global System State Variables for Cache
MODEL_NAME = "all-MiniLM-L6-v2"
model = None
anchor_vectors = []
anchor_types = []
anchor_texts = []

@app.on_event("startup")
def initialize_ai_engine():
    global model, anchor_vectors, anchor_types, anchor_texts
    print(f"Loading local embedding transformer model: {MODEL_NAME}...")
    model = SentenceTransformer(MODEL_NAME)
    
    csv_path = os.path.join(os.path.dirname(__file__), "data", "anchors.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Critical Error: Anchor file missing at {csv_path}")
        
    df = pd.read_csv(csv_path)
    anchor_texts = df["text"].tolist()
    anchor_types = df["fallacy_type"].tolist()
    
    print("Pre-computing mathematical anchor vector points...")
    anchor_vectors = model.encode(anchor_texts)
    print("AI Engine safely booted and initialized.")

class ScanRequest(BaseModel):
    text_payload: str = Field(..., min_length=5, description="Raw text block to evaluate")
    sensitivity_threshold: float = Field(0.55, ge=0.35, le=0.85, description="Cosine distance cut-off")

@app.post("/api/v1/scan")
async def scan_text_rhetoric(payload: ScanRequest):
    if not model:
        raise HTTPException(status_code=503, detail="Model pipeline context uninitialized")
        
    try:
        raw_sentences = [s.strip() for s in payload.text_payload.split(".") if s.strip()]
        if not raw_sentences:
            return {"status": "success", "metrics": {"total_sentences_evaluated": 0}, "analysis_results": []}
            
        input_vectors = model.encode(raw_sentences)
        similarity_matrix = cosine_similarity(input_vectors, anchor_vectors)
        
        analysis_results = []
        fallacies_detected = 0
        
        for idx, sentence in enumerate(raw_sentences):
            sentence_scores = similarity_matrix[idx]
            max_score_idx = np.argmax(sentence_scores)
            highest_score = float(sentence_scores[max_score_idx])
            
            is_flagged = highest_score >= payload.sensitivity_threshold
            fallacy_type = anchor_types[max_score_idx] if is_flagged else None
            
            if is_flagged:
                fallacies_detected += 1
                
            analysis_results.append({
                "sentence_index": idx,
                "raw_text": sentence,
                "is_flagged": is_flagged,
                "fallacy_type": fallacy_type,
                "confidence_score": round(highest_score, 4)
            })
            
        return {
          "status": "success",
          "metrics": {
            "total_sentences_evaluated": len(raw_sentences),
            "fallacies_detected_count": fallacies_detected
          },
          "analysis_results": analysis_results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Engine Vector Exception: {str(e)}")