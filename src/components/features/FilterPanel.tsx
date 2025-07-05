'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { EventType } from '@/types';
import { useEventContext } from '@/contexts/EventContext';

export function FilterPanel() {
  const { filters, setFilters } = useEventContext();
  const [isOpen, setIsOpen] = useState(false);

  const eventTypes = Object.values(EventType);
  const agencies = ['NASA', 'ESA', 'ISRO', 'SpaceX', 'Blue Origin', 'Roscosmos'];
  const categories = ['Human Spaceflight', 'Robotic Missions', 'Space Telescopes', 'Earth Observation', 'Deep Space'];

  const handleTypeToggle = (type: EventType) => {
    const currentTypes = filters.eventTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFilters({ ...filters, eventTypes: newTypes });
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 cosmic-glass cosmic-border rounded-lg p-6 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading-3 text-cosmic-cream">Filter Events</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Event Types */}
          <div className="mb-6">
            <Label className="text-cosmic-grey-300 mb-2">Event Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map(type => (
                <Button
                  key={type}
                  variant={filters.eventTypes?.includes(type) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeToggle(type)}
                  className="text-xs"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Significance */}
          <div className="mb-6">
            <Label className="text-cosmic-grey-300 mb-2">
              Minimum Significance: {filters.significance || 1}
            </Label>
            <Slider
              value={[filters.significance || 1]}
              onValueChange={([value]) => setFilters({ ...filters, significance: value })}
              min={1}
              max={10}
              step={1}
            />
          </div>

          {/* Agency */}
          <div className="mb-6">
            <Label className="text-cosmic-grey-300 mb-2">Agency</Label>
            <Select
              value={filters.agencies?.[0] || ''}
              onValueChange={(value) => setFilters({ ...filters, agencies: value ? [value] : [] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All agencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All agencies</SelectItem>
                {agencies.map(agency => (
                  <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="mb-6">
            <Label className="text-cosmic-grey-300 mb-2">Category</Label>
            <Select
              value={filters.categories?.[0] || ''}
              onValueChange={(value) => setFilters({ ...filters, categories: value ? [value] : [] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="w-full"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </>
  );
}