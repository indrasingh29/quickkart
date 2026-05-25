import xss from "xss";

const isUnsafeMongoKey = (key) => key.startsWith("$") || key.includes(".");

const sanitizeMongoValue = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeMongoValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !isUnsafeMongoKey(key))
        .map(([key, entry]) => [key, sanitizeMongoValue(entry)])
    );
  }
  return value;
};

const sanitizeValue = (value) => {
  if (typeof value === "string") return xss(value.trim());
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitizeValue(entry)]));
  }
  return value;
};

export const sanitizeMongo = (req, _res, next) => {
  if (req.body) req.body = sanitizeMongoValue(req.body);
  if (req.params) req.params = sanitizeMongoValue(req.params);
  if (req.query && typeof req.query === "object") {
    const sanitizedQuery = sanitizeMongoValue(req.query);
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, sanitizedQuery);
  }
  next();
};

export const sanitizeXss = (req, _res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};
