from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

# The pwa-manifest.json lives next to this file
MANIFEST_PATH = Path(__file__).parent / "pwa-manifest.json"

@router.get("/pwa-manifest")
async def get_pwa_manifest():
    """Serve the PWA manifest dynamically so it works reliably with auth."""
    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        return manifest
    return {"name": "Hermes", "short_name": "Hermes", "start_url": "/", "display": "standalone"}