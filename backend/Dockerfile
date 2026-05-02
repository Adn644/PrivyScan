FROM python:3.10-slim

WORKDIR /app

# system deps needed for torch + transformers
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy everything (code + models)
COPY . .

# hugging face spaces runs on port 7860
EXPOSE 7860

# uvicorn must point to api:app because your file is api.py not app.py
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]