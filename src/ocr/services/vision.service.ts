import { ImageAnnotatorClient, protos } from '@google-cloud/vision';
import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { ParsedOcrResult } from '../dtos';

@Injectable()
export class VisionService {
  private readonly logger = new Logger(VisionService.name);
  private client: ImageAnnotatorClient;

  constructor() {
    try {
      this.client = new ImageAnnotatorClient({
        keyFilename: join(__dirname, '../../secrets/vision-service-account.json')
      });
      this.logger.log('Google Vision Client Initialized Successfully.');
    } catch (error) {
      this.logger.error('Failed to initialize Google Vision Client!', error.stack);
      throw error;
    }
  }


  private parseVisionApiResponse(
    annotation: protos.google.cloud.vision.v1.IAnnotateImageResponse,
  ): ParsedOcrResult {
    this.logger.debug('Parsing Vision API Response...');
    const fullTextAnnotation = annotation.fullTextAnnotation;
    const rawText = fullTextAnnotation?.text || '';

    let amount: number = 0;
    let date: string | null = null;
    let merchant: string | null = null;
    const items: Array<{ name: string; price: number }> = [];
    let description: string = '';
    let taxId: string | null = null;

    if (!fullTextAnnotation) {
      this.logger.warn('No fullTextAnnotation found in the response.');
      return { amount, date, merchant, items, description, taxId, rawText };
    }

    const firstLines = rawText.split('\n').slice(0, 5);
    merchant = firstLines[0]?.trim() || null;
    description = firstLines.join(' ').substring(0, 150).trim();

    const lines = rawText.split('\n');

    // --- Date Parsing ---
    const compactText = rawText.replace(/\n/g, ' ');
    const datePatterns = [
      /(?:(\d{1,2})\s*(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*(\d{2,4}))/,
      /\b(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\b/,
      /\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})\b/
    ];

    const thaiMonthMap: Record<string, string> = {
      'ม.ค.': '01', 'ก.พ.': '02', 'มี.ค.': '03', 'เม.ย.': '04',
      'พ.ค.': '05', 'มิ.ย.': '06', 'ก.ค.': '07', 'ส.ค.': '08',
      'ก.ย.': '09', 'ต.ค.': '10', 'พ.ย.': '11', 'ธ.ค.': '12',
    };

    for (const regex of datePatterns) {
      const match = compactText.match(regex);
      if (match) {
        if (match.length === 4 && thaiMonthMap[match[2]]) {
          const day = match[1].padStart(2, '0');
          const month = thaiMonthMap[match[2]];
          const yearRaw = match[3];
          let year = parseInt(yearRaw);
          if (yearRaw.length === 2) year += 2500;
          if (year > 2400) year -= 543;
          date = `${year}-${month}-${day}`;
          break;
        } else if (match.length === 4) {
          const [d1, d2, d3] = match.slice(1);
          const year = d3.length === 2 ? `20${d3}` : d3;
          date = `${year}-${d2.padStart(2, '0')}-${d1.padStart(2, '0')}`;
          break;
        } else if (match.length === 4) {
          const [y, m, d] = match.slice(1);
          date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
          break;
        }
      }
    }

    // Validate date format
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      date = null;
    }
    if (date) {
      const iso = new Date(date);
      if (isNaN(iso.getTime())) date = null;
    }

    // --- Amount Parsing ---
    const amountRegexes = [
      /(?:ยอดรวมสุทธิ|รวมทั้งสิ้น|ยอดสุทธิ|total|amount due|grand total)[^\d]*([\d,]+(?:\.\d{2})?)/i,
      /([\d,]+\.\d{2})\s*(?:บาท|THB)?\s*$/mi
    ];

    for (const line of [...lines].reverse()) {
      for (const regex of amountRegexes) {
        const match = line.match(regex);
        if (match && match[1]) {
          amount = parseFloat(match[1].replace(/,/g, ''));
          if (!isNaN(amount)) break;
        }
      }
      if (amount > 0) break;
    }

    if (!amount || isNaN(amount)) {
      const fallbackNumbers = rawText.match(/\d{1,3}(,\d{3})*(\.\d{2})?/g);
      if (fallbackNumbers) {
        const parsed = fallbackNumbers.map(s => parseFloat(s.replace(/,/g, ''))).filter(n => !isNaN(n));
        if (parsed.length > 0) amount = Math.max(...parsed);
      }
    }

    // --- Tax ID Parsing ---
    const taxIdRegex = /(?:tax id|เลขประจำตัวผู้เสียภาษี|tin)[\s:]*([\d-]{10,13})/i;
    const taxIdMatch = rawText.match(taxIdRegex);
    if (taxIdMatch) {
      taxId = taxIdMatch[1].replace(/[^\d]/g, '');
    }

    const result: ParsedOcrResult = {
      amount: isNaN(amount) ? 0 : amount,
      date,
      merchant,
      items,
      description,
      taxId,
      rawText,
    };
    this.logger.debug('Parsed Result:', result);
    return result;
  }

  async processImageFromUrl(imageUrl: string): Promise<ParsedOcrResult> {
    if (!this.client) {
      this.logger.error('Vision Client is not initialized!');
      throw new Error('Vision Service is not available.');
    }

    this.logger.log(`Processing image from URL: ${imageUrl}`);

    try {
      const [result] = await this.client.documentTextDetection({
        image: { source: { imageUri: imageUrl } },
        imageContext: { languageHints: ['th', 'en'] },
      });

      const annotation = result;

      if (result.error) {
        this.logger.error(`Vision API returned an error: ${result.error.message}`);
        throw new Error(`Vision API Error: ${result.error.message}`);
      }

      if (!annotation || !annotation.fullTextAnnotation) {
        this.logger.warn(`No text found by Vision AI for: ${imageUrl}`);
        return {
          amount: 0,
          date: null,
          merchant: 'N/A',
          items: [],
          description: 'No text detected',
          taxId: null,
          rawText: '',
        };
      }

      this.logger.debug(`Received annotation for: ${imageUrl}`);
      return this.parseVisionApiResponse(annotation);
    } catch (error) {
      this.logger.error(`Error processing ${imageUrl}: ${error.message}`, error.stack);
      throw new Error(`Vision API processing failed: ${error.message}`);
    }
  }
}
