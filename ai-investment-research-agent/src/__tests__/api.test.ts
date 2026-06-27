import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/analyze/route';
import { investmentResearchGraph } from '@/services/ai/graph';

// Mock the graph to prevent actual LLM/Search API calls during unit testing
vi.mock('@/services/ai/graph', () => ({
  investmentResearchGraph: {
    invoke: vi.fn(),
  },
}));

describe('POST /api/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if companyName is missing', async () => {
    const req = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid or missing companyName in request body.');
  });

  it('should return 422 if validation node fails', async () => {
    vi.mocked(investmentResearchGraph.invoke).mockResolvedValueOnce({
      isValid: false,
      errors: ['Invalid company name provided.'],
    });

    const req = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ companyName: 'UnknownFakeCompany123' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error).toBe('Validation failed');
    expect(data.details).toContain('Invalid company name provided.');
  });

  it('should return 200 and the final report on success', async () => {
    const mockReport = {
      companyOverview: { companyName: 'NVIDIA', ticker: 'NVDA' },
      financialSummary: { confidenceLevel: 'High' },
      finalRecommendation: 'Invest',
      investmentScore: 90,
      confidenceScore: 95
    };

    vi.mocked(investmentResearchGraph.invoke).mockResolvedValueOnce({
      isValid: true,
      finalReport: mockReport,
    });

    const req = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ companyName: 'NVIDIA' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.finalRecommendation).toBe('Invest');
    expect(data.investmentScore).toBe(90);
  });
});
