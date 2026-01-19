import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

// Sync news every 30 minutes
const job = new CronJob('*/30 * * * *', async () => {
  console.log(`\n[${new Date().toISOString()}] 🔄 Starting scheduled news sync...`);
  
  try {
    // Run the fetch-news script
    execSync('npx tsx scripts/fetch-news.ts', { stdio: 'inherit' });
    console.log(`[${new Date().toISOString()}] ✅ Sync completed successfully`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Sync failed:`, error);
  }
});

console.log('🤖 News sync scheduler started');
console.log('📅 Will fetch news every 30 minutes');
console.log('Press Ctrl+C to stop\n');

// Start the cron job
job.start();

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Stopping scheduler...');
  job.stop();
  prisma.$disconnect();
  process.exit(0);
});
