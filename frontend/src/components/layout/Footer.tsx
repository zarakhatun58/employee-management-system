import { Dot } from "lucide-react";




export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} Employee Management System • Developed by{" "}
          <span className="font-semibold text-sky-600 dark:text-sky-400">
            Jahanara Khatun
          </span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/jahanara-khatun/",
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all duration-200 hover:border-sky-600 hover:bg-sky-600 hover:text-white dark:border-slate-700 dark:text-slate-300"
            aria-label="LinkedIn"
          >
            <Dot className="h-5 w-5" /> Linkedin
          </button>

          <button
            type="button"
            onClick={() =>
              window.open(
                "https://github.com/zarakhatun58",
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all duration-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-900"
            aria-label="GitHub"
          >
           <Dot className="h-5 w-5" /> GitHub
          </button>
        </div>
      </div>
    </footer>
  );
}