# Backend service for PrivyScan

Built using FastAPI and machine learning models to classify and evaluate privacy policies based on transparency, safety, and risk factors.

---

## 🌐 Deployment

### Backend Deployment (Render)

The FastAPI backend is deployed on Render for API handling, routing, and frontend integration.

Live Backend URL:

```bash
https://privyscan-backend.onrender.com
```

API Documentation:

```bash
https://privyscan-backend.onrender.com/docs
```

---
### ML Model & Inference Hosting (Hugging Face Spaces)

Machine learning models and inference pipelines are hosted separately using Hugging Face Spaces.

This architecture allows:
- scalable backend deployment
- separate ML inference handling
- cleaner frontend-backend communication
- modular deployment structure

---

### Deployment Architecture

| Component | Platform |
|---|---|
| Backend API | Render |
| ML Model Hosting | Hugging Face Spaces |
| Version Control | GitHub |
| Containerization | Docker |

---
## Tech Stack

- FastAPI
- Python
- Uvicorn
- Machine Learning
- NLP
- Docker

