import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient


ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")
load_dotenv(ROOT.parent / "server" / ".env")

client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_default_database(default="test")
accounts = db["accounts"]
