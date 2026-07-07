'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, Truck, Download, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { CreateLocationDialog } from '../location/create-location-dialog';

export function RightSidebar() {
  const fastMovingItems = [
    'Macbook Pro',
    'iPhone 14 Pro',
    'Zoom75',
    'Airpods Pro',
    'Samsung Galaxy Fold',
    'Samsung Odyssey',
    'Logitech Superlight',
  ];

  const [openCreateLocation, setOpenCreateLocation] = useState(false);

  return (
    <aside className="hidden lg:block w-72 shrink-0 border-l bg-background relative top-0 right-0 h-screen overflow-hidden">
      {/* User */}
      {/* <Card className="rounded-none border-0 border-b shadow-none">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div>
              <p className="font-medium">Bryan Doe</p>
              <p className="text-sm text-muted-foreground">Admin</p>
            </div>
          </div>

          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card> */}

      {/* Quick Actions */}
      <Card className="rounded-none border-0 border-b shadow-none">
        <CardHeader>
          <h3 className="font-semibold">Quick Actions</h3>
        </CardHeader>

        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Order
            </span>
            <span className="text-xs text-muted-foreground">Ctrl + N</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setOpenCreateLocation(true)}
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Location
            </span>
            <span className="text-xs text-muted-foreground">Ctrl + P</span>
          </Button>

          <CreateLocationDialog open={openCreateLocation} onOpenChange={setOpenCreateLocation} />

          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Add Product
            </span>
            <span className="text-xs text-muted-foreground">Ctrl + P</span>
          </Button>

          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Add Supplier
            </span>
            <span className="text-xs text-muted-foreground">Ctrl + K</span>
          </Button>

          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </span>
            <span className="text-xs text-muted-foreground">Ctrl + S</span>
          </Button>
        </CardContent>
      </Card>

      {/* Fast Moving Items */}
      <Card className="rounded-none border-0 shadow-none">
        <CardHeader>
          <h3 className="font-semibold">Fast Moving Items</h3>
        </CardHeader>

        <CardContent className="space-y-3">
          {fastMovingItems.map((item) => (
            <button
              key={item}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted"
            >
              <div className="h-8 w-8 rounded-full bg-muted" />
              <span className="text-sm">{item}</span>
            </button>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
