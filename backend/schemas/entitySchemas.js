import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entityConfig } from "../config/entities.js";
import { httpError } from "../utils/httpError.js";
import { toKebabCase } from "../utils/string.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..", "..");
const schemaDir = path.join(rootDir, "entitles");

const schemas = loadEntitySchemas();

function loadEntitySchemas() {
  const loaded = new Map();
  const entries = fs.readdirSync(schemaDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const fullPath = path.join(schemaDir, entry.name);
    const schema = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    const collection = toKebabCase(schema.name || entry.name);

    if (entityConfig[collection]) {
      loaded.set(collection, { ...schema, collection });
    }
  }

  return loaded;
}

export function listEntitySchemas() {
  return Array.from(schemas.values()).map(schema => ({
    collection: schema.collection,
    name: schema.name,
    required: schema.required || [],
    properties: {
      company_id: {
        type: "string",
        readOnly: true
      },
      ...(schema.properties || {})
    }
  }));
}

export function getEntitySchema(collection) {
  const schema = schemas.get(collection);
  if (!schema) throw httpError(404, `Unknown collection: ${collection}`);
  return schema;
}

export function getAllowedFields(collection) {
  return new Set(["id", ...Object.keys(getEntitySchema(collection).properties || {})]);
}
