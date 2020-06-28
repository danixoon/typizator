export const createError = (
  name: string,
  message: string,
  code: number = 500
) => {
  return { message, name, code };
};

export const errors = {
  accessDenied: (message = "Доступ запрещён", name = "access_denied") =>
    createError(name, message, 403),
  notFound: (message = "Не найдено", name = "not_found") =>
    createError(name, message, 404),
} as const;
