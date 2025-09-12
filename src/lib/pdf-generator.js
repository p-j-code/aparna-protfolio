import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { put } from "@vercel/blob";

export async function generateResumePDF(resumeData) {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Generate HTML for PDF
    const html = generateResumeHTML(resumeData);

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    });

    await browser.close();

    return {
      success: true,
      pdfBuffer,
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function publishResumePDF(pdfBuffer, name) {
  try {
    const fileName = `${name.replace(/\s+/g, "-").toLowerCase()}-resume.pdf`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Save current version
    const currentBlob = await put(`public/${fileName}`, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
      allowOverwrite: true,
    });

    // Save timestamped backup
    await put(
      `public/archives/${fileName.replace(".pdf", "")}-${timestamp}.pdf`,
      pdfBuffer,
      {
        access: "public",
        contentType: "application/pdf",
      }
    );

    return {
      success: true,
      url: currentBlob.url,
      downloadUrl: currentBlob.downloadUrl || currentBlob.url,
    };
  } catch (error) {
    console.error("Error publishing PDF:", error);
    throw error;
  }
}

function generateResumeHTML(resumeData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData.name} - Resume</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.4;
      color: #2c3e50;
      background: white;
      font-size: 10pt;
    }
    
    .container {
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0;
    }
    
    header {
      text-align: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
    }
    
    h1 {
      font-size: 26pt;
      font-weight: 700;
      color: #9333ea;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }
    
    .tagline {
      font-size: 11pt;
      color: #555;
      font-weight: 500;
      margin-bottom: 6px;
    }
    
    .contact-info {
      font-size: 9.5pt;
      color: #555;
      margin-top: 5px;
    }
    
    .contact-info a {
      color: #9333ea;
      text-decoration: none;
      font-weight: 500;
    }
    
    .header-border {
      height: 2px;
      background: linear-gradient(90deg, #9333ea 0%, #ec4899 50%, #9333ea 100%);
      margin-top: 10px;
    }
    
    section {
      margin-bottom: 12px;
    }
    
    h2 {
      font-size: 12pt;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 6px;
      padding-bottom: 3px;
      border-bottom: 1.5px solid #9333ea;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    h3 {
      font-size: 11pt;
      font-weight: 600;
      color: #34495e;
      margin-bottom: 2px;
    }
    
    .job-title {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }
    
    .company {
      font-weight: 600;
      color: #2c3e50;
      font-size: 10pt;
    }
    
    .date {
      font-size: 9pt;
      color: #7f8c8d;
      font-style: italic;
    }
    
    p {
      margin-bottom: 5px;
      text-align: justify;
      font-size: 9.5pt;
      line-height: 1.4;
    }
    
    ul {
      margin-left: 18px;
      margin-bottom: 5px;
    }
    
    li {
      margin-bottom: 2px;
      font-size: 9.5pt;
      line-height: 1.35;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-top: 6px;
    }
    
    .skill-category {
      margin-bottom: 5px;
      padding: 8px;
      background: rgba(147, 51, 234, 0.05);
      border-radius: 6px;
    }
    
    .skill-category h4 {
      font-size: 10pt;
      font-weight: 600;
      color: #9333ea;
      margin-bottom: 4px;
    }
    
    .education-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .additional-info {
      background: rgba(147, 51, 234, 0.05);
      padding: 10px 12px;
      border-radius: 8px;
      margin-top: 5px;
      border: 1px solid rgba(147, 51, 234, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    ${generateHeaderHTML(resumeData)}
    ${generateSummaryHTML(resumeData)}
    ${generateExperienceHTML(resumeData)}
    ${generateProjectsHTML(resumeData)}
    ${generateSkillsHTML(resumeData)}
    ${generateEducationHTML(resumeData)}
    ${generateAdditionalInfoHTML(resumeData)}
  </div>
</body>
</html>
  `;
}

// Helper functions for generating HTML sections
function generateHeaderHTML(data) {
  return `
    <header>
      <h1>${data.name.toUpperCase()}</h1>
      <div class="tagline">${data.title}</div>
      <div class="contact-info">
        <span>${data.contact.location}</span> •
        <span>${data.contact.phone}</span> •
        <span>${data.contact.email}</span>
        ${
          data.contact.website
            ? `<br/><a href="https://${data.contact.website}">${data.contact.website}</a>`
            : ""
        }
        ${
          data.contact.social?.linkedin
            ? ` • <a href="${data.contact.social.linkedin}">LinkedIn</a>`
            : ""
        }
        ${
          data.contact.social?.behance
            ? ` • <a href="${data.contact.social.behance}">Behance</a>`
            : ""
        }
      </div>
      <div class="header-border"></div>
    </header>
  `;
}

function generateSummaryHTML(data) {
  return `
    <section>
      <h2>Professional Summary</h2>
      <p>${data.summary}</p>
    </section>
  `;
}

function generateExperienceHTML(data) {
  if (!data.experience?.length) return "";

  return `
    <section>
      <h2>Professional Experience</h2>
      ${data.experience
        .map(
          (exp) => `
        <div class="job-title">
          <div>
            <h3>${exp.position}</h3>
            <span class="company">${exp.company} — ${
            exp.location || "Mumbai"
          }</span>
          </div>
          <span class="date">${exp.duration}</span>
        </div>
        ${exp.description ? `<p>${exp.description}</p>` : ""}
        ${
          exp.achievements?.length
            ? `
          <ul>
            ${exp.achievements.map((ach) => `<li>${ach}</li>`).join("")}
          </ul>
        `
            : ""
        }
      `
        )
        .join("")}
    </section>
  `;
}

function generateProjectsHTML(data) {
  if (!data.projects?.length) return "";

  return `
    <section>
      <h2>Key Projects & Achievements</h2>
      ${data.projects
        .map(
          (project) => `
        <div>
          <h3>${project.name}</h3>
          <p>${project.description}</p>
        </div>
      `
        )
        .join("")}
    </section>
  `;
}

function generateSkillsHTML(data) {
  if (data.skillsConfig?.enableCategories && data.skillsConfig?.categories) {
    return `
      <section>
        <h2>Core Competencies</h2>
        <div class="skills-grid">
          ${data.skillsConfig.categories
            .map(
              (cat) => `
            <div class="skill-category">
              <h4>${cat.name}</h4>
              <ul>
                ${cat.skills.map((skill) => `<li>${skill}</li>`).join("")}
              </ul>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  const skills = data.skills || [];
  return `
    <section>
      <h2>Skills</h2>
      <p>${skills.join(" • ")}</p>
    </section>
  `;
}

function generateEducationHTML(data) {
  if (!data.education?.length) return "";

  return `
    <section>
      <h2>Education</h2>
      <div class="education-grid">
        ${data.education
          .map(
            (edu) => `
          <div>
            <h3>${edu.degree}</h3>
            <p>${edu.institution}, ${edu.location}</p>
            ${
              edu.year
                ? `<p style="font-style: italic; color: #7f8c8d;">${edu.year}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function generateAdditionalInfoHTML(data) {
  const hasContent =
    data.additionalInfo?.languages?.length ||
    data.additionalInfo?.interests?.length ||
    data.contact.website;

  if (!hasContent) return "";

  return `
    <section>
      <div class="additional-info">
        ${
          data.additionalInfo?.languages?.length
            ? `
          <p><strong style="color: #9333ea;">Languages:</strong> 
            ${data.additionalInfo.languages
              .map((l) => `${l.name} (${l.level})`)
              .join(" • ")}
          </p>
        `
            : ""
        }
        ${
          data.additionalInfo?.interests?.length
            ? `
          <p><strong style="color: #9333ea;">Interests:</strong> 
            ${data.additionalInfo.interests.join(" • ")}
          </p>
        `
            : ""
        }
        <p><strong style="color: #9333ea;">Online Presence:</strong> 
          ${data.contact.website || ""} 
          ${
            data.contact.social?.behance
              ? ` • ${data.contact.social.behance.replace(/^https?:\/\//, "")}`
              : ""
          }
        </p>
      </div>
    </section>
  `;
}
