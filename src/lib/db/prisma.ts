import { PrismaClient } from '@prisma/client';
import { logInfo, logError } from '@/lib/logging/logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Handle connection events
prisma.$on('error', (e) => {
  logError('Prisma error', e, { type: 'database' });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect();
    logInfo('Prisma disconnected successfully');
  } catch (error) {
    logError('Error disconnecting Prisma', error);
  }
};

process.on('beforeExit', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);