import crypto from "node:crypto";
export function requestContext(req, res, next) {
  req.requestId = req.get("X-Request-ID") || crypto.randomUUID();
  res.setHeader("X-Request-ID", req.requestId);
  req.startedAt = Date.now();
  console.log(
    `[API ->] ${req.method} ${req.originalUrl} requestId=${req.requestId}`,
  );
  res.on("finish", () =>
    console.log(
      `[API ${res.statusCode < 400 ? "OK" : "ERR"}] ${req.method} ${req.originalUrl} status=${res.statusCode} ${Date.now() - req.startedAt}ms requestId=${req.requestId}`,
    ),
  );
  next();
}
