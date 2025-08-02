/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';

import DebugPage from '@/app/debug/page';

// Mock the next-auth session
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock the prisma client
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn(),
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// Mock the auth config
jest.mock('@/lib/auth/config', () => ({
  authOptions: {},
}));

const mockGetServerSession = require('next-auth').getServerSession;
const mockPrisma = require('@/lib/db/prisma').prisma;

describe('Debug Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful database connection
    mockPrisma.$queryRaw.mockResolvedValue([]);
    mockPrisma.user.count.mockResolvedValue(5);
    mockPrisma.user.findMany.mockResolvedValue([
      {
        id: '1',
        email: 'admin@brendalibrave.com',
        name: 'Admin User',
        role: 'ADMIN',
        language: 'SQ',
        currency: 'ALL',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        email: 'user@brendalibrave.com',
        name: 'Regular User',
        role: 'USER',
        language: 'SQ',
        currency: 'ALL',
        createdAt: new Date('2024-01-02'),
      },
    ]);
  });

  it('should render debug page title', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('🔧 Debug Information')).toBeInTheDocument();
    expect(
      screen.getByText('Development debugging dashboard for Brënda Librave')
    ).toBeInTheDocument();
  });

  it('should show current phase information', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('📍 Current Development Phase')).toBeInTheDocument();
    expect(screen.getByText('Phase 2: Authentication System')).toBeInTheDocument();
    expect(
      screen.getByText('Authentication system with user registration, login, profile management')
    ).toBeInTheDocument();
  });

  it('should show database status when connected', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    await waitFor(() => {
      expect(screen.getByText('🗄️ Database Status')).toBeInTheDocument();
      expect(screen.getByText('✅')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('should show session info when user is authenticated', async () => {
    const mockSession = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        language: 'SQ',
        currency: 'ALL',
      },
    };

    mockGetServerSession.mockResolvedValue(mockSession);

    render(await DebugPage());

    expect(screen.getByText('👤 Session Information')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('✅ Authenticated')).toBeInTheDocument();
    // Check that USER appears multiple times (session + demo credentials)
    expect(screen.getAllByText('USER').length).toBeGreaterThan(0);
    expect(screen.getAllByText('SQ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ALL').length).toBeGreaterThan(0);
  });

  it('should show not authenticated when no session', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('❌ Not authenticated')).toBeInTheDocument();
  });

  it('should show available routes by phase', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('🛣️ Available Routes by Phase')).toBeInTheDocument();
    expect(screen.getByText('Phase 2 (Current)')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('/auth/login (Login page)')).toBeInTheDocument();
    expect(screen.getByText('/profile (User profile)')).toBeInTheDocument();
    expect(screen.getByText('/debug (This page)')).toBeInTheDocument();
  });

  it('should show quick action links', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('🚀 Quick Actions')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Check Health API' })).toHaveAttribute(
      'href',
      '/api/health'
    );
    expect(screen.getByRole('link', { name: 'Go to Homepage' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Go to Profile' })).toHaveAttribute('href', '/profile');
    // There are multiple "Go to Login" links now (original + demo section)
    expect(screen.getAllByRole('link', { name: 'Go to Login' })).toHaveLength(2);
    // Only one "Go to Register" link (in demo section only)
    expect(screen.getAllByRole('link', { name: 'Go to Register' })).toHaveLength(1);
  });

  it('should show system information', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('⚙️ System Information')).toBeInTheDocument();
    expect(screen.getByText(/Node Version:/)).toBeInTheDocument();
    expect(screen.getByText(/Platform:/)).toBeInTheDocument();
    expect(screen.getByText(/Uptime:/)).toBeInTheDocument();
    expect(screen.getByText(/Memory Usage:/)).toBeInTheDocument();
  });

  it('should show environment variables section', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('🌍 Environment Variables')).toBeInTheDocument();
    expect(screen.getByText('NODE_ENV:')).toBeInTheDocument();
  });

  it('should show demo users section with credentials', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('👥 Demo Users for Testing')).toBeInTheDocument();
    expect(screen.getByText('🔑 Available Demo Credentials')).toBeInTheDocument();

    // Check for demo user credentials (using getAllByText since text appears in multiple places)
    expect(screen.getAllByText('Admin User')).toHaveLength(2); // Credentials + database table
    expect(screen.getAllByText('admin@brendalibrave.com')).toHaveLength(3); // Credentials + database + quick ref
    expect(screen.getByText('Admin123!')).toBeInTheDocument();
    expect(screen.getAllByText('Regular User')).toHaveLength(2); // Credentials + database table
    expect(screen.getAllByText('user@brendalibrave.com')).toHaveLength(2); // Credentials + database table
    expect(screen.getByText('User123!')).toBeInTheDocument();
  });

  it('should show demo users from database', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('🗄️ Demo Users in Database')).toBeInTheDocument();

    // Check for users from database mock
    expect(screen.getAllByText('Admin User')).toHaveLength(2); // Credentials + database table
    expect(screen.getAllByText('Regular User')).toHaveLength(2); // Credentials + database table
    expect(screen.getAllByText('ADMIN')).toHaveLength(2); // One in credentials, one in database table
    expect(screen.getAllByText('USER')).toHaveLength(4); // Three in credentials, one in database table
  });

  it('should show no demo users message when database is empty', async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockPrisma.user.findMany.mockResolvedValue([]);

    render(await DebugPage());

    expect(screen.getByText('No demo users found in database.')).toBeInTheDocument();
    expect(
      screen.getByText('Use the credentials above to create demo accounts via registration.')
    ).toBeInTheDocument();
  });

  it('should show quick testing actions', async () => {
    mockGetServerSession.mockResolvedValue(null);

    render(await DebugPage());

    expect(screen.getByText('⚡ Quick Testing Actions')).toBeInTheDocument();
    // Check that login links exist (original + demo section = 2)
    expect(screen.getAllByRole('link', { name: 'Go to Login' })).toHaveLength(2);
    // Only 1 register link (demo section only)
    expect(screen.getAllByRole('link', { name: 'Go to Register' })).toHaveLength(1);
    expect(
      screen.getByText(
        '💡 Tip: Copy credentials above and paste them into the login form for quick testing.'
      )
    ).toBeInTheDocument();
  });

  it('should show profile link when user is authenticated', async () => {
    const mockSession = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
      },
    };

    mockGetServerSession.mockResolvedValue(mockSession);

    render(await DebugPage());

    expect(screen.getByRole('link', { name: 'View Profile' })).toHaveAttribute('href', '/profile');
  });
});
