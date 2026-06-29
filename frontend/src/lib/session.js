const SESSION_KEY = "nexus_session";

const defaultSession = {
  userId: "local-user",
  userName: "Nexus Player",
  role: "admin",
  companyId: "demo-company",
  companyName: "Demo Company",
  pcNumber: ""
};

export function getSession() {
  try {
    return {
      ...defaultSession,
      ...JSON.parse(localStorage.getItem(SESSION_KEY) || "{}")
    };
  } catch {
    return defaultSession;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    ...getSession(),
    ...session
  }));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionHeaders() {
  const session = getSession();
  const headers = {
    "x-user-id": session.userId,
    "x-user-name": session.userName,
    "x-user-role": session.role,
    "x-company-id": session.companyId,
    "x-company-name": session.companyName
  };

  if (session.pcNumber) {
    headers["x-pc-number"] = String(session.pcNumber);
  }

  return headers;
}
