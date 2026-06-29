export const entityConfig = {
  pc: { delegate: "pc" },
  game: { delegate: "game" },
  product: { delegate: "product" },
  reservation: { delegate: "reservation" },
  transaction: { delegate: "transaction" },
  "food-order": { delegate: "foodOrder" },
  tournament: { delegate: "tournament" },
  "tournament-registration": { delegate: "tournamentRegistration" },
  "user-profile": { delegate: "userProfile" }
};

const integerFieldNames = [
  "pc_number",
  "popularity",
  "max_participants",
  "current_participants",
  "points",
  "current_pc"
];

const numberFieldNames = [
  "hourly_rate",
  "price",
  "duration_hours",
  "total_cost",
  "amount",
  "balance_after",
  "total",
  "entry_fee",
  "balance",
  "total_hours"
];

const booleanFieldNames = [
  "is_featured",
  "available",
  "session_active"
];

const dateTimeFieldNames = [
  "session_start",
  "created_at",
  "updated_at"
];

export const fieldTypes = {
  integer: new Set(integerFieldNames),
  number: new Set(numberFieldNames),
  boolean: new Set(booleanFieldNames),
  dateTime: new Set(dateTimeFieldNames)
};

export const guardedFields = new Set([
  "created_at",
  "updated_at"
]);
