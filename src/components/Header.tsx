import { createSignal, onMount, onCleanup } from "solid-js";

interface HeaderProps {
  repoHref: string;
}

export default function Header(props: HeaderProps) {
  const [isDark, setIsDark] = createSignal(true);
  const [scrolled, setScrolled] = createSignal(false);

  onMount(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 0);
    document.addEventListener("scroll", onScroll);
    onCleanup(() => document.removeEventListener("scroll", onScroll));
  });

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const nowDark = !html.classList.contains("dark");
    html.classList.toggle("dark", nowDark);
    localStorage.setItem("theme", nowDark ? "dark" : "light");
    setIsDark(nowDark);
  };

  return (
    <header
      class={`sticky top-0 z-50 flex items-center justify-between px-4 py-4 transition-all duration-200 sm:px-6 lg:px-8 border-b ${
        scrolled()
          ? "border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/90"
          : "border-transparent bg-transparent"
      }`}
    >
      <div class="flex items-center gap-8">
        <a class="flex items-center gap-2" href="/">
          <span
            class="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            style="font-family: 'JetBrains Mono', monospace;"
          >
            Gender Engine
          </span>
        </a>
        <nav class="hidden sm:flex items-center gap-6 text-sm font-medium">
          <a
            href="/docs"
            class="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Docs
          </a>
          <a
            href={props.repoHref}
            class="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          class="rounded-lg p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark() ? (
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 006.002-2.082 9.718 9.718 0 003-3.916z" />
            </svg>
          )}
        </button>

        <a
          class="sm:hidden rounded-lg p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label="GitHub"
          href={props.repoHref}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" class="h-5 w-5 fill-current">
            <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
