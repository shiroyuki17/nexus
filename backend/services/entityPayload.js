import { fieldTypes, guardedFields } from "../config/entities.js";
import { httpError } from "../utils/httpError.js";
import { getAllowedFields, getEntitySchema } from "../schemas/entitySchemas.js";

function applyDefaults(schema, payload) {
  const data = { ...payload };

  for (const [field, property] of Object.entries(schema.properties || {})) {
    if (data[field] === undefined && Object.prototype.hasOwnProperty.call(property, "default")) {
      data[field] = property.default;
    }
  }

  return data;
}

function validateRequired(schema, data) {
  for (const field of schema.required || []) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw httpError(400, `Missing required field: ${field}`);
    }
  }
}

function coerceValue(field, value) {
  if (value === undefined) return undefined;
  if (value === "") return null;
  if (fieldTypes.integer.has(field)) return Number.parseInt(value, 10);
  if (fieldTypes.number.has(field)) return Number(value);
  if (fieldTypes.boolean.has(field)) return value === true || value === "true";
  if (fieldTypes.dateTime.has(field) && value) return new Date(value);
  return value;
}

function pickAllowedFields(collection, payload) {
  const allowedFields = getAllowedFields(collection);
  const data = {};

  for (const [field, value] of Object.entries(payload || {})) {
    if (field === "company_id" || !allowedFields.has(field) || guardedFields.has(field)) continue;

    const coerced = coerceValue(field, value);
    if (Number.isNaN(coerced)) throw httpError(400, `Invalid number for field: ${field}`);
    data[field] = coerced;
  }

  return data;
}

export function buildCreateData(collection, payload) {
  const schema = getEntitySchema(collection);
  const data = pickAllowedFields(collection, applyDefaults(schema, payload));
  validateRequired(schema, data);
  return data;
}

export function buildUpdateData(collection, payload) {
  return pickAllowedFields(collection, payload);
}

export function buildWhere(collection, filters = {}) {
  return pickAllowedFields(collection, filters);
}
