# React Admin Dashboard

A full-featured **React Admin Dashboard** with dynamic data visualization, forms, automation, and API integration.  
Built with **React**, **TypeScript**, **Tailwind CSS**, **Vite**, **React Hook Form**, **Zod**, **DataGrid**, and **n8n Webhooks**.

## Features

### General
- Top navigation bar with **theme toggle**, **settings**, and **notifications**
- Side navigation (drawer) with **admin panel links**
- Dashboard page summarizing all sections with dynamic charts (Bar, Pie, Line)
- Fully responsive and modern UI

### Pages
1. **Dashboard** – summary and analytics of all sections  
2. **Groups** – automation workflow:  
   - User fills a Google Form  
   - Data goes to Google Sheets  
   - Linked to n8n Webhook → fetch data dynamically  
   - Data displayed in **DataTable**
   - [Live Demo](https://loquacious-cocada-89c9a2.netlify.app/groups)
3. **Invoices** – fetch data from API  
   - Uses **DataGrid**  
   - Add new invoices dynamically  
   - View all invoices in a single page
4. **Profile** – dynamic form using **React Hook Form** + **Zod**  
   - Full validation implemented
5. **Calendar** – add, edit, delete tasks  
6. **FAQ** – frequently asked questions section  
7. **Charts** – Bar, Pie, Line charts update dynamically with analytics  

## Tech Stack
- React  
- TypeScript  
- Tailwind CSS  
- Vite  
- React Hook Form + Zod  
- DataGrid / DataTable  
- n8n Webhooks integration  

## How to Run Locally
```bash
git clone https://github.com/mohamed0155065/React-admin-dashboard.git
cd React-admin-dashboard
npm install
npm run dev
