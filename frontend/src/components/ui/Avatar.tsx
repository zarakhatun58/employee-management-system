
import { initials, cn } from '../../lib/utils';

export default function Avatar({ name, src, size = 40, className }: { name?: string | null; src?: string | null; size?: number; className?: string }) {
  if (src) {
    return <img src={src} alt={name ?? ''} style={{ width: size, height: size }} className={cn('rounded-full object-cover', className)} />;
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn('flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 font-semibold text-white', className)}
    >
      {initials(name ?? undefined)}
    </div>
  );
}
