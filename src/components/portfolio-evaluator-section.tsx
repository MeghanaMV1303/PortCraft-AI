'use client';

import { useState } from 'react';
import { evaluatePortfolio } from '@/ai/flows/evaluate-portfolio';
import type { EvaluatePortfolioOutput } from '@/ai/flows/evaluate-portfolio';
import type { PortfolioData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Star, Lightbulb, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PortfolioEvaluatorSectionProps {
  portfolioData: PortfolioData;
}

export function PortfolioEvaluatorSection({ portfolioData }: PortfolioEvaluatorSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluatePortfolioOutput | null>(null);
  const { toast } = useToast();

  const handleEvaluatePortfolio = async () => {
    setIsLoading(true);
    setEvaluation(null);
    try {
      const input = {
        portfolioData: {
          name: portfolioData.name,
          headline: portfolioData.headline,
          aboutMe: portfolioData.aboutMe,
          skills: portfolioData.skills.map(s => s.name),
          experience: portfolioData.experiences.map(e => ({ role: e.role, company: e.company, description: e.description })),
          projects: portfolioData.projects.map(p => ({ title: p.title, description: p.description })),
        }
      };
      const result = await evaluatePortfolio(input);
      if (result) {
        setEvaluation(result);
        toast({
          title: 'Evaluation Complete!',
          description: 'Your portfolio has been analyzed by our AI career coach.',
        });
      }
    } catch (error) {
      console.error('Error evaluating portfolio:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with the evaluation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Portfolio Evaluator</CardTitle>
        <CardDescription>
          Get instant feedback on your portfolio from an AI-powered career coach.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleEvaluatePortfolio} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Evaluate My Portfolio
        </Button>

        {evaluation && (
          <div className="mt-6 space-y-6">
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="text-yellow-500"/>
                        Overall Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Progress value={evaluation.score} className="w-full" />
                        <span className="text-2xl font-bold text-primary">{evaluation.score}/100</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="text-green-500"/>
                        Strengths
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{evaluation.strengths}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="text-blue-500"/>
                        Suggestions for Improvement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {evaluation.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
