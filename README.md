# Aparna Munagekar - Portfolio Website

A modern, responsive portfolio website built with Next.js 13+ and Tailwind CSS.

## 🚀 Features

- **Responsive Design**: Works perfectly on all devices
- **Modern UI/UX**: Smooth animations, gradient designs, interactive elements
- **Performance Optimized**: Fast loading with Next.js optimizations
- **SEO Ready**: Meta tags, Open Graph, sitemap
- **Easy Content Management**: All content in one data file
- **Contact Form**: Ready for EmailJS integration
- **Deployment Ready**: Configured for Vercel/Netlify

## 📦 Installation

```bash
npm install
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Resume editor password
RESUME_PASSWORD=your_password_here

# Client-accessible variable (must be prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_RESUME_PASSWORD=your_password_here
```

This enables password protection for the resume editor both on server and client side.

After setting up the environment variables, restart the development server for the changes to take effect:

```bash
# Stop the current server if running, then
npm run dev
```

## 🛠 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Updating Content

Edit `src/data/portfolio-data.js` to update:

- Personal information
- Projects
- Skills
- Experience
- Education

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm run deploy:vercel
```

### Netlify

```bash
npm run deploy:netlify
```

## 📧 Contact Form Setup (Optional)

1. Sign up for [EmailJS](https://www.emailjs.com/)
2. Create a service and template
3. Copy your IDs to `.env.local`
4. Add EmailJS script to your layout

## 🎨 Customization

- **Colors**: Edit `tailwind.config.js`
- **Fonts**: Update in `app/layout.js`
- **Animations**: Modify in `globals.css`

## 📄 License

© 2025 Aparna Munagekar. All rights reserved.

# aparna-protfolio
