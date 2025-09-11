# Password-Protected Resume Editor

This feature allows you to view and edit your resume directly from the browser with password protection.

## How it works

1. The resume data is stored in a JSON file at `src/data/resume-data.json`
2. The page is protected with a password stored in your `.env.local` file
3. After authentication, you can:
   - View the resume in a format that's ready to print
   - Switch to the editor to make changes to any part of the resume
   - Save changes, which updates the JSON file directly

## Setup

1. Set your password in `.env.local`:

   ```
   RESUME_PASSWORD=yourSecurePassword123
   ```

   Change this to a strong password!

2. Access the resume at `/resume` in your browser
3. Enter your password to access the editor

## Features

- Direct on-page editing (no forms)
- Add/remove sections for experience, education, skills, and projects
- Print-ready resume view
- Mobile-friendly interface
- Security through password protection

## Technical Details

- Uses Next.js server components and client components
- Authentication state is stored in sessionStorage
- Password is verified server-side during save operations
- File operations happen server-side through API endpoints
