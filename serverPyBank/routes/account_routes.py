from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pymongo import ReturnDocument

from db import accounts


router = APIRouter()


class DepositRequest(BaseModel):
    amount: float


@router.get("/accounts")
def get_accounts():
    return list(accounts.find({}, {"_id": 0, "accountId": 1, "balance": 1}))


@router.get("/accounts/{account_id}/balance")
def get_balance(account_id: str):
    account = accounts.find_one(
        {"accountId": account_id},
        {"_id": 0, "accountId": 1, "balance": 1},
    )
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.get("/accounts/{account_id}/transactions")
def get_transactions(account_id: str):
    account = accounts.find_one(
        {"accountId": account_id},
        {"_id": 0, "transactions": 1},
    )
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account.get("transactions", [])


@router.post("/accounts/{account_id}/deposits", status_code=201)
def create_deposit(account_id: str, body: DepositRequest):
    if body.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    now = datetime.now(timezone.utc)
    transaction = {
        "type": "deposit",
        "amount": body.amount,
        "createdAt": now,
        "updatedAt": now,
    }
    account = accounts.find_one_and_update(
        {"accountId": account_id},
        {"$inc": {"balance": body.amount}, "$push": {"transactions": transaction}},
        projection={"_id": 0, "accountId": 1, "balance": 1},
        return_document=ReturnDocument.AFTER,
    )

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account
