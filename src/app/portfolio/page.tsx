'use client';

import { useEffect, useState } from 'react';
import type { PortfolioData } from '@/lib/types';
import { PortfolioPreview } from '@/components/portfolio-preview';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolio-store';

export default function PortfolioPage() {
  const {
    name,
    headline,
    aboutMe,
    projects,
    skills,
    experiences,
    testimonials,
    contact,
    theme
  } = usePortfolioStore();
  
  const [isLoading, setIsLoading] = useState(true);

  // We use useEffect to ensure the component has mounted on the client
  // before we try to render the portfolio. This avoids hydration mismatches.
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const portfolioData: PortfolioData | null = !isLoading ? {
    name,
    headline,
    aboutMe,
    projects,
    skills,
    experiences,
    testimonials,
    contact,
    theme,
  } : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <h1 className="text-xl font-semibold text-destructive mb-2">An Error Occurred</h1>
            <p className="text-muted-foreground">No portfolio data found. Please create your portfolio first.</p>
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
