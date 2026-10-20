const hits = new Map();

const CLEANUP_INTERVAL_MS = 60 * 1000;

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of hits.entries()) {
    if (now >= record.resetTime) {
      hits.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

if (cleanupTimer && typeof cleanupTimer.unref === "function") {
  cleanupTimer.unref();
}

export const getClientIp = (req) => {
  if (typeof req === "string") return req;
  if (!req) return "127.0.0.1";
  const forwarded = req.headers ? req.headers["x-forwarded-for"] : null;
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "127.0.0.1";
};

export const resetRateLimit = (key, reqOrIp) => {
  const ip = getClientIp(reqOrIp);
  const storeKey = `${key}:${ip}`;
  hits.delete(storeKey);
};

export const rateLimit = ({ key, limit, windowMs }) => {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const storeKey = typeof key === "function" ? key(req) : `${key}:${ip}`;
    const now = Date.now();

    let record = hits.get(storeKey);

    if (!record || now >= record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      hits.set(storeKey, record);
      return next();
    }

    record.count += 1;

    if (record.count > limit) {
      const remainingMs = record.resetTime - now;
      const retryAfterSeconds = Math.max(1, Math.ceil(remainingMs / 1000));

      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        message: "Demasiadas solicitudes. Por favor, intente de nuevo más tarde.",
      });
    }

    return next();
  };
};

export default rateLimit;
