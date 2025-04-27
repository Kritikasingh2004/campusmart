# CampusMart

![CampusMart](./public/campusmart.png)

A second-hand marketplace application designed for campus communities. CampusMart connects students who want to sell items they no longer need with those looking for affordable alternatives.

## Overview

CampusMart helps:

- Reduce waste and promote sustainability
- Make education more affordable through second-hand textbook sales
- Help students furnish their living spaces on a budget
- Create a trusted community marketplace specific to your campus

This project was built as a final year academic project using modern web technologies.

## Key Features

- **User Authentication** with Google via Supabase
- **User Profiles** with customizable information
- **Listings Management** for buying and selling items
- **Search & Filters** by category, location, and price
- **Responsive Design** for all devices

## Tech Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS, ShadCN UI
- Supabase (Auth & PostgreSQL)
- React Hook Form with Zod validation

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- Supabase account

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Kritikasingh2004/campusmart.git
   cd campusmart
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file with:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

For detailed development information, please refer to the [Project Development Requirements (PDR)](./PDR.md) document.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [ShadCN UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
