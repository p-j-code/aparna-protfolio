"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { put } from "@vercel/blob";

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

      // Generate canvas from HTML
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });

      const imgWidth = 8.5;
      const pageHeight = 11;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Get PDF as blob
      const pdfBlob = pdf.output("blob");

      // Upload to Vercel Blob
      const response = await fetch("/api/resume/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          pdfBase64: await blobToBase64(pdfBlob),
          fileName: `${resumeData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-resume.pdf`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPublishedUrl(result.pdfUrl);
        setMessage("✓ Resume published successfully!");

        // Also trigger download
        pdf.save(`${resumeData.name.replace(/\s+/g, "-")}-resume.pdf`);

        // Copy URL to clipboard
        navigator.clipboard.writeText(result.pdfUrl);
      } else {
        setMessage("✗ Failed to publish resume");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setMessage("✗ Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
        <a
          href={publishedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          View Published PDF
        </a>
      )}
    </div>
  );
}
