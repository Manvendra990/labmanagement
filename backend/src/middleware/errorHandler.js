import { ApiError } from "../utils/ApiError.js";
export function notFound(req, res, next) {
  next(
    new ApiError(
      404,
      "ROUTE_NOT_FOUND",
      `Cannot ${req.method} ${req.originalUrl}`,
    ),
  );
}
export function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500,
    code = err.code || "INTERNAL_ERROR",
    message = err.message || "Unexpected server error",
    details = err.details || null;
  if (err?.code === "ER_DUP_ENTRY") {
    status = 409;
    code = "DUPLICATE_CATEGORY";
    message = "A test category with this name already exists.";
  }
  if (err?.code === "ER_NO_SUCH_TABLE") {
    status = 500;
    code = "DATABASE_SCHEMA_MISSING";
    message = "Required database table is missing. Run the supplied migration.";
  }
  if (err instanceof SyntaxError && "body" in err) {
    status = 400;
    code = "INVALID_JSON";
    message = "Request body contains invalid JSON.";
  }
  if (status >= 500)
    console.error("[API ERROR]", {
      requestId: req.requestId,
      code,
      error: err,
    });
  res
    .status(status)
    .json({
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
      requestId: req.requestId,
    });
}
