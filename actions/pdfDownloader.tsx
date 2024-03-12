"use server";

import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function modifyPdf(userName: string) {
  const url = "http://localhost:3000/SkillsbridgeCertificate.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
  console.log(existingPdfBytes);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // Insert user's name at the specified coordinates
  firstPage.drawText(`Name: ${userName}`, {
    x: 100, // Adjust the x-coordinate as needed
    y: height - 150, // Adjust the y-coordinate as needed
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0), // Black color
    rotate: degrees(0), // Rotation angle (optional)
  });

  // Rest of your existing code

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
