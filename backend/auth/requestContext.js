const DEFAULT_COMPANY_ID = process.env.DEFAULT_COMPANY_ID || "demo-company";
const DEFAULT_COMPANY_NAME = process.env.DEFAULT_COMPANY_NAME || "Demo Company";

export function getRequestContext(req) {
  return {
    userId: req.headers["x-user-id"] || "local-user",
    username: req.headers["x-user-name"] || "Nexus Player",
    role: req.headers["x-user-role"] || "admin",
    companyId: req.headers["x-company-id"] || DEFAULT_COMPANY_ID,
    companyName: req.headers["x-company-name"] || DEFAULT_COMPANY_NAME,
    pcNumber: req.headers["x-pc-number"] ? Number(req.headers["x-pc-number"]) : null
  };
}
