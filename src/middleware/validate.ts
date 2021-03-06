import { errors, createError } from "../error";
import * as joi from "@hapi/joi";

// const validate = (obj: any, schema: any) => {
//   const schemaObject = joi.object(schema);
//   const result = schemaObject.validate(obj);
//   return result;
// };

export const query: <Q>(
  schema: { [P in keyof Q]: joi.AnySchema }
) => Api.RequestHandler<Q, any, any> = (schema) => (req, res, next) => {
  const schemaObject = joi
    .object()
    .keys({
      ...schema,
      randomId: (schema as any).randomId ?? joi.string().optional(),
    })
    .options({ presence: "required" });
  const result = schemaObject.validate(req.query);
  if (result.error)
    res.sendError(
      createError(
        "validate.bad_query",
        "Неверный параметр: " + result.error.message,
        400,
        { details: result.error.details[0] }
      )
    );
  else {
    next();
  }
};

export const body: <B>(
  schema: { [P in keyof B]: joi.AnySchema }
) => Api.RequestHandler<any, B, any> = (schema) => (req, res, next) => {
  const schemaObject = joi
    .object()
    .keys(schema)
    .options({ presence: "required" });
  const result = schemaObject.validate(req.body);
  if (result.error)
    res.sendError(
      createError(
        "validate.bad_body",
        "Неверный параметр: " + result.error.message,
        400,
        { details: result.error.details[0] }
      )
    );
  else {
    next();
  }
};
