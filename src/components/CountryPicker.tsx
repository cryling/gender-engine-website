import { createSignal, createMemo, For, onMount, onCleanup } from "solid-js";
import { COUNTRIES, type Country } from "../data/countries";

export type { Country } from "../data/countries";

interface CountryPickerProps {
  selected: Country | null;
  onSelect: (country: Country | null) => void;
}

export default function CountryPicker(props: CountryPickerProps) {
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [highlightIndex, setHighlightIndex] = createSignal(0);
  let rootRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;
  let listRef: HTMLDivElement | undefined;

  // Index 0 = Global, 1+ = filtered countries
  const filtered = createMemo(() => {
    const q = search().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  });

  const totalItems = () => filtered().length + 1; // +1 for Global

  const scrollHighlightIntoView = (index: number) => {
    if (!listRef) return;
    const item = listRef.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(highlightIndex() + 1, totalItems() - 1);
      setHighlightIndex(next);
      scrollHighlightIntoView(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.max(highlightIndex() - 1, 0);
      setHighlightIndex(next);
      scrollHighlightIntoView(next);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const idx = highlightIndex();
      if (idx === 0) {
        select(null);
      } else {
        const country = filtered()[idx - 1];
        if (country) select(country);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (rootRef && !rootRef.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() => document.removeEventListener("mousedown", handleClickOutside));
  });

  const toggle = () => {
    const next = !open();
    setOpen(next);
    if (next) {
      setSearch("");
      setHighlightIndex(0);
      setTimeout(() => inputRef?.focus(), 0);
    }
  };

  const select = (country: Country | null) => {
    props.onSelect(country);
    setOpen(false);
  };

  return (
    <div ref={(el) => (rootRef = el)} class="relative">
      <button
        onClick={toggle}
        class={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
          open()
            ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
            : "text-neutral-400 hover:text-neutral-500 hover:bg-neutral-50 dark:hover:text-neutral-300 dark:hover:bg-white/5"
        }`}
        aria-label="Select country"
      >
        <span class="text-sm leading-none">
          {props.selected ? props.selected.emoji : "\u{1F30D}"}
        </span>
        <span class="hidden sm:inline">
          {props.selected ? props.selected.code : "Global"}
        </span>
        <svg class="w-3 h-3 opacity-50" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>

      {open() && (
        <div class="absolute right-0 top-full mt-1 z-50 w-64 rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800 overflow-hidden">
          <div class="p-2 border-b border-neutral-100 dark:border-neutral-700">
            <input
              ref={(el) => (inputRef = el)}
              type="text"
              placeholder="Search countries..."
              value={search()}
              onInput={(e) => { setSearch(e.currentTarget.value); setHighlightIndex(e.currentTarget.value ? 1 : 0); }}
              onKeyDown={handleKeyDown}
              class="w-full px-3 py-1.5 text-sm rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-300 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white dark:placeholder-neutral-500 dark:focus:border-neutral-500"
            />
          </div>
          <div ref={(el) => (listRef = el)} class="max-h-56 overflow-y-auto overscroll-contain">
            <button
              onClick={() => select(null)}
              onMouseEnter={() => setHighlightIndex(0)}
              class={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                highlightIndex() === 0 ? "bg-neutral-100 dark:bg-neutral-700" : "hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
              }`}
            >
              <span class="text-base leading-none">{"\u{1F30D}"}</span>
              <span class="text-neutral-700 dark:text-neutral-200">Global</span>
              <span class="ml-auto text-xs text-neutral-400">All</span>
            </button>
            <For each={filtered()}>
              {(country, i) => (
                <button
                  onClick={() => select(country)}
                  onMouseEnter={() => setHighlightIndex(i() + 1)}
                  class={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                    highlightIndex() === i() + 1 ? "bg-neutral-100 dark:bg-neutral-700" : "hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                  }`}
                >
                  <span class="text-base leading-none">{country.emoji}</span>
                  <span class="text-neutral-700 dark:text-neutral-200 truncate">{country.name}</span>
                  <span class="ml-auto text-xs text-neutral-400 shrink-0">{country.code}</span>
                </button>
              )}
            </For>
            {filtered().length === 0 && (
              <div class="px-3 py-4 text-sm text-neutral-400 text-center">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
