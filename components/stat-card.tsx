import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'warning' | 'success';
  className?: string;
}

const colorMap = {
  primary: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  secondary: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
  accent: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
  success: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
};

const iconColorMap = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-green-600 dark:text-green-400',
  accent: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  success: 'text-emerald-600 dark:text-emerald-400',
};

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon,
  color = 'primary',
  className,
}: StatCardProps) {
  const isTrendUp = trend && trend > 0;

  return (
    <div
      className={cn(
        'bg-card rounded-lg border border-border p-6 transition-all hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>

          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-3">
              <div className="flex items-center gap-1 text-sm font-medium">
                {isTrendUp ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-success">{trend > 0 ? '+' : ''}{trend}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-accent" />
                    <span className="text-accent">{trend}%</span>
                  </>
                )}
              </div>
              {trendLabel && <span className="text-muted-foreground text-xs">{trendLabel}</span>}
            </div>
          )}
        </div>

        {icon && (
          <div className={cn('p-3 rounded-lg', colorMap[color])}>
            <div className={cn('w-6 h-6', iconColorMap[color])}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}
