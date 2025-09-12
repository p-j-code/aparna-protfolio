const { useState, useEffect } = require("react");

// In your portfolio site
const ResumeDownload = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    fetch("/api/resume/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPdfUrl(data.pdfUrl);
        }
      });
  }, []);

  if (!pdfUrl) return null;

  return (
    <a
      href={pdfUrl}
      download="Aparna-Munagekar-Resume.pdf"
      className="download-button"
    >
      Download Resume (PDF)
    </a>
  );
};

export default ResumeDownload;
