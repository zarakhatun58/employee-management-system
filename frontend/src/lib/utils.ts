import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatCurrency(n?: number): string {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export function initials(name?: string): string {
  if (!name) return '?';
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function roleLabel(role: string): string {
  switch (role) {
    case 'super_admin': return 'Super Admin';
    case 'hr': return 'HR Manager';
    case 'employee': return 'Employee';
    default: return role;
  }
}

export function roleColor(role: string): string {
  switch (role) {
    case 'super_admin': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400';
    case 'hr': return 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400';
    case 'employee': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
  }
}

export function statusColor(status: string): string {
  return status === 'active'
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
    : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400';
}

export function departmentColor(department?: string) {
  const value = (department ?? "").toLowerCase();

  switch (value) {
    case "technology":
    case "it":
      return "bg-sky-100 text-sky-700";

    case "sales":
      return "bg-green-100 text-green-700";

    case "design":
      return "bg-pink-100 text-pink-700";

    case "hr":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}
