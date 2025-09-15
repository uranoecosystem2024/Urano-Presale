import { NextResponse } from "next/server";
import axios, { type AxiosInstance } from "axios";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SubscribeRequestBody {
  email?: string;
}

interface BrevoContact {
  id?: number;
  email?: string;
  listIds?: number[];
}

interface BrevoCreateOrUpdateContactRequest {
  email: string;
  listIds: number[];
  updateEnabled: boolean;
}

interface BrevoCreateOrUpdateContactResponse {
  id?: number;
}

type SuccessStatus = "already_subscribed" | "added_to_list" | "subscribed";
type ErrorStatus = "error";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID ?? "3");

if (!BREVO_API_KEY) {
  throw new Error("Missing BREVO_API_KEY environment variable");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeClient(): AxiosInstance {
  return axios.create({
    baseURL: "https://api.brevo.com/v3",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    timeout: 12_000,
  });
}

function stringifyUnknown(x: unknown): string {
  if (typeof x === "string") return x;
  try {
    return JSON.stringify(x);
  } catch {
    return String(x);
  }
}

function getErrorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as Record<string, unknown>;
    if (data && typeof data === "object" && "message" in data) {
      const msg = data.message;
      if (typeof msg === "string") return msg;
    }
    return e.message ?? "Unknown Axios error";
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as SubscribeRequestBody;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { status: "error" as ErrorStatus, message: "Invalid or missing email" },
        { status: 400 }
      );
    }

    const client = makeClient();

    let exists = false;
    let inList = false;

    try {
      const { data: contact } = await client.get<BrevoContact>(
        `/contacts/${encodeURIComponent(email)}`
      );

      exists = true;

      const listIds: number[] = contact.listIds ?? [];
      inList = listIds.includes(BREVO_LIST_ID);

      if (inList) {
        return NextResponse.json(
          {
            status: "already_subscribed" as SuccessStatus,
            message: "Email already registered in this list",
          },
          { status: 200 }
        );
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const code = err.response?.status ?? 0;
        if (code !== 404) {
          const detail = stringifyUnknown(err.response?.data ?? err);
          return NextResponse.json(
            {
              status: "error" as ErrorStatus,
              message: "Brevo lookup failed",
              detail,
            },
            { status: 502 }
          );
        }
      } else {
        return NextResponse.json(
          {
            status: "error" as ErrorStatus,
            message: "Lookup error",
            detail: stringifyUnknown(err),
          },
          { status: 502 }
        );
      }
    }

    const payload: BrevoCreateOrUpdateContactRequest = {
      email,
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
    };

    const postRes = await client.post<BrevoCreateOrUpdateContactResponse>("/contacts", payload);

    if (!postRes.data || (typeof postRes.data.id !== "number" && !exists)) {
      return NextResponse.json(
        {
          status: "error" as ErrorStatus,
          message: "Brevo subscribe returned an unexpected response",
          detail: stringifyUnknown(postRes.data),
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        status: (exists ? "added_to_list" : "subscribed") as SuccessStatus,
        message: exists ? "Email added to the list" : "Subscription successful",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = getErrorMessage(error);
      const detail = stringifyUnknown(error.response?.data ?? error);
      return NextResponse.json(
        {
          status: "error" as ErrorStatus,
          message,
          detail,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        status: "error" as ErrorStatus,
        message: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
