# 🛡️ SentinelPrompt — AI Security Guardian

> An AI-powered, real-time code security scanner that detects, explains, and automatically patches vulnerabilities across 10+ programming languages — in seconds.

Built at **Vibe2Ship** · Powered by **Gemini 2.0 Flash**

---

## ✨ Features

- 🔍 **Deep Vulnerability Scanning** — Detects SQL injection, XSS, command injection, hardcoded secrets, path traversal, broken authentication, and all OWASP Top 10 categories
- 🎯 **CWE & OWASP Mapping** — Every finding is mapped to its official CWE ID and OWASP 2021 category
- 📊 **Risk Score Dashboard** — 0–100 risk score with Critical / High / Medium / Low / Info severity breakdown
- ⚡ **One-Click AI Auto-Fix** — Gemini generates a complete, patched version of your code instantly
- 🔄 **Side-by-Side Diff Viewer** — Review exactly what changed before applying any fix
- 🌐 **10+ Languages** — Python, JavaScript, TypeScript, Java, Go, SQL, PHP, Ruby, C, C++
- 📋 **Demo Library** — Pre-loaded vulnerable code samples for instant demonstration

---

## 🚀 Live Demo

🔗 **[sentinel-prompt.vercel.app](https://sentinel-prompt.vercel.app)**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Language | TypeScript 5 |
| AI Model | Gemini 2.0 Flash (Google AI) |
| Code Editor | Monaco Editor (VS Code engine) |
| Animations | Framer Motion |
| Charts | Recharts |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |

---

## 🏃 Running Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/shreya-521/sentinel-prompt.git
   cd sentinel-prompt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

---

## 🧠 How It Works

1. **Paste your code** into the Monaco editor (or load a demo sample)
2. **Select the language** (or use auto-detect)
3. **Click "Run Security Scan"** — Gemini 2.0 Flash performs a deep security audit
4. **Review the results** — risk score, vulnerability cards with CWE/OWASP tags, attack vectors
5. **Click "Auto-Fix"** on any vulnerability — Gemini generates a patched version
6. **Review the diff** — see exactly what changed, then apply with one click

---

## 📁 Project Structure

```
sentinel-prompt/
├── app/
│   ├── api/
│   │   ├── scan/route.ts     # Security scanning endpoint
│   │   └── fix/route.ts      # Auto-fix endpoint
│   ├── scan/page.tsx          # Main scanner UI
│   ├── page.tsx               # Landing page
│   └── globals.css            # Design system & styles
├── components/
│   ├── CodeEditor.tsx         # Monaco editor wrapper
│   ├── ThreatDashboard.tsx    # Risk score & stats
│   ├── ScanPanel.tsx          # Vulnerability list
│   ├── VulnerabilityCard.tsx  # Individual vuln display
│   ├── DiffViewer.tsx         # Before/after code diff
│   └── ScanAnimation.tsx      # Loading animation
└── lib/
    ├── gemini.ts              # Gemini API integration
    ├── types.ts               # TypeScript interfaces
    └── vulnerabilities.ts     # Demo samples
```

---

## 🔐 Security Note

Never commit your `.env.local` file. The `.gitignore` already excludes it. Always add your `GEMINI_API_KEY` as an environment variable in your deployment platform (e.g., Vercel Dashboard → Settings → Environment Variables).

---

## 👩‍💻 Author

**Shreya** — [github.com/shreya-521](https://github.com/shreya-521)

---

*SentinelPrompt — Because every line of code deserves to be secure.* 🛡️
