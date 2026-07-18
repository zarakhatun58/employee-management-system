import React from 'react';
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  icon,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      <div className="flex items-center gap-4">

        {icon && (
          <div
            className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-sky-100
            text-sky-600
            dark:bg-sky-500/10
            dark:text-sky-400
            "
          >
            {icon}
          </div>
        )}

        <div>
          <h1
            className="
            text-2xl
            font-bold
            text-slate-900
            dark:text-white
            "
          >
            {title}
          </h1>

          {description && (
            <p
              className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
              "
            >
              {description}
            </p>
          )}
        </div>

      </div>


      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}

    </div>
  );
}