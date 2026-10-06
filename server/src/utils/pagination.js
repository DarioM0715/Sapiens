import mongoose from "mongoose";

const FALLBACK_DEFAULT_LIMIT = 10;
const FALLBACK_MAX_LIMIT = 50;

const envNumber = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const defaultLimit = () => envNumber(process.env.PAGINATION_DEFAULT_LIMIT, FALLBACK_DEFAULT_LIMIT);
export const maxLimit = () => envNumber(process.env.PAGINATION_MAX_LIMIT, FALLBACK_MAX_LIMIT);

export const parseLimit = (raw) => {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return defaultLimit();
  return Math.min(parsed, maxLimit());
};

export const encodeCursor = (doc) => {
  const createdAt = doc?.createdAt instanceof Date ? doc.createdAt : new Date(doc?.createdAt);
  const id = String(doc?._id ?? doc?.id ?? "");
  if (Number.isNaN(createdAt.getTime()) || !id) return null;
  return Buffer.from(JSON.stringify({ t: createdAt.toISOString(), i: id })).toString("base64url");
};

const decode = (raw) => {
  try {
    const payload = JSON.parse(Buffer.from(String(raw), "base64url").toString("utf8"));
    const createdAt = new Date(payload?.t);
    const id = String(payload?.i ?? "");
    if (Number.isNaN(createdAt.getTime()) || !id) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
};

export const decodePostCursor = (raw) => {
  const cursor = decode(raw);
  return cursor && mongoose.isValidObjectId(cursor.id) ? cursor : null;
};

export const decodeUserCursor = (raw) => {
  const cursor = decode(raw);
  return cursor && /^[a-zA-Z0-9_-]{8,64}$/.test(cursor.id) ? cursor : null;
};

const comparator = (direction) => (direction === "asc" ? "$gt" : "$lt");

export const mongoCursorFilter = (cursor, direction) => {
  if (!cursor) return {};
  const cmp = comparator(direction);
  return {
    $or: [{ createdAt: { [cmp]: cursor.createdAt } }, { createdAt: cursor.createdAt, _id: { [cmp]: new mongoose.Types.ObjectId(cursor.id) } }],
  };
};

export const prismaCursorWhere = (cursor, direction = "desc") => {
  if (!cursor) return {};
  const lt = direction !== "asc";
  return {
    OR: [
      { createdAt: lt ? { lt: cursor.createdAt } : { gt: cursor.createdAt } },
      { createdAt: cursor.createdAt, id: lt ? { lt: cursor.id } : { gt: cursor.id } },
    ],
  };
};

export const paginate = (docs, limit) => {
  const hasMore = docs.length > limit;
  const items = hasMore ? docs.slice(0, limit) : docs;
  const last = items.at(-1);
  return { items, nextCursor: hasMore && last ? encodeCursor(last) : null, hasMore };
};