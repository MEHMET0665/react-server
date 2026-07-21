import os

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from db import client
from routes.account_routes import router as account_router
from routes.transfer_routes import router as transfer_router


app = FastAPI(title="Bank API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(account_router)
app.include_router(transfer_router)


@app.exception_handler(HTTPException)
async def http_error(request: Request, error: HTTPException):
    return JSONResponse(status_code=error.status_code, content={"error": error.detail})


@app.exception_handler(Exception)
async def server_error(request: Request, error: Exception):
    app.logger.error(error) if hasattr(app, "logger") else print(error)
    return JSONResponse(status_code=500, content={"error": "Server error"})


@app.get("/")
def home():
    return {
        "message": "Bank API is running",
        "endpoints": [
            "GET /accounts",
            "GET /accounts/{account_id}/balance",
            "GET /accounts/{account_id}/transactions",
            "POST /accounts/{account_id}/deposits",
            "POST /transfers",
        ],
    }


if __name__ == "__main__":
    client.admin.command("ping")
    uvicorn.run("app:app", host="127.0.0.1", port=int(os.getenv("PYTHON_PORT", 5001)), reload=True)
