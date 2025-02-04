import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";
import { getPageSummary, getSimplifiedLanguage } from "@/openAI";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file');

    if (!files || files.length === 0) {
      return new NextResponse('No files uploaded', { status: 400 });
    }

    const ocrResults = [];

    for (const file of files) {
      console.log("Processing file:", file.name);

      // Directly process the buffer without saving to disk
      const buffer = Buffer.from(await file.arrayBuffer());

      const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
        logger: (m) => console.log(m),
      });

      ocrResults.push({ fileName: file.name, text });
    }

    const results = await Promise.all(
      ocrResults.map(async (item) => {
        const simpleLang = await getSimplifiedLanguage(item.text, 10);
        const summary = await getPageSummary(item.text, 10);
        return { ...item, simpleLang, summary };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error handling file upload:", error);
    return new NextResponse('Error processing the files', { status: 500 });
  }
}
