import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse space-y-3">
      <div className="w-full aspect-[3/4] bg-slate-200 rounded-xl" />
      <div className="h-3 bg-slate-200 rounded w-1/3" />
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
    </div>
  );
};
