import { NextRequest, NextResponse } from "next/server";
import { fixVulnerability } from "@/lib/gemini";
import { Language, Vulnerability } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, vulnerability, language = "auto" } = body as {
      code: string;
      vulnerability: Vulnerability;
      language: Language;
    };

    if (!code || !vulnerability) {
      return NextResponse.json(
        { error: "code and vulnerability are required" },
        { status: 400 }
      );
    }

    const result = await fixVulnerability(code, vulnerability, language);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/fix]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
