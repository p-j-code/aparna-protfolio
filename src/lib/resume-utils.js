// File operations helpers
import { kv } from "@vercel/kv";
import { promises as fs } from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

// Default/initial resume data - only used for first-time setup
const getDefaultResumeData = async () => {
  try {
    // Try to read from the JSON file for initial data
    const filePath = path.join(process.cwd(), "src/data/resume-data.json");
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Fallback to hardcoded default if file doesn't exist
    return {
      projectName: "aparna-portfolio",
      personalInfo: {
        name: "Aparna Munagekar",
        title:
          "Graphic Designer | Packaging Design Specialist | Visual Storyteller",
        email: "helloaparnam@gmail.com",
        phone: "+91 99870 37136",
        location: "Mumbai, Maharashtra, India",
        linkedin: "https://linkedin.com/in/aparna-munagekar",
        behance: "https://behance.net/aparnamunagekar1",
        instagram: "@official.nataraj",
        resumeFile: "/resume-aparna-munagekar.pdf",
      },
      about: {
        description: [
          "I'm a passionate Graphic Designer specializing in packaging design and visual storytelling. With a keen eye for detail and a love for vibrant, meaningful design, I create work that connects with audiences on an emotional level.",
          "My recent work includes designing the complete packaging for Nataraj Colour Pencils series (10, 12, and 24 colours), now available in stores nationwide. I believe great design isn't just about aesthetics—it's about creating experiences that resonate with people.",
        ],
        stats: [
          {
            value: "10+",
            label: "Happy Clients",
          },
          {
            value: "25+",
            label: "Projects Done",
          },
          {
            value: "20K+",
            label: "Social Shares",
          },
          {
            value: "1",
            label: "National Brand",
          },
        ],
      },
      projects: [
        {
          id: 1,
          title: "Nataraj Colour Pencils Collection",
          category: "Packaging Design",
          description:
            "Complete packaging design series for national brand featuring vibrant character illustrations and child-friendly visuals",
          longDescription:
            'Designed the complete product packaging for Nataraj Colour Pencils series (10, 12, and 24 colours), creating original character designs and illustrated scenes that appeal to children. The packaging emphasizes the product\'s "super smooth and bright colours" and is now available in retail stores nationwide.',
          tags: ["Packaging", "Illustration", "Brand Design"],
          stats: "Now in stores nationwide",
          featured: true,
          images: [
            "/projects/color-pancels/img24-fs.png",
            "/projects/color-pancels/img24.png",
            "/projects/color-pancels/img10.png",
            "/projects/color-pancels/img12-fs.png",
            "/projects/color-pancels/img12.png",
          ],
          color: "from-red-500 to-yellow-500",
        },
        {
          id: 2,
          title: "Children's Book Series",
          category: "Publication Design",
          description:
            "Illustrated book covers featured at the 2025 Mumbai Book Fair",
          longDescription:
            "Created a series of illustrated book covers that combine hand-drawn illustrations with modern typography. These designs were featured at the prestigious 2025 Mumbai Book Fair.",
          tags: ["Illustration", "Typography", "Book Design"],
          stats: "Mumbai Book Fair 2025",
          featured: true,
          images: [],
          color: "from-purple-500 to-pink-500",
        },
        {
          id: 3,
          title: "World Environment Day",
          category: "Campaign Design",
          description:
            "Poster series for environmental awareness achieving viral organic reach",
          longDescription:
            "Designed a poster series for World Environment Day 2025 that combined bold typography with environmental themes. The campaign achieved significant organic reach on social media.",
          tags: ["Poster Design", "Social Impact", "Typography"],
          stats: "20,000+ shares",
          featured: true,
          images: [],
          color: "from-green-500 to-teal-500",
        },
        {
          id: 4,
          title: "SME Brand Redesigns",
          category: "Brand Identity",
          description: "Complete rebranding for 3 small-to-medium enterprises",
          longDescription:
            "Led complete rebranding projects for three SMEs, including logo redesign, brand guidelines development, and marketing collateral creation. Successfully aligned visuals with updated market positioning.",
          tags: ["Logo Design", "Brand Guidelines", "Visual Identity"],
          stats: "3 successful launches",
          featured: true,
          images: [],
          color: "from-blue-500 to-indigo-500",
        },
      ],
      skills: [
        {
          name: "Packaging Design",
          level: 95,
          category: "design",
        },
        {
          name: "Brand Identity",
          level: 90,
          category: "design",
        },
        {
          name: "Illustration",
          level: 92,
          category: "design",
        },
        {
          name: "Typography",
          level: 88,
          category: "design",
        },
        {
          name: "Adobe Illustrator",
          level: 95,
          category: "software",
        },
        {
          name: "Adobe Photoshop",
          level: 90,
          category: "software",
        },
        {
          name: "Adobe InDesign",
          level: 85,
          category: "software",
        },
        {
          name: "Canva",
          level: 88,
          category: "software",
        },
      ],
      experience: [
        {
          position: "Graphic Designer",
          company: "JUST DESIGN STUDIO",
          location: "Mumbai",
          duration: "Aug 2024 – Present",
          responsibilities: [
            "Designed complete packaging for Nataraj Colour Pencils series (10, 12, and 24 colours) featuring original character illustrations",
            "Conceptualized and produced print-ready collateral for 10+ client accounts",
            "Led rebranding projects for 3 SMEs including logo redesign and brand guidelines",
            "Created sustainable packaging solutions contributing to 15% sales uplift",
          ],
        },
      ],
      education: [
        {
          degree: "Diploma in Applied Arts – Graphic Design",
          institution: "Sophia Shree B.K. Somani Memorial Polytechnic",
          location: "Mumbai",
          focus: "Typography, Publication Design, Visual Communication",
        },
        {
          degree: "Higher Secondary Certificate (HSC) – Arts",
          institution: "Kirti M. Doongursee College",
          location: "Mumbai",
        },
      ],
    };
  }
};

