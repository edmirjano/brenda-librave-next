import { NextRequest } from 'next/server';

import { GET, POST } from '@/app/api/exchange-rate/route';

// Mock Prisma
const mockPrisma = {
  exchangeRate: {
    findFirst: jest.fn(),
    updateMany: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}));

describe('/api/exchange-rate endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/exchange-rate', () => {
    it('should return exchange rate from database', async () => {
      const mockRate = {
        rate: 110.5,
        updatedAt: new Date('2024-01-01'),
      };

      mockPrisma.exchangeRate.findFirst.mockResolvedValue(mockRate);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.rate).toBe(110.5);
      expect(data.lastUpdated).toBeDefined();
      expect(data.isDefault).toBeUndefined();
    });

    it('should return default rate when no rate in database', async () => {
      mockPrisma.exchangeRate.findFirst.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.rate).toBe(100); // DEFAULT_EXCHANGE_RATE
      expect(data.isDefault).toBe(true);
    });

    it('should handle database errors gracefully', async () => {
      mockPrisma.exchangeRate.findFirst.mockRejectedValue(new Error('Database error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.rate).toBe(100); // DEFAULT_EXCHANGE_RATE
      expect(data.isDefault).toBe(true);
    });
  });

  describe('POST /api/exchange-rate', () => {
    it('should update exchange rate successfully', async () => {
      const newRate = {
        rate: 115.0,
        updatedAt: new Date(),
      };

      mockPrisma.exchangeRate.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.exchangeRate.create.mockResolvedValue(newRate);

      const request = new NextRequest('http://localhost:3000/api/exchange-rate', {
        method: 'POST',
        body: JSON.stringify({ rate: 115.0 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.rate).toBe(115.0);
      expect(data.lastUpdated).toBeDefined();
    });

    it('should reject invalid rate values', async () => {
      const request = new NextRequest('http://localhost:3000/api/exchange-rate', {
        method: 'POST',
        body: JSON.stringify({ rate: -10 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Valid rate is required');
    });

    it('should reject non-numeric rates', async () => {
      const request = new NextRequest('http://localhost:3000/api/exchange-rate', {
        method: 'POST',
        body: JSON.stringify({ rate: 'invalid' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Valid rate is required');
    });

    it('should handle database errors during update', async () => {
      mockPrisma.exchangeRate.updateMany.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/exchange-rate', {
        method: 'POST',
        body: JSON.stringify({ rate: 115.0 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update exchange rate');
    });
  });
});