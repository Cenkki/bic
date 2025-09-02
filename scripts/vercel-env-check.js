#!/usr/bin/env node

/**
 * Script to check if required environment variables are set for Vercel deployment
 */

console.log('🔍 Checking environment variables for Vercel deployment...\n');

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

const optionalEnvVars = [
  'EMAIL_SERVER',
  'EMAIL_FROM',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'ENABLE_TORI_ADAPTER'
];

let missingRequired = [];
let missingOptional = [];

// Check required environment variables
console.log('📋 Required Environment Variables:');
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: Set`);
  } else {
    console.log(`  ❌ ${envVar}: Missing`);
    missingRequired.push(envVar);
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: Set`);
  } else {
    console.log(`  ⚠️  ${envVar}: Not set (optional)`);
    missingOptional.push(envVar);
  }
});

console.log('\n📊 Summary:');
if (missingRequired.length === 0) {
  console.log('  ✅ All required environment variables are set!');
  console.log('  🚀 You should be ready to deploy to Vercel.');
} else {
  console.log(`  ❌ ${missingRequired.length} required environment variables are missing:`);
  missingRequired.forEach(envVar => console.log(`    - ${envVar}`));
  console.log('\n  💡 Please set these environment variables in your Vercel project settings.');
}

if (missingOptional.length > 0) {
  console.log(`\n  ⚠️  ${missingOptional.length} optional environment variables are not set:`);
  missingOptional.forEach(envVar => console.log(`    - ${envVar}`));
  console.log('  ℹ️  These are optional but may be needed for certain features.');
}

console.log('\n📝 To set environment variables in Vercel:');
console.log('  1. Go to your Vercel dashboard');
console.log('  2. Select your project');
console.log('  3. Go to Settings > Environment Variables');
console.log('  4. Add the missing variables');
console.log('  5. Redeploy your application');