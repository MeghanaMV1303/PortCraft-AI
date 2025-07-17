'use client';

import { useEffect, useState } from 'react';
import type { PortfolioData } from '@/lib/types';
import { PortfolioPreview } from '@/components/portfolio-preview';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem('portfolioData');
      if (data) {
        setPortfolioData(JSON.parse(data));
      } else {
        setError('No portfolio data found. Please create your portfolio first.');
      }
    } catch (e) {
      console.error('Failed to parse portfolio data from localStorage', e);
      setError('Could not load portfolio data. It might be corrupted.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <h1 className="text-xl font-semibold text-destructive mb-2">An Error Occurred</h1>
            <p className="text-muted-foreground">{error || 'Something went wrong.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main>
      <PortfolioPreview {...portfolioData} isPublicView={true} />
    </main>
  );
}
