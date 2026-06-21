'use client';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { SortableItem } from './sortable-item';

interface Feature {
  id: string;
  text: string;
}

interface Plan {
  id: string;
  title: string;
  price: string;
  accountMin: string;
  features: Feature[];
  [key: string]: any;
}

export default function PricingBuilderPage() {

  const sensors =
    useSensors(
      useSensor(PointerSensor)
    );

  const make = (text: string): Feature => ({
    id: uuid(),
    text
  });

  // HYDRATION-SAFE: Lazy initializer ensures UUIDs are only created on the client
  const [plans, setPlans] =
    useState<Plan[]>(() => [
      {
        id: 'starter',
        title: 'Starter',
        price: '4.99',
        accountMin: '500',
        features: [
          make('1 auto‑trade bot'),
          make('Limited risk controls'),
          make('Trade history'),
          make('Performance fee reporting'),
          make('Growth strategy (basic)'),
          make('Account minimum: $500'),
          make('Email notifications'),
          make('Weekly Zoom call: Monday'),
          make('Must promote (referral / QR code)'),
          make('Reduced fees')
        ]
      },
      {
        id: 'standard',
        title: 'Standard',
        price: '9.99',
        accountMin: '2000',
        features: [
          make('Follow 1 master strategy'),
          make('2 auto‑trade bots'),
          make('Standard risk controls'),
          make('Trade history'),
          make('Performance fee reporting'),
          make('Personalized growth strategy'),
          make('Account minimum: $2,000'),
          make('Email notifications'),
          make('Weekly Zoom call: Tuesday')
        ]
      },
      {
        id: 'pro',
        title: 'Pro',
        price: '39',
        accountMin: '5000',
        features: [
          make('3 auto‑trade bots'),
          make('Limited risk controls'),
          make('Basic trade history'),
          make('Performance fee reporting'),
          make('Growth strategy support'),
          make('Account minimum: $5,000'),
          make('2× weekly Zoom calls: Wednesday & Thursday'),
          make('Email notifications')
        ]
      },
      {
        id: 'elite',
        title: 'Elite',
        price: '139',
        accountMin: '30000',
        features: [
          make('4 auto‑trade bots'),
          make('Custom risk controls'),
          make('Full trade history'),
          make('Performance fee reporting'),
          make('Personalized growth strategy'),
          make('Growth strategy support'),
          make('Account minimum: $30,000'),
          make('Priority 1‑on‑1 support'),
          make('Scheduled calls Monday–Friday'),
          make('Email notifications')
        ]
      }
    ]);

  const handleDragEnd = (
    event: DragEndEvent,
    planIndex: number
  ) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setPlans(prev => {
        const newPlans = [...prev];
        const items = newPlans[planIndex].features;
        const oldIndex = items.findIndex(f => f.id === active.id);
        const newIndex = items.findIndex(f => f.id === over.id);
        newPlans[planIndex].features =
          arrayMove(items, oldIndex, newIndex);
        return newPlans;
      });
    }
  };

  const updateField = (
    planIndex: number,
    field: string,
    value: string
  ) => {
    setPlans(prev => {
      const newPlans = [...prev];
      newPlans[planIndex][field] = value;
      return newPlans;
    });
  };

  const addFeature = (planIndex: number) => {
    setPlans(prev => {
      const newPlans = [...prev];
      newPlans[planIndex].features.push(make('New feature'));
      return newPlans;
    });
  };

  const removeFeature = (
    planIndex: number,
    featureId: string
  ) => {
    setPlans(prev => {
      const newPlans = [...prev];
      newPlans[planIndex].features =
        newPlans[planIndex].features.filter(f => f.id !== featureId);
      return newPlans;
    });
  };

  return (

    <div
    className="
    w-full
    min-h-screen
    p-10
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-4
    gap-6
    bg-[#050505]
    "
    >

      {plans.map((plan, i) => (

        <div
        key={plan.id}
        className="
        border
        border-white/10
        rounded-xl
        bg-[#0f0f16]
        p-5
        flex
        flex-col
        gap-4
        "
        >

          {/* TITLE */}
          <input
          value={plan.title}
          onChange={(e) => updateField(i, 'title', e.target.value)}
          className="
          w-full
          bg-transparent
          text-white
          text-xl
          font-semibold
          border-b
          border-white/10
          pb-1
          "
          />

          {/* PRICE */}
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">$</span>
            <input
            value={plan.price}
            onChange={(e) => updateField(i, 'price', e.target.value)}
            className="
            bg-transparent
            text-white
            text-2xl
            font-bold
            w-20
            "
            />
            <span className="text-white/60 text-sm">/mo</span>
          </div>

          {/* ACCOUNT MIN */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs">
              Account Minimum
            </label>
            <input
            value={plan.accountMin}
            onChange={(e) => updateField(i, 'accountMin', e.target.value)}
            className="
            bg-transparent
            text-white
            border
            border-white/10
            rounded-md
            p-2
            "
            />
          </div>

          {/* FEATURES */}
          <div className="flex flex-col gap-2">

            <p className="text-white/60 text-xs tracking-wide">
              Features
            </p>

            <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, i)}
            >

              <SortableContext
              items={plan.features.map(f => f.id)}
              strategy={verticalListSortingStrategy}
              >

                {plan.features.map((feature) => (

                  <SortableItem
                  key={feature.id}
                  id={feature.id}
                  text={feature.text}
                  onRemove={() => removeFeature(i, feature.id)}
                  />

                ))}

              </SortableContext>

            </DndContext>

            <button
            onClick={() => addFeature(i)}
            className="
            mt-2
            text-xs
            text-emerald-400
            border
            border-emerald-500/40
            rounded-md
            px-2
            py-1
            hover:bg-emerald-500/10
            transition
            "
            >
              + Add Feature
            </button>

          </div>

        </div>

      ))}

    </div>

  );
}
