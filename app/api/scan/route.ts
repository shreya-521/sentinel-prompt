import { NextRequest, NextResponse } from "next/server";
import { scanCode } from "@/lib/gemini";
import { Language } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language = "auto" } = body as {
      code: string;
      language: Language;
    };

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }

    if (code.length > 50000) {
      return NextResponse.json(
        { error: "Code exceeds maximum size of 50,000 characters" },
        { status: 400 }
      );
    }

    const result = await scanCode(code, language);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/scan]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
