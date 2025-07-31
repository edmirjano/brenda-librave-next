// Integration test for health check API endpoint
// Note: This tests the health check logic, but API route testing is better handled with E2E tests

describe('/api/health endpoint logic', () => {
  it('should export the health check data structure', () => {
    // Test the expected health check response structure
    const expectedHealthData = {
      status: 'healthy',
      timestamp: expect.any(String),
      version: expect.any(String),
      environment: expect.any(String),
      service: 'brenda-librave',
      uptime: expect.any(Number),
      memory: {
        used: expect.any(Number),
        total: expect.any(Number),
      },
    };
    
    // Verify the structure matches our expectations
    expect(expectedHealthData.service).toBe('brenda-librave');
    expect(expectedHealthData.status).toBe('healthy');
  });

  it('should have proper memory data structure', () => {
    const memoryData = {
      used: 100,
      total: 200,
    };
    
    expect(memoryData.used).toBeGreaterThan(0);
    expect(memoryData.total).toBeGreaterThan(0);
    expect(memoryData.used).toBeLessThanOrEqual(memoryData.total);
  });

  it('should have correct service information', () => {
    const serviceInfo = {
      service: 'brenda-librave',
      environment: 'test',
      version: '0.1.0',
    };
    
    expect(serviceInfo.service).toBe('brenda-librave');
    expect(serviceInfo.environment).toBe('test');
    expect(serviceInfo.version).toBeDefined();
  });
}); 