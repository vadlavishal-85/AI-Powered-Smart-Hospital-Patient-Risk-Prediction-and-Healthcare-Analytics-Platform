# Model Artifacts Directory

This directory stores the serialized machine learning artifacts for the **AI Patient Risk Assessment System**.

## Artifact Overview

| File | Size | Description | In Git Repository? |
| :--- | :--- | :--- | :---: |
| `feature_columns.pkl` | 213 B | Exact 15-feature order enforced by model pipeline | Yes |
| `label_encoder.pkl` | 527 B | Target multiclass encoder for 8 disease classes | Yes |
| `best_model.pkl` | ~739.5 MB | Trained `RandomForestClassifier` (100 estimators) | Excluded (`.gitignore`) |

## Production Model Hosting Architecture

GitHub strictly rejects individual files exceeding **100 MB**. Because `best_model.pkl` is **~740 MB**:

1. **Local Development:**
   Keep `best_model.pkl` in `backend/models/best_model.pkl`. The FastAPI service preloads it once on application startup.

2. **Production Deployment Solutions (Non-Render):**
   - **Hugging Face Spaces (Free Docker Space - 16 GB RAM / 50 GB Disk):** Allows direct upload of model weights via `git-lfs` or Hugging Face Hub (`huggingface_hub.hf_hub_download`).
   - **Cloud Object Storage (AWS S3 / Cloudflare R2 / Google Cloud Storage):** Store `best_model.pkl` in a private bucket and download via a startup script if not cached locally:
     ```python
     if not os.path.exists("backend/models/best_model.pkl"):
         # Download from object storage URL
         urllib.request.urlretrieve(MODEL_STORAGE_URL, "backend/models/best_model.pkl")
     ```
   - **Railway / Container Volume:** Package the artifact into a production Docker image or attach a persistent Railway/Fly volume.
