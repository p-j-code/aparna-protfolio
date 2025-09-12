"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { upload } from "@vercel/blob/client";

export default function PDFGenerator({ resumeData, password }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [message, setMessage] = useState("");

  const generateAndPublishPDF = async () => {
    setIsGenerating(true);
    setMessage("");

    try {
      // Get the resume element
      const element = document.getElementById("resume-content");

      // Generate canvas with lower quality for smaller size
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced from 2 to 1.5 for smaller file size
        useCORS: true,
        logging: false,
        imageTimeout: 0,
        quality: 0.92, // Slightly reduce quality
      });

      // Create PDF with compression
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
        compress: true, // Enable compression
      });

      const imgWidth = 8.5;
      const pageHeight = 11;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Convert to JPEG for smaller size (PNG is larger)
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Get PDF as blob
      const pdfBlob = pdf.output("blob");

      // Check file size
      const fileSizeMB = pdfBlob.size / (1024 * 1024);
      console.log(`PDF size: ${fileSizeMB.toFixed(2)} MB`);

      if (fileSizeMB > 4) {
        setMessage("✗ PDF too large. Try removing some content.");
        return;
      }

      // Direct upload to Vercel Blob
      const fileName = `${resumeData.name
        .replace(/\s+/g, "-")
        .toLowerCase()}-resume.pdf`;

      const blob = await upload(fileName, pdfBlob, {
        access: "public",
        handleUploadUrl: "/api/resume/upload",
      });

      setPublishedUrl(blob.url);
      setMessage("✓ Resume published successfully!");

      // Also trigger download
      pdf.save(fileName);

      // Copy URL to clipboard
      navigator.clipboard.writeText(blob.url);

      // Save URL to database for portfolio access
      await fetch("/api/resume/save-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          pdfUrl: blob.url,
          fileName: fileName,
        }),
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setMessage("✗ Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={generateAndPublishPDF}
        disabled={isGenerating}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
      >
        {isGenerating ? "Generating PDF..." : "Publish PDF"}
      </button>

      {message && (
        <span
          className={message.includes("✓") ? "text-green-600" : "text-red-600"}
        >
          {message}
        </span>
      )}

      {publishedUrl && (
        <div className="flex flex-col gap-1">
          <a
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            View Published PDF
          </a>
          <span className="text-xs text-gray-500">
            URL copied to clipboard!
          </span>
        </div>
      )}
    </div>
  );
}
