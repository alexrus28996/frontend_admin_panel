'use client';

import en from '@/messages/en.json';
import { CreditCard } from 'lucide-react';

export default function PaymentEventsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{en.paymentEvents.title}</h1>
      <p className="text-muted-foreground mb-8">{en.paymentEvents.pageTitle}</p>
      
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <CreditCard className="mx-auto text-muted-foreground mb-4" size={48} />
        <p className="text-muted-foreground">Payment events management coming soon</p>
      </div>
    </div>
  );
}
