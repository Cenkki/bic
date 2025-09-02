# BicyAI - Pyörävahti

A Next.js application for tracking lost/stolen bicycles and finding owners for found bicycles.

## Deployment Instructions

### Deploying to Vercel (Recommended)

1. Push the code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/cenkki/bicyai.git
   git push -u origin main
   ```

2. Visit [Vercel](https://vercel.com) and sign up or log in
3. Click "New Project"
4. Import the GitHub repository
5. Configure environment variables:
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL=https://bicai.voon.fi
   - Other required environment variables
6. Deploy the project
7. Add custom domain `bicai.voon.fi` in Vercel dashboard

### Environment Variables

Create a `.env.production` file with the following variables:
```
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=https://bicai.voon.fi
# Add other required environment variables
```

### Docker Deployment

Build and run with Docker:
```bash
docker build -t bicyai .
docker run -p 3000:3000 --env-file .env.production bicyai
```

## Development

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cron Jobs

The application includes cron jobs for fetching external listings and recomputing matches:
- `npm run cron:fetch` - Fetch listings from external sources
- `npm run cron:match` - Recompute bike matches

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [image-hash Documentation](https://www.npmjs.com/package/image-hash)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
