export const createError = (
  name: string,
  message: string,
  code: number = 500,
  data: any = {}
) => {
  return { message, name, code, ...data };
};

export const errors = {
  accessDenied: (
    message = "Доступ запрещён",
    name = "access_denied",
    any = {}
  ) => createError(name, message, 403),
  notFound: (message = "Не найдено", name = "not_found", any = {}) =>
    createError(name, message, 404),
  badRequest: (
    message = "Неверный запрос",
    name = "bad_request",
    data: any = {}
  ) => createError(name, message, 400, data),
} as const;
