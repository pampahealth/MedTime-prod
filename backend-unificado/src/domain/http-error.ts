export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string = "INTERNAL_ERROR"
  ) {
    super(message);
    this.name = "HttpError";
  }
}
