// Erro de negócio com status HTTP; o errorHandler usa statusCode e name na resposta
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    name = 'Error'
  ) {
    super(message);
    this.name = name;
  }
}
