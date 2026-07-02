async function fetchWithRetry(
  url,
  options = {},
  retries = 3,
  delay = 1000
) {
  try {
    const response = await fetch(url, options);

    // 1️⃣ Handle 429 (Rate Limit)
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const waitTime = retryAfter
        ? parseInt(retryAfter) * 1000
        : delay;

      if (retries === 0) {
        throw new Error("Max retries exceeded (429)");
      }

      console.log(`Rate limited. Retrying in ${waitTime}ms...`);

      await new Promise(res => setTimeout(res, waitTime));

      return fetchWithRetry(
        url,
        options,
        retries - 1,
        delay * 2 // exponential backoff
      );
    }

    // 2️⃣ Handle 5xx (Server Errors)
    if (response.status >= 500 && response.status < 600) {
      if (retries === 0) {
        throw new Error(`Max retries exceeded (${response.status})`);
      }

      console.log(`Server error ${response.status}. Retrying in ${delay}ms...`);

      await new Promise(res => setTimeout(res, delay));

      return fetchWithRetry(
        url,
        options,
        retries - 1,
        delay * 2
      );
    }

    // 3️⃣ Do NOT retry 4xx errors
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    // 4️⃣ Handle Network Errors (timeout, DNS, offline)
    if (retries === 0) {
      throw error;
    }

    console.log(`Network error. Retrying in ${delay}ms...`);

    await new Promise(res => setTimeout(res, delay));

    return fetchWithRetry(
      url,
      options,
      retries - 1,
      delay * 2
    );
  }
}