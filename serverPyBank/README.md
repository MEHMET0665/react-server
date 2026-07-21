# FastAPI Bank API

This is the FastAPI version of the Node.js bank API. It uses the same MongoDB database and `accounts` collection.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

The app reads `MONGO_URI` from `serverPyBank/.env`. If that file does not exist, it uses `server/.env`.

## Run

```bash
uvicorn app:app --reload --port 5001
```

The API runs at `http://localhost:5001`. Interactive documentation is available at `http://localhost:5001/docs`.

## Seed

```bash
python seed_accounts.py
```
