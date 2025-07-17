'use client';

import type { Contact } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactSectionProps {
  contact: Contact;
  setContact: (contact: Contact) => void;
}

export function ContactSection({ contact, setContact }: ContactSectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact & Socials</CardTitle>
        <CardDescription>Let people know how to reach you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" value={contact.email} onChange={handleChange} placeholder="your.email@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub Username</Label>
          <Input id="github" name="github" value={contact.github} onChange={handleChange} placeholder="your-github-handle" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input id="linkedin" name="linkedin" value={contact.linkedin} onChange={handleChange} placeholder="your-linkedin-profile" />
        </div>
      </CardContent>
    </Card>
  );
}
