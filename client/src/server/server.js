const BASE_URL = "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export function getAccounts() {
  return request("/accounts");
}

export function getBalance(accountId) {
  return request(`/accounts/${encodeURIComponent(accountId)}/balance`);
}

export function deposit(accountId, amount) {
  return request(`/accounts/${encodeURIComponent(accountId)}/deposits`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export function transfer(fromAccountId, toAccountId, amount) {
  return request("/transfers", {
    method: "POST",
    body: JSON.stringify({ fromAccountId, toAccountId, amount }),
  });
}
export function getTransactions(accountId) {
  return request(
    `/accounts/${encodeURIComponent(accountId)}/transactions`
  );
}

const bankServer = {
  getAccounts,
  getBalance,
  getTransactions,
  deposit,
  transfer,
};

export default bankServer;
