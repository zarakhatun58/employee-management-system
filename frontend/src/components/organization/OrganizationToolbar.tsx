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

  department: string;
  setDepartment: (v: string) => void;

  role: string;
  setRole: (v: string) => void;

  sort: string;
  setSort: (v: string) => void;

  departments: string[];

  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;

  totalEmployees?: number;
}

export default function OrganizationToolbar({
  search,
  setSearch,
  department,
  setDepartment,
  role,
  setRole,
  sort,
  setSort,
  departments,
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

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  }, [setSearch]);

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">

      {/* Top */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-sky-100 p-2 text-sky-600">
            <Users size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Organization Chart
            </h2>

         <p className="text-sm text-slate-600 dark:text-slate-400">
              {totalEmployees} Employees
            </p>
          </div>

        </div>
 <div className="relative flex-1 min-w-[260px]">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search employee..."
           className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-10 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-sky-400"
            >
              <X size={16} />
            </button>
          )}

        </div>
        <div className="flex items-center gap-2">

          <button
            onClick={onZoomIn}
            className="rounded-lg border p-2"
          >
            <ZoomIn
              size={18}
              className="text-sky-600"
            />
          </button>

          <button
            onClick={onZoomOut}
            className="rounded-lg border p-2"
          >
            <ZoomOut
              size={18}
              className="text-sky-600"
            />
          </button>

          <button
            onClick={onFit}
            className="rounded-lg border p-2"
          >
            <Maximize2
              size={18}
              className="text-sky-600"
            />
          </button>

        </div>

      </div>

    </div>
  );
}