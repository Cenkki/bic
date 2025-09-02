# BicyAI Deployment Guide

## Vercel Deployment Instructions

To deploy this application to Vercel successfully, you need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. `DATABASE_URL` - PostgreSQL connection string
   - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
   - Example: `postgresql://postgres:password@localhost:5432/bicyai`

2. `NEXTAUTH_SECRET` - A random string used to hash tokens, sign cookies and generate cryptographic keys
   - Generate a random string or use: `openssl rand -base64 32`

3. `NEXTAUTH_URL` - The canonical URL of your site
   - For production: `https://your-domain.com`
   - For Vercel preview deployments: `https://your-project.vercel.app`

### Optional Environment Variables

4. `EMAIL_SERVER` - SMTP server configuration for email sending
   - Format: `smtp://USERNAME:PASSWORD@HOST:PORT`
   - Example: `smtp://user:password@smtp.example.com:587`

5. `EMAIL_FROM` - The email address to send emails from
   - Example: `Your App <noreply@your-domain.com>`

6. `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key (for frontend)

7. `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA secret key (for backend)

8. `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL (for rate limiting)

9. `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token (for rate limiting)

10. `ENABLE_TORI_ADAPTER` - Enable/disable Tori.fi adapter (true/false)

## Database Setup

1. Create a PostgreSQL database (you can use services like Supabase, Render, or Railway)
2. Run the Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your `.env` file with the required environment variables

3. Run the development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

If you encounter a 504 Gateway Timeout error:

1. Check that all required environment variables are set in Vercel
2. Verify that your database is accessible from Vercel (check firewall settings)
3. Test the health endpoint: `/api/health`
4. Check Vercel logs for detailed error messages

## Health Check Endpoints

- `/api/health` - Database connectivity test
- `/api/test` - Basic API functionality test