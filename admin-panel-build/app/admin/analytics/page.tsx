'use client';

import en from '@/messages/en.json';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{en.navigation.analytics}</h1>
      <p className="text-muted-foreground mb-8">Advanced analytics and reporting</p>
      
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <BarChart3 className="mx-auto text-muted-foreground mb-4" size={48} />
        <p className="text-muted-foreground">Analytics dashboard coming soon</p>
      </div>
    </div>
  );
}
