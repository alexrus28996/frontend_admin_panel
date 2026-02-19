'use client';

import en from '@/messages/en.json';
import { Truck } from 'lucide-react';

export default function ShipmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{en.shipments.title}</h1>
      <p className="text-muted-foreground mb-8">{en.shipments.pageTitle}</p>
      
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Truck className="mx-auto text-muted-foreground mb-4" size={48} />
        <p className="text-muted-foreground">Shipments management coming soon</p>
      </div>
    </div>
  );
}
