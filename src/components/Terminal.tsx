import { createSignal, For, onMount } from "solid-js";
import type { Country } from "../data/countries";
import "../styles/global.css";

interface TerminalLine {
  type: "input" | "output" | "info" | "json";
  text: string;
}

const API_BASE = "https://gender.kianreiling.com";

const WELCOME_LINES: TerminalLine[] = [
  { type: "info", text: "Welcome to Gender Engine!" },
  { type: "info", text: "Type any name and press Enter to find its gender." },
  { type: "info", text: "" },
];

const resultCache = new Map<string, string>();

async function fetchGenderResult(name: string, country: Country | null): Promise<string> {
  const params = new URLSearchParams({ name: name.toLowerCase().trim() });
  if (country) params.set("country", country.code);
  const key = params.toString();

  const cached = resultCache.get(key);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}/api/v1/gender?${params}`);
  const data = await res.json();
  const json = JSON.stringify(data, null, 2);
  resultCache.set(key, json);
  return json;
}

function encodeSpaces(text: string): string {
  return text.replace(/ /g, "\u00A0");
}

function decodeSpaces(text: string): string {
  return text.replace(/\u00A0/g, " ");
}

interface TerminalProps {
  country: Country | null;
  onReady?: (api: { focus: () => void }) => void;
}

export default function Terminal(props: TerminalProps) {
  let inputRef: HTMLSpanElement | undefined;
  let caretRef: HTMLDivElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  const [lines, setLines] = createSignal<TerminalLine[]>([...WELCOME_LINES]);
  const [currentInput, setCurrentInput] = createSignal("");
  const [caretIndex, setCaretIndex] = createSignal(0);
  const [isProcessing, setIsProcessing] = createSignal(false);

  const [history, setHistory] = createSignal<string[]>([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [savedInput, setSavedInput] = createSignal("");

  onMount(() => {
    inputRef?.focus();
    props.onReady?.({ focus: () => inputRef?.focus() });
  });

  const scrollToBottom = () => {
    if (containerRef) {
      containerRef.scrollTop = containerRef.scrollHeight;
    }
  };

  const resetCaretBlink = () => {
    if (!caretRef) return;
    caretRef.classList.remove("animate-blink");
    setTimeout(() => caretRef?.classList.add("animate-blink"), 200);
  };

  const syncCaretPosition = () => {
    resetCaretBlink();
    setCaretIndex(window.getSelection()?.anchorOffset || 0);
  };

  const setInputText = (text: string) => {
    setCurrentInput(encodeSpaces(text));
    if (inputRef) inputRef.textContent = text;
    requestAnimationFrame(() => {
      if (inputRef && inputRef.childNodes.length > 0) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(inputRef.childNodes[0], text.length);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setCaretIndex(text.length);
      resetCaretBlink();
    });
  };

  const handleInput = (event: InputEvent & { currentTarget: HTMLSpanElement }) => {
    syncCaretPosition();
    setCurrentInput(encodeSpaces(event.currentTarget.textContent || ""));
  };

  const handleHistoryNav = (direction: "up" | "down") => {
    const hist = history();
    if (hist.length === 0) return;

    if (direction === "up") {
      const idx = historyIndex();
      if (idx === -1) {
        setSavedInput(decodeSpaces(currentInput()));
        setHistoryIndex(hist.length - 1);
        setInputText(hist[hist.length - 1]);
      } else if (idx > 0) {
        setHistoryIndex(idx - 1);
        setInputText(hist[idx - 1]);
      }
    } else {
      const idx = historyIndex();
      if (idx === -1) return;
      if (idx < hist.length - 1) {
        setHistoryIndex(idx + 1);
        setInputText(hist[idx + 1]);
      } else {
        setHistoryIndex(-1);
        setInputText(savedInput());
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    syncCaretPosition();

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      handleHistoryNav(event.key === "ArrowUp" ? "up" : "down");
      return;
    }

    if (event.key !== "Enter") return;
    event.preventDefault();
    if (isProcessing()) return;

    const rawInput = decodeSpaces(currentInput()).trim();
    if (!rawInput) return;

    setHistory((prev) => [...prev, rawInput]);
    setHistoryIndex(-1);
    setSavedInput("");
    setIsProcessing(true);
    setCurrentInput("");
    if (inputRef) inputRef.textContent = "";

    const newLines: TerminalLine[] = [
      ...lines(),
      { type: "input", text: rawInput },
    ];

    if (rawInput.toLowerCase() === "help") {
      newLines.push(
        { type: "info", text: "Usage: type any first name to look up its gender." },
        { type: "info", text: "Example: tom, anna, alex, jordan" },
        { type: "info", text: 'Type "clear" to reset the terminal.' },
        { type: "info", text: "" }
      );
      setLines(newLines);
      setIsProcessing(false);
      setTimeout(scrollToBottom, 0);
      return;
    }

    if (rawInput.toLowerCase() === "clear") {
      setLines([...WELCOME_LINES]);
      setIsProcessing(false);
      return;
    }

    const name = rawInput.split(/\s+/)[0];
    const countryParam = props.country ? `&country=${props.country.code}` : "";
    newLines.push({
      type: "output",
      text: `> curl -X GET "${API_BASE}/api/v1/gender?name=${name.toLowerCase()}${countryParam}"`,
    });
    setLines([...newLines]);
    setTimeout(scrollToBottom, 0);

    fetchGenderResult(name, props.country)
      .then((json) => {
        newLines.push({ type: "json", text: json }, { type: "info", text: "" });
      })
      .catch(() => {
        newLines.push(
          { type: "info", text: "Error: could not reach the API." },
          { type: "info", text: "" }
        );
      })
      .finally(() => {
        setLines([...newLines]);
        setIsProcessing(false);
        setTimeout(scrollToBottom, 0);
        setTimeout(() => inputRef?.focus(), 10);
      });
  };

  return (
    <div
      ref={(el) => (containerRef = el)}
      onClick={() => inputRef?.focus()}
      class="max-h-85 overflow-y-auto no-scrollbar py-4 cursor-text"
    >
      <For each={lines()}>
        {(line) => {
          if (line.type === "info") {
            return (
              <div class="px-6 font-mono text-sm text-neutral-400 dark:text-neutral-400 leading-relaxed">
                {line.text || "\u00A0"}
              </div>
            );
          }
          if (line.type === "input") {
            return (
              <div class="px-6 font-mono text-sm text-neutral-800 dark:text-white leading-relaxed">
                <span class="text-emerald-600 dark:text-[#bd93f9]">$&nbsp;</span>
                {line.text}
              </div>
            );
          }
          if (line.type === "output") {
            return (
              <div class="px-6 font-mono text-sm text-teal-600 dark:text-[#8be9fd] leading-relaxed">
                {line.text}
              </div>
            );
          }
          if (line.type === "json") {
            return (
              <pre class="px-6 font-mono text-sm text-amber-600 dark:text-[#f1fa8c] leading-relaxed whitespace-pre">
                {line.text}
              </pre>
            );
          }
          return null;
        }}
      </For>

      {!isProcessing() && (
        <div class="group flex items-center font-mono text-sm px-6">
          <span class="text-emerald-600 dark:text-[#bd93f9]">$&nbsp;</span>
          <div class="relative group/input flex items-center overflow-x-scroll no-scrollbar caret-transparent pr-2.5">
            <span
              ref={(el) => (inputRef = el)}
              contentEditable={true}
              spellcheck={false}
              onInput={(e) => handleInput(e as InputEvent & { currentTarget: HTMLSpanElement })}
              onKeyDown={handleKeyDown}
              onKeyUp={syncCaretPosition}
              onSelect={syncCaretPosition}
              onMouseUp={syncCaretPosition}
              onTouchStart={syncCaretPosition}
              onPaste={syncCaretPosition}
              onCut={syncCaretPosition}
              class="text-neutral-800 dark:text-white flex gap-2 flex-wrap focus:outline-none whitespace-nowrap"
            />
            <div
              class="absolute inset-0 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              <div class="flex items-center whitespace-nowrap focus:outline-none">
                <span class="text-transparent">
                  {currentInput().substring(0, caretIndex())}
                </span>
                <div
                  ref={(el) => (caretRef = el)}
                  class="hidden group-has-focus/input:block bg-white w-2.5 h-5.25 shrink-0 animate-blink mix-blend-difference"
                />
                <span class="text-transparent" />
              </div>
            </div>
          </div>
        </div>
      )}

      {isProcessing() && (
        <div class="px-6 font-mono text-sm text-neutral-400 dark:text-neutral-500 animate-pulse">
          Loading...
        </div>
      )}
    </div>
  );
}
