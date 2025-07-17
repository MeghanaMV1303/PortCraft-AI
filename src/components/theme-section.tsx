'use client';

import type { ThemeSettings } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette, LayoutTemplate } from 'lucide-react';

interface ThemeSectionProps {
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
}

export function ThemeSection({ theme, setTheme }: ThemeSectionProps) {
  
  const handleThemeChange = (field: keyof ThemeSettings, value: string) => {
    setTheme({ ...theme, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme & Layout</CardTitle>
        <CardDescription>Customize the look and feel of your portfolio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Scheme
          </Label>
          <RadioGroup
            value={theme.colorScheme}
            onValueChange={(value) => handleThemeChange('colorScheme', value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark-theme" />
              <Label htmlFor="dark-theme">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light-theme" />
              <Label htmlFor="light-theme">Light</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Layout Style
          </Label>
          <RadioGroup
            value={theme.layout}
            onValueChange={(value) => handleThemeChange('layout', value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard-layout" />
              <Label htmlFor="standard-layout">Standard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minimal" id="minimal-layout" />
              <Label htmlFor="minimal-layout">Minimal</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
