import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database helper functions
export const db = {
  // Article operations
  article: {
    async findMany(params?: {
      where?: any;
      orderBy?: any;
      take?: number;
      skip?: number;
      include?: any;
    }) {
      try {
        return await prisma.article.findMany(params);
      } catch (error) {
        logger.error('Error fetching articles', { error });
        throw error;
      }
    },

    async findUnique(where: any, include?: any) {
      try {
        return await prisma.article.findUnique({ where, include });
      } catch (error) {
        logger.error('Error fetching article', { error });
        throw error;
      }
    },

    async create(data: any) {
      try {
        return await prisma.article.create({ data });
      } catch (error) {
        logger.error('Error creating article', { error });
        throw error;
      }
    },

    async update(where: any, data: any) {
      try {
        return await prisma.article.update({ where, data });
      } catch (error) {
        logger.error('Error updating article', { error });
        throw error;
      }
    },

    async delete(where: any) {
      try {
        return await prisma.article.delete({ where });
      } catch (error) {
        logger.error('Error deleting article', { error });
        throw error;
      }
    },

    async count(where?: any) {
      try {
        return await prisma.article.count({ where });
      } catch (error) {
        logger.error('Error counting articles', { error });
        throw error;
      }
    },
  },

  // Category operations
  category: {
    async findMany(params?: { where?: any; orderBy?: any; include?: any }) {
      try {
        return await prisma.category.findMany(params);
      } catch (error) {
        logger.error('Error fetching categories', { error });
        throw error;
      }
    },

    async findUnique(where: any) {
      try {
        return await prisma.category.findUnique({ where });
      } catch (error) {
        logger.error('Error fetching category', { error });
        throw error;
      }
    },

    async upsert(where: any, create: any, update: any) {
      try {
        return await prisma.category.upsert({ where, create, update });
      } catch (error) {
        logger.error('Error upserting category', { error });
        throw error;
      }
    },
  },

  // Tag operations
  tag: {
    async findMany(params?: { where?: any; orderBy?: any }) {
      try {
        return await prisma.tag.findMany(params);
      } catch (error) {
        logger.error('Error fetching tags', { error });
        throw error;
      }
    },

    async upsert(where: any, create: any, update: any) {
      try {
        return await prisma.tag.upsert({ where, create, update });
      } catch (error) {
        logger.error('Error upserting tag', { error });
        throw error;
      }
    },
  },

  // User operations
  user: {
    async findUnique(where: any, include?: any) {
      try {
        return await prisma.user.findUnique({ where, include });
      } catch (error) {
        logger.error('Error fetching user', { error });
        throw error;
      }
    },

    async create(data: any) {
      try {
        return await prisma.user.create({ data });
      } catch (error) {
        logger.error('Error creating user', { error });
        throw error;
      }
    },

    async update(where: any, data: any) {
      try {
        return await prisma.user.update({ where, data });
      } catch (error) {
        logger.error('Error updating user', { error });
        throw error;
      }
    },
  },
};

// Disconnect on shutdown
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}
