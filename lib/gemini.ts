import { Language, ScanResult, FixResult, Vulnerability } from './types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SCAN_SYSTEM_PROMPT = `You are SentinelPrompt, an elite AI security auditor specializing in detecting vulnerabilities in AI-generated and human-written code. You have expert-level knowledge of:
- OWASP Top 10 vulnerabilities
- CWE (Common Weakness Enumeration) database
- Modern attack vectors and exploitation techniques
- Security best practices across all major programming languages

Your task is to perform a thorough security audit of the provided code and return a structured JSON response.

IMPORTANT: Return ONLY valid JSON, no markdown, no extra text. The response must match this exact schema:
{
  "scan_id": "string (generate a unique ID like uuid4 format)",
  "language": "string (detected language)",
  "risk_score": "number (0-100, higher = more dangerous)",
  "scan_duration_ms": "number (estimate in ms)",
  "vulnerabilities": [
    {
      "id": "string (vuln_001, vuln_002, etc)",
      "title": "string (concise vulnerability name)",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW | INFO",
      "cwe_id": "string (e.g. CWE-89)",
      "owasp_category": "string (e.g. A03:2021-Injection)",
      "line_start": "number",
      "line_end": "number",
      "code_snippet": "string (the vulnerable code, max 100 chars)",
      "description": "string (clear explanation of the vulnerability, 2-3 sentences)",
      "attack_vector": "string (how an attacker would exploit this, 1-2 sentences)",
      "recommendation": "string (specific fix recommendation, 2-3 sentences)"
    }
  ],
  "summary": "string (1-2 sentence executive summary)",
  "stats": {
    "critical": "number",
    "high": "number",
    "medium": "number",
    "low": "number",
    "info": "number"
  }
}

Be thorough but accurate. Only report real vulnerabilities with concrete evidence from the code. Do not hallucinate vulnerabilities that aren't present.`;

const FIX_SYSTEM_PROMPT = `You are SentinelPrompt's auto-remediation engine. You will receive vulnerable code and a specific vulnerability to fix.

Return ONLY valid JSON matching this schema:
{
  "fixed_code": "string (the complete fixed version of the original code)",
  "explanation": "string (clear explanation of what was changed and why, 3-4 sentences)",
  "diff_summary": "string (brief summary of the key changes made)"
}

Rules:
- Fix ONLY the specific vulnerability identified, do not make other changes
- Preserve the original code structure, comments, and formatting as much as possible
- Use language-appropriate security best practices
- The fixed_code must be the COMPLETE file/snippet, not just the changed lines`;

async function callGemini(prompt: string, systemPrompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response from Gemini API');
  }

  return text;
}

export async function scanCode(code: string, language: Language): Promise<ScanResult> {
  const startTime = Date.now();

  const prompt = `Perform a comprehensive security audit on the following ${language === 'auto' ? '' : language} code:

\`\`\`${language === 'auto' ? '' : language}
${code}
\`\`\`

Identify ALL security vulnerabilities present. Be thorough — check for injection flaws, hardcoded secrets, broken authentication, insecure data exposure, and all OWASP Top 10 categories.`;

  const raw = await callGemini(prompt, SCAN_SYSTEM_PROMPT);

  try {
    const result = JSON.parse(raw) as ScanResult;
    result.scan_duration_ms = Date.now() - startTime;

    // Compute stats
    const stats = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    result.vulnerabilities.forEach(v => {
      const key = v.severity.toLowerCase() as keyof typeof stats;
      if (key in stats) stats[key]++;
    });
    result.stats = stats;

    return result;
  } catch {
    throw new Error('Failed to parse Gemini response as JSON');
  }
}

export async function fixVulnerability(
  code: string,
  vulnerability: Vulnerability,
  language: Language
): Promise<FixResult> {
  const prompt = `Fix the following security vulnerability in this ${language} code:

VULNERABILITY:
- Title: ${vulnerability.title}
- Severity: ${vulnerability.severity}
- CWE: ${vulnerability.cwe_id}
- Lines: ${vulnerability.line_start}-${vulnerability.line_end}
- Description: ${vulnerability.description}
- Recommendation: ${vulnerability.recommendation}

ORIGINAL CODE:
\`\`\`${language}
${code}
\`\`\`

Provide the complete fixed code with the vulnerability remediated.`;

  const raw = await callGemini(prompt, FIX_SYSTEM_PROMPT);

  try {
    return JSON.parse(raw) as FixResult;
  } catch {
    throw new Error('Failed to parse fix response');
  }
}
