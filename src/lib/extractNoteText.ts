export type ExtractionProgress = (message: string) => void;

export async function extractTextFromFile(file: File, onProgress: ExtractionProgress): Promise<string> {
  if (file.type === 'application/pdf') return extractPdfText(file, onProgress);
  if (file.type.startsWith('image/')) return extractImageText(file, onProgress);
  throw new Error('Unsupported file type');
}

async function extractPdfText(file: File, onProgress: ExtractionProgress): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;

  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    onProgress(`Reading page ${pageNumber} of ${pdf.numPages}...`);
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => ('str' in item ? item.str : '')).join(' '));
  }
  return pages.join('\n\n').trim();
}

async function extractImageText(file: File, onProgress: ExtractionProgress): Promise<string> {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng', 1, {
    logger: message => {
      if (message.status === 'recognizing text') {
        onProgress(`Recognizing text ${Math.round(message.progress * 100)}%...`);
      }
    },
  });
  try {
    const { data } = await worker.recognize(file);
    return data.text.trim();
  } finally {
    await worker.terminate();
  }
}
