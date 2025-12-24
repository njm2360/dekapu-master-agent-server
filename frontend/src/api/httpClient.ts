import { HttpError, NetworkError, ParseError } from "./errors"

async function safeJson(res: Response): Promise<unknown | undefined> {
    try {
        return await res.json();
    } catch {
        return undefined;
    }
}

export async function http<T>(
    input: RequestInfo,
    init?: RequestInit
): Promise<T> {
    let res: Response;

    try {
        res = await fetch(input, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers ?? {}),
            },
        });
    } catch {
        throw new NetworkError();
    }

    if (!res.ok) {
        throw new HttpError(res.status, await safeJson(res));
    }

    try {
        return (await res.json()) as T;
    } catch {
        throw new ParseError();
    }
}
