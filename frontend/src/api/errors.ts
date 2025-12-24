// api/errors.ts
export class NetworkError extends Error { }

export class HttpError extends Error {
    constructor(
        public status: number,
        public body?: unknown
    ) {
        super(`HTTP error: ${status}`);
    }
}

export class ParseError extends Error { }
