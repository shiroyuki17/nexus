export function getCurrentUser(context) {
  return {
    id: context.userId,
    email: `${context.userId}@nexus.local`,
    name: context.username,
    role: context.role,
    company_id: context.companyId,
    company_name: context.companyName,
    pc_number: context.pcNumber
  };
}

export function logout() {
  return { ok: true };
}