export async function getResumeData() {
  try {
    if (isProduction) {
      // Always get from KV storage in production
      let data = await kv.get("resume-data");

      if (!data) {
        // Only on very first deployment - initialize with default data
        console.log("Initializing resume data in KV storage...");
        const defaultData = await getDefaultResumeData();
        await kv.set("resume-data", defaultData);
        return defaultData;
      }

      return data;
    } else {
      // Development: use file system
      const filePath = path.join(process.cwd(), "src/data/resume-data.json");
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading resume data:", error);
    return await getDefaultResumeData();
  }
}

export async function updateResumeData(newData) {
  try {
    if (isProduction) {
      // Save to Vercel KV - this persists across deployments
      await kv.set("resume-data", newData);

      // Optional: Keep a backup with timestamp
      const timestamp = new Date().toISOString();
      await kv.set(`resume-backup-${timestamp}`, newData);

      return { success: true };
    } else {
      // Development: save to file system
      const filePath = path.join(process.cwd(), "src/data/resume-data.json");
      await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf8");
      return { success: true };
    }
  } catch (error) {
    console.error("Error updating resume data:", error);
    return { success: false, error: error.message };
  }
}

// Optional: Function to get backup history
export async function getResumeBackups() {
  if (!isProduction) return [];

  try {
    const keys = await kv.keys("resume-backup-*");
    return keys;
  } catch (error) {
    console.error("Error getting backups:", error);
    return [];
  }
}

// Optional: Function to restore from backup
export async function restoreFromBackup(backupKey) {
  if (!isProduction)
    return { success: false, error: "Not available in development" };

  try {
    const backupData = await kv.get(backupKey);
    if (backupData) {
      await kv.set("resume-data", backupData);
      return { success: true };
    }
    return { success: false, error: "Backup not found" };
  } catch (error) {
    console.error("Error restoring backup:", error);
    return { success: false, error: error.message };
  }
}

export function checkPassword(password) {
  return password === process.env.RESUME_PASSWORD;
}
