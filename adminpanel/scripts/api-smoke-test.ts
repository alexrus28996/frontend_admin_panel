const required = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    console.error(`[SMOKE] Missing required env var: ${name}`);
    process.exit(1);
  }

  return value;
};

const baseUrl = required("NEXT_PUBLIC_API_BASE_URL").replace(/\/+$/, "");
const email = required("NEXT_PUBLIC_ADMIN_EMAIL");
const password = required("NEXT_PUBLIC_ADMIN_PASSWORD");
const enableLogs = process.env.NEXT_PUBLIC_ENABLE_API_SMOKE_TEST_LOGS === "true";

const printJson = (label, value) => {
  console.log(`${label}:`);
  console.log(JSON.stringify(value, null, 2));
};

const extractToken = (payload) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (typeof payload.token === "string" && payload.token.length > 0) {
    return payload.token;
  }

  if (payload.data && typeof payload.data.token === "string" && payload.data.token.length > 0) {
    return payload.data.token;
  }

  return null;
};

const toArrayPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return null;
};

const run = async () => {
  const loginUrl = `${baseUrl}/api/auth/login`;
  const usersUrl = `${baseUrl}/api/admin/users`;

  console.log(`[SMOKE] Login URL: ${loginUrl}`);
  console.log(`[SMOKE] Users URL: ${usersUrl}`);

  const loginResponse = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const loginPayload = await loginResponse.json();
  console.log(`[SMOKE] Login status: ${loginResponse.status}`);

  if (enableLogs) {
    printJson("[SMOKE] Login payload", loginPayload);
  }

  const token = extractToken(loginPayload);

  if (!token) {
    printJson("[SMOKE] Login payload missing token", loginPayload);
    process.exit(1);
  }

  const usersResponse = await fetch(usersUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const usersPayload = await usersResponse.json();
  console.log(`[SMOKE] Users status: ${usersResponse.status}`);

  const users = toArrayPayload(usersPayload);

  if (!users) {
    printJson("[SMOKE] Users payload is not an array/data-array", usersPayload);
    process.exit(1);
  }

  const firstTwoKeys = users
    .slice(0, 2)
    .map((item) => (item && typeof item === "object" ? Object.keys(item) : []));

  const ids = users
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const id = item._id ?? item.id;
      return typeof id === "string" || typeof id === "number" ? String(id) : null;
    })
    .filter(Boolean)
    .slice(0, 5);

  console.log(`[SMOKE] Users array length: ${users.length}`);
  printJson("[SMOKE] First 2 records keys", firstTwoKeys);
  printJson("[SMOKE] First 5 user IDs", ids);
  console.log("[SMOKE] Completed successfully.");
};

void run();
