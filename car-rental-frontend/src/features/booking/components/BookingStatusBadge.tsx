'use client';

import React from 'react';
import { BookingStatus, STATUS_COLORS } from '@/types/booking.types';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const statusColor = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  const label = status.replace('_', ' ').toUpperCase();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
      {label}
    </span>
  );
}
