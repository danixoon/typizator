export const createError = (
  name: string,
  message: string,
  code: number = 500,
  data: any = {}
) => {
  return { message, name, code, ...data };
};

const combineNames = (...names: string[]) => names.join(".");

export const errors = {
  accessDenied: (
    message = "Доступ запрещён",
    prefix = "error",
    data: any = {}
  ) => createError(combineNames(prefix, "access_denied"), message, 403, data),
  notFound: (message = "Не найдено", prefix = "error", data: any = {}) =>
    createError(combineNames(prefix, "not_found"), message, 404, data),
  badRequest: (message = "Неверный запрос", prefix = "error", data: any = {}) =>
    createError(combineNames(prefix, "bad_request"), message, 400, data),
} as const;
