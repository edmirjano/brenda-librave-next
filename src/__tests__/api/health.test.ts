import { NextRequest } from 'next/server';

import { GET } from '@/app/api/health/route';

// Mock the logger
jest.mock('@/lib/logging/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('/api/health endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return healthy status', async () => {
    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('brenda-librave');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('memory');
    expect(data.memory).toHaveProperty('used');
    expect(data.memory).toHaveProperty('total');
  });

  it('should have correct response headers', async () => {
    const response = await GET();

    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
  });

  it('should include system information', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.environment).toBeDefined();
    expect(data.version).toBeDefined();
    expect(typeof data.uptime).toBe('number');
    expect(data.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should include memory usage information', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.memory.used).toBeGreaterThan(0);
    expect(data.memory.total).toBeGreaterThan(0);
    expect(data.memory.used).toBeLessThanOrEqual(data.memory.total);
  });

  it('should log health check completion', async () => {
    const { logger } = require('@/lib/logging/logger');
    
    await GET();

    expect(logger.info).toHaveBeenCalledWith(
      'Health check passed',
      expect.objectContaining({
        status: 'healthy',
        service: 'brenda-librave',
      })
    );
  });
});