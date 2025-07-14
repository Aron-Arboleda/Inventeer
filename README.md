# Inventeer: RFID SGTIN-96 Product Generator

Link: https://inventeer.vercel.app/

A modern, production-ready web application for generating product records with attached RFID codes using the SGTIN-96 standard. Built for both single (per order) and bulk generation workflows, Inventeer streamlines the creation and export of RFID-tagged product data for manufacturing, logistics, and retail.

## Features

- 🏷️ Generate SGTIN-96 RFID codes for products (GS1/EPC compliant)
- 📝 Per-order (single) and bulk product record generation
- 📋 Copy/export results for use in Google Sheets or other systems
- ⚡ Fast, modern UI with instant feedback and animations
- 🖨️ Table output formatted for easy printing or spreadsheet import
- 🔒 TypeScript for type safety
- 🎨 TailwindCSS for styling
- 🌐 Deployed on Vercel for instant updates

## Technologies Used

- **React** (with React Router) – UI and routing
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **react-hook-form** – Form management
- **shadcn/ui** – UI components
- **lucide-react** – Icon set
- **Vercel** – Deployment
- **Node.js/Express** – Server-side rendering (SSR)

## File Structure (Key Parts)

```
app/
  routes/
    dashboard/
      index.tsx           # Per-order SGTIN-96 generator UI
      bulk-generator/
        index.tsx         # Bulk SGTIN-96 generator UI
  components/             # Shared UI components
  features/               # Feature modules (auth, dashboard, etc.)
  hooks/                  # Custom React hooks
  lib/                    # Utility functions
  types/                  # TypeScript types
  utils/                  # Logic (SGTIN-96 encoding, etc.)
public/                   # Static assets
server/                   # Server entry (SSR)
vercel/                   # Vercel deployment scripts
```

### Deployment

Deployed automatically to [Vercel](https://vercel.com/). Every push to `main` triggers a new deployment.

## Author

- **Aron Arboleda**
- [github.com/Aron-Arboleda](https://github.com/Aron-Arboleda)

## Project Timeline

- **Initial development:** July 2025
- **Active maintenance:** Ongoing

---

Built with ❤️ using React Router, TypeScript, and modern web technologies.

## License

&copy; 2025 Aron Arboleda. All rights reserved.
