import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function parseFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();

  switch (extension) {
    case 'txt':
      return await parseTxt(file);
    case 'pdf':
      return await parsePdf(file);
    case 'docx':
      return await parseDocx(file);
    case 'pptx':
      return await parseTxt(file); // fallback for presentation slides
    default:
      return await parseTxt(file);
  }
}

async function parseTxt(file) {
  const text = await file.text();
  return {
    text,
    pageCount: 1,
    wordCount: text.split(/\s+/).length,
  };
}

async function parsePdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    fullText += `\n--- Page ${i} ---\n` + pageText;
  }

  return {
    text: fullText,
    pageCount: pdf.numPages,
    wordCount: fullText.split(/\s+/).length,
  };
}

async function parseDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;

  return {
    text,
    pageCount: Math.ceil(text.length / 3000),
    wordCount: text.split(/\s+/).length,
  };
}
