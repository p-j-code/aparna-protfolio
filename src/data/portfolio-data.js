// Portfolio Data - All content in one place
export const portfolioData = {
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
        "Designed complete packaging for Nataraj 24 Colour Pencils featuring original character illustrations",
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

export const { personalInfo, about, projects, skills, experience, education } =
  portfolioData;
