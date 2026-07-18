
import { Button } from './primitives';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center dark:bg-slate-950">
      <Compass className="h-16 w-16 text-sky-500" />
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">404</h1>
      <p className="text-slate-500 dark:text-slate-400">The page you're looking for doesn't exist.</p>
      <Link to="/"><Button>Back to Dashboard</Button></Link>
    </div>
  );
}
