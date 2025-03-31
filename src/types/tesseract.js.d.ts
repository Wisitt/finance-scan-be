declare module 'tesseract.js' {
    export interface WorkerOptions {
      logger?: (msg: any) => void;
      errorHandler?: (err: any) => void;
      langPath?: string;
      cachePath?: string;
      dataPath?: string;
      workerPath?: string;
      corePath?: string;
      legacyWorker?: boolean;
      legacy?: boolean;
      [key: string]: any;
    }
    
    export interface OsdResult {
      script: string;
      orientation: number;
      angle: number;
      confidence: number;
    }
    
    export interface RecognizeResult {
      data: {
        text: string;
        hocr?: string;
        tsv?: string;
        confidence: number;
        blocks?: any[];
        paragraphs?: any[];
        lines?: any[];
        words?: any[];
        symbols?: any[];
      };
    }
    
    export interface Worker {
      load(langs?: string): Promise<Worker>;
      loadLanguage(langs: string): Promise<Worker>;
      initialize(langs: string): Promise<Worker>;
      reinitialize(langs: string): Promise<Worker>;
      setParameters(params: Record<string, string>): Promise<Worker>;
      recognize(image: Buffer | ImageData | HTMLImageElement | HTMLCanvasElement | string): Promise<RecognizeResult>;
      detect(image: Buffer | ImageData | HTMLImageElement | HTMLCanvasElement | string): Promise<{ data: OsdResult }>;
      terminate(): Promise<void>;
    }
    
    export function createWorker(options?: WorkerOptions): Promise<Worker>;
    export function createScheduler(): any;
    export const recognize: any;
    export const detect: any;
  }