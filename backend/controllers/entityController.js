import {
  createEntity,
  deleteEntity,
  findEntities,
  getSchema,
  getSchemas,
  updateEntity
} from "../services/entityService.js";

export function listSchemas() {
  return getSchemas();
}

export function getCollectionSchema(collection) {
  return getSchema(collection);
}

export function listCollectionRecords(collection, query, context) {
  return findEntities(collection, query, context);
}

export function createCollectionRecord(collection, body, context) {
  return createEntity(collection, body, context);
}

export function updateCollectionRecord(collection, id, body, context) {
  return updateEntity(collection, id, body, context);
}

export function deleteCollectionRecord(collection, id, context) {
  return deleteEntity(collection, id, context);
}
