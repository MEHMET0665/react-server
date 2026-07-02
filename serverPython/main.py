from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "test")
PORT = int(os.getenv("PORT", 8000))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
@app.on_event("startup")
async def startup_db_client():
    try:
        await db.command("ping")
        print("✅ Successfully connected with MongoDB")
    except Exception as e:
        print("❌ Could not connect to MongoDB:", e)

# Health check endpoint to test MongoDB connection
@app.get("/health")
async def health_check():
    try:
        await db.command("ping")
        return {
            "status": "healthy",
            "mongodb": "connected",
            "message": "✅ MongoDB is connected and responding"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "mongodb": "error",
                "message": "❌ MongoDB connection error",
                "error": str(e)
            }
        )

# ---------------------------
# Helpers
# ---------------------------
def user_helper(user) -> dict:
    return {
        "_id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email")
    }

# ---------------------------
# Pydantic model
# ---------------------------
class User(BaseModel):
    name: str
    email: str

# ---------------------------
# Routes (/api/users)
# ---------------------------

# GET all users
@app.get("/api/users")
async def get_users():
    users_cursor = db.users.find()
    users = []
    async for user in users_cursor:
        users.append(user_helper(user))
    return users

# POST new user
@app.post("/api/users")
async def create_user(user: User):
    result = await db.users.insert_one(user.dict())
    new_user = await db.users.find_one({"_id": result.inserted_id})
    return user_helper(new_user)

# DELETE user by Mongo _id
@app.delete("/api/users/{id}")
async def delete_user(id: str):
    result = await db.users.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
