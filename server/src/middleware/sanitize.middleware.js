import xss from "xss";

const sanitizeValue = (value) => {
  if (typeof value === "string") return xss(value.trim());
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitizeValue(entry)]));
  }
  return value;
};

export const sanitizeXss = (req, _res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};
