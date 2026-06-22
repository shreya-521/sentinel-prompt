export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type Language = 'python' | 'javascript' | 'typescript' | 'java' | 'go' | 'sql' | 'php' | 'ruby' | 'c' | 'cpp' | 'auto';

export interface Vulnerability {
  id: string;
  title: string;
  severity: Severity;
  cwe_id: string;
  owasp_category?: string;
  line_start: number;
  line_end: number;
  code_snippet: string;
  description: string;
  attack_vector: string;
  recommendation: string;
  fixed_code?: string;
}

export interface ScanResult {
  scan_id: string;
  language: string;
  risk_score: number;
  scan_duration_ms: number;
  vulnerabilities: Vulnerability[];
  summary: string;
  stats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface ScanRequest {
  code: string;
  language: Language;
}

export interface FixRequest {
  code: string;
  vulnerability: Vulnerability;
  language: Language;
}

export interface FixResult {
  fixed_code: string;
  explanation: string;
  diff_summary: string;
}

export interface DemoSample {
  id: string;
  title: string;
  language: Language;
  code: string;
  description: string;
}
