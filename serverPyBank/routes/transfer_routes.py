from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db import accounts


router = APIRouter()


class TransferRequest(BaseModel):
    fromAccountId: str
    toAccountId: str
    amount: float


@router.post("/transfers", status_code=201)
def create_transfer(body: TransferRequest):
    if body.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    if body.fromAccountId == body.toAccountId:
        raise HTTPException(status_code=400, detail="Accounts must be different")

    found = list(accounts.find({
        "accountId": {"$in": [body.fromAccountId, body.toAccountId]}
    }))
    if len(found) != 2:
        raise HTTPException(status_code=404, detail="Account not found")

    sender = next(account for account in found if account["accountId"] == body.fromAccountId)
    receiver = next(account for account in found if account["accountId"] == body.toAccountId)
    if sender["balance"] < body.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    now = datetime.now(timezone.utc)
    accounts.update_one(
        {"_id": sender["_id"]},
        {
            "$inc": {"balance": -body.amount},
            "$push": {"transactions": {
                "type": "transfer_out",
                "amount": body.amount,
                "accountId": body.toAccountId,
                "createdAt": now,
                "updatedAt": now,
            }},
        },
    )
    accounts.update_one(
        {"_id": receiver["_id"]},
        {
            "$inc": {"balance": body.amount},
            "$push": {"transactions": {
                "type": "transfer_in",
                "amount": body.amount,
                "accountId": body.fromAccountId,
                "createdAt": now,
                "updatedAt": now,
            }},
        },
    )

    return {
        "fromBalance": sender["balance"] - body.amount,
        "toBalance": receiver["balance"] + body.amount,
    }
