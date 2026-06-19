"""Minimal FastAPI backend for Calmyra static site.
Provides a tiny /api/health endpoint so supervisor stays happy. The actual
website is fully static and served by the frontend (Express) process.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Calmyra API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "calmyra"}


@app.post("/api/contact")
async def contact(payload: dict):
    # Static site — no DB. We just echo back so the form works in preview.
    return {"received": True, "data": payload}
