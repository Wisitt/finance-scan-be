export interface ParsedOcrResult {
  amount: number;
  date: string | null;
  merchant: string | null;
  items: Array<{ name: string; price: number }>;
  description: string;
  taxId: string | null;
  rawText: string;
}