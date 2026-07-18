import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Users,
} from "lucide-react";
import { useEffect } from "react";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  totalEmployees?: number;
}

export default function OrganizationToolbar({
  search,
  setSearch,
  onZoomIn,
  onZoomOut,
  onFit,
  totalEmployees = 0,
}: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [setSearch]);

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
      {/* Left */}

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-sky-100 p-2 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
          <Users size={22} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-800 dark:text-white">
            Organization Chart
          </h2>

          <p className="text-sm text-slate-500">
            {totalEmployees} Employees
          </p>
        </div>

      </div>

      {/* Search */}

      <div className="relative w-full max-w-md">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employee..."
          className="w-full rounded-xl text-sky-600 border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-sky-700"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 text-sky-600 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X size={15} />
          </button>
        )}

      </div>

      {/* Controls */}

      <div className="flex items-center gap-2">

        <button
          onClick={onZoomIn}
          className="rounded-lg border border-slate-300 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          title="Zoom In"
        >
          <ZoomIn size={18}   className="text-sky-600"/>
        </button>

        <button
          onClick={onZoomOut}
          className="rounded-lg border border-slate-300 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          title="Zoom Out"
        >
          <ZoomOut size={18}  className="text-sky-600"/>
        </button>

        <button
          onClick={onFit}
          className="rounded-lg border border-slate-300 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          title="Fit Screen"
        >
          <Maximize2 size={18}  className="text-sky-600"/>
        </button>

      </div>
    </div>
  );
}