import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import formidable from 'formidable';
import Tesseract from "tesseract.js";
import { getPageSummary, getSimplifiedLanguage } from "@/openAI";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle form data manually
  },
};

export async function POST(req, { params }) {
  try {
    const formData = await req.formData();
    let files = formData.getAll('file');  // Get all files under the "file" key

    console.log("Form data:", formData); // Log form data to check

    if (!files || files.length === 0) {
      return new NextResponse('No files uploaded', { status: 400 });
    }

    let ocrResults = []; // Array to store OCR results

    // Loop through all files
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      console.log("Processing file:", file.name);

      // Create file path for saving the uploaded image
      const filePath = path.join(process.cwd(), 'public/uploads', file.name);
      console.log("Saving file to:", filePath); // Log the file path

      // Convert the file to a buffer and write it to the disk
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.promises.writeFile(filePath, buffer);

      // OCR processing with Tesseract.js
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: (m) => console.log(m),
      });

      // Add the OCR result to the response array
      ocrResults.push({ fileName: file.name, text });

      // Delete the file after processing
      await fs.promises.unlink(filePath);
      console.log("File deleted:", filePath); // Log deletion confirmation
    }

    const results = await Promise.all(
      ocrResults.map(async (item) => {
        let simpleLang = "";
        let summary = "";
        simpleLang = await getSimplifiedLanguage(item.text, 10);
        summary = await getPageSummary(item.text, 10);
    
        return { ...item, simpleLang, summary };
      })
    );
    
    // Return the array of OCR results after all async operations complete
    return NextResponse.json(results);
    
  } catch (error) {
    console.error("Error handling file upload:", error);
    return new NextResponse('Error processing the files', { status: 500 });
  }
}
