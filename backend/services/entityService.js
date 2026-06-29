import { entityConfig } from "../config/entities.js";
import { prisma } from "../lib/prisma.js";
import {
  getEntitySchema,
  listEntitySchemas
} from "../schemas/entitySchemas.js";
import {
  buildCreateData,
  buildUpdateData,
  buildWhere
} from "./entityPayload.js";
import { httpError } from "../utils/httpError.js";
import { ensureCompany } from "./companyService.js";

function getDelegate(collection) {
  const config = entityConfig[collection];
  if (!config) throw httpError(404, `Unknown collection: ${collection}`);

  const delegate = prisma[config.delegate];
  if (!delegate) throw httpError(500, `Prisma model is not configured for ${collection}`);

  return delegate;
}

function handlePrismaNotFound(error, id) {
  if (error.code === "P2025") {
    throw httpError(404, `Record not found: ${id}`);
  }
  throw error;
}

export function getSchemas() {
  return listEntitySchemas();
}

export function getSchema(collection) {
  return getEntitySchema(collection);
}

function scopedWhere(collection, filters, context) {
  return {
    ...buildWhere(collection, filters),
    company_id: context.companyId
  };
}

async function getScopedRecord(collection, id, context) {
  const record = await getDelegate(collection).findFirst({
    where: {
      id,
      company_id: context.companyId
    }
  });

  if (!record) throw httpError(404, `Record not found: ${id}`);
  return record;
}

export async function findEntities(collection, filters = {}, context) {
  return getDelegate(collection).findMany({
    where: scopedWhere(collection, filters, context),
    orderBy: { created_at: "desc" }
  });
}

export async function createEntity(collection, payload, context) {
  await ensureCompany(context);

  return getDelegate(collection).create({
    data: {
      ...buildCreateData(collection, payload),
      company_id: context.companyId
    }
  });
}

export async function updateEntity(collection, id, payload, context) {
  try {
    await getScopedRecord(collection, id, context);

    return await getDelegate(collection).update({
      where: { id },
      data: buildUpdateData(collection, payload)
    });
  } catch (error) {
    handlePrismaNotFound(error, id);
  }
}

export async function deleteEntity(collection, id, context) {
  try {
    await getScopedRecord(collection, id, context);
    await getDelegate(collection).delete({ where: { id } });
  } catch (error) {
    handlePrismaNotFound(error, id);
  }
}
