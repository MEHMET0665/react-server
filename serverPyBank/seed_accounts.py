from datetime import datetime, timezone

from db import accounts, client


test_accounts = [
    {"accountId": "ACC001", "balance": 1250},
    {"accountId": "ACC002", "balance": 900},
    {"accountId": "ACC003", "balance": 500},
]

now = datetime.now(timezone.utc)

try:
    accounts.create_index("accountId", unique=True)
    created = 0

    for account in test_accounts:
        result = accounts.update_one(
            {"accountId": account["accountId"]},
            {"$setOnInsert": {
                **account,
                "transactions": [{
                    "type": "deposit",
                    "amount": account["balance"],
                    "createdAt": now,
                    "updatedAt": now,
                }],
            }},
            upsert=True,
        )
        created += int(result.upserted_id is not None)

    print(f"Seed completed: {created} created, {len(test_accounts) - created} already existed")
finally:
    client.close()
