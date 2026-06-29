import {
  createCollectionRecord,
  deleteCollectionRecord,
  getCollectionSchema,
  listCollectionRecords,
  listSchemas,
  updateCollectionRecord
} from "../controllers/entityController.js";
import { getCurrentUser, logout } from "../controllers/authController.js";
import { health } from "../controllers/healthController.js";
import { getRequestContext } from "../auth/requestContext.js";
import { readJsonBody } from "../http/json.js";
import { httpError, notFound } from "../utils/httpError.js";
import { normalizeCollection } from "../utils/string.js";

function ok(body) {
  return { status: 200, body };
}

function created(body) {
  return { status: 201, body };
}

function getRequestParts(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return {
    url,
    parts: url.pathname.split("/").filter(Boolean)
  };
}

function getEntityRoute(parts) {
  return {
    collection: normalizeCollection(parts[1]),
    id: parts[2] && parts[2] !== "schema" ? decodeURIComponent(parts[2]) : null,
    isSchemaRoute: parts[2] === "schema"
  };
}

async function routeEntityRequest(req, url, parts, context) {
  if (parts[0] !== "api" || parts.length < 2) throw notFound();

  const { collection, id, isSchemaRoute } = getEntityRoute(parts);

  if (isSchemaRoute && req.method === "GET") {
    return ok(getCollectionSchema(collection));
  }

  if (req.method === "GET") {
    return ok(await listCollectionRecords(collection, Object.fromEntries(url.searchParams), context));
  }

  if (req.method === "POST") {
    return created(await createCollectionRecord(collection, await readJsonBody(req), context));
  }

  if ((req.method === "PUT" || req.method === "PATCH") && id) {
    return ok(await updateCollectionRecord(collection, id, await readJsonBody(req), context));
  }

  if (req.method === "DELETE" && id) {
    await deleteCollectionRecord(collection, id, context);
    return ok({ ok: true });
  }

  throw httpError(405, "Method not allowed");
}

export async function routeRequest(req) {
  const { url, parts } = getRequestParts(req);
  const context = getRequestContext(req);

  if (req.method === "OPTIONS") return { status: 204, body: {} };
  if (url.pathname === "/api/health") return ok(health());
  if (url.pathname === "/api/auth/me") return ok(getCurrentUser(context));
  if (url.pathname === "/api/auth/logout" && req.method === "POST") return ok(logout());
  if (url.pathname === "/api/schemas") return ok(listSchemas());

  return routeEntityRequest(req, url, parts, context);
}
