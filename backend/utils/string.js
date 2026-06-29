export function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function normalizeCollection(value) {
  return decodeURIComponent(value || "").replace(/[^a-z0-9-_]/gi, "");
}
