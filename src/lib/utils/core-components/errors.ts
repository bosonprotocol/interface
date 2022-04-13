export class FetchError extends Error {
  statusCode?: number;
  statusText?: string;

  constructor(args: {
    message?: string;
    statusCode?: number;
    statusText?: string;
  }) {
    super(args.message);
    this.statusCode = args.statusCode;
    this.statusText = args.statusText;
  }
}
