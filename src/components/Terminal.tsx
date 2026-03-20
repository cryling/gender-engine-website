import { createSignal, For, onMount } from "solid-js";
import type { Country } from "./CountryPicker";
import "../styles/global.css";

interface TerminalLine {
  type: "prompt" | "input" | "output" | "info" | "json";
  text: string;
}

const API_BASE = "https://gender.kianreiling.com";

async function fetchGenderResult(name: string, country: Country | null): Promise<string> {
  const params = new URLSearchParams({ name: name.toLowerCase().trim() });
  if (country) params.set("country", country.code);
  const res = await fetch(`/api/v1/gender?${params}`);
  const data = await res.json();
  return JSON.stringify(data, null, 2);
}

interface TerminalProps {
  country: Country | null;
  onReady?: (api: { focus: () => void }) => void;
}

export default function Terminal(props: TerminalProps) {
  let currentInputRef: HTMLSpanElement | undefined;
  let carretDivRef: HTMLDivElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  const [lines, setLines] = createSignal<TerminalLine[]>([
    { type: "info", text: "Welcome to Gender Engine!" },
    { type: "info", text: "Type any name and press Enter to find its gender." },
    { type: "info", text: "" },
  ]);
  const [currentInput, setCurrentInput] = createSignal<string>("");
  const [currentInputIndex, setCurrentInputIndex] = createSignal<number>(0);
  const [isProcessing, setIsProcessing] = createSignal(false);

  const [history, setHistory] = createSignal<string[]>([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [savedInput, setSavedInput] = createSignal("");

  onMount(() => {
    currentInputRef?.focus();
    props.onReady?.({ focus: () => currentInputRef?.focus() });
  });

  const scrollToBottom = () => {
    if (containerRef) {
      containerRef.scrollTop = containerRef.scrollHeight;
    }
  };

  const handleTerminalInput = (
    event: InputEvent & {
      currentTarget: HTMLSpanElement;
      target: HTMLSpanElement;
    }
  ) => {
    handleKeyUp();
    setCurrentInput(
      event.currentTarget.textContent?.replace(/ /g, "&nbsp") || ""
    );
  };

  const handleKeyUp = () => {
    if (!carretDivRef) return;
    carretDivRef.classList.remove("animate-blink");
    setTimeout(() => {
      carretDivRef?.classList.add("animate-blink"), 200;
    });
    setCurrentInputIndex(window.getSelection()?.anchorOffset || 0);
  };

  const setInputText = (text: string) => {
    setCurrentInput(text.replace(/ /g, "&nbsp"));
    if (currentInputRef) currentInputRef.textContent = text;
    // Move browser caret + visual overlay caret to end
    requestAnimationFrame(() => {
      if (currentInputRef && currentInputRef.childNodes.length > 0) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(currentInputRef.childNodes[0], text.length);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setCurrentInputIndex(text.length);
      if (carretDivRef) {
        carretDivRef.classList.remove("animate-blink");
        setTimeout(() => carretDivRef?.classList.add("animate-blink"), 200);
      }
    });
  };

  const handleHistoryNav = (event: KeyboardEvent) => {
    const hist = history();
    if (hist.length === 0) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const idx = historyIndex();
      if (idx === -1) {
        setSavedInput(currentInput().replace(/&nbsp/g, " "));
        setHistoryIndex(hist.length - 1);
        setInputText(hist[hist.length - 1]);
      } else if (idx > 0) {
        setHistoryIndex(idx - 1);
        setInputText(hist[idx - 1]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
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

  const handleTerminalSubmit = async (event: KeyboardEvent) => {
    handleKeyUp();
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      handleHistoryNav(event);
      return;
    }
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (isProcessing()) return;

    const rawInput = currentInput().replace(/&nbsp/g, " ").trim();
    if (!rawInput) return;

    setHistory((prev) => [...prev, rawInput]);
    setHistoryIndex(-1);
    setSavedInput("");

    setIsProcessing(true);
    setCurrentInput("");
    if (currentInputRef) currentInputRef.textContent = "";

    // Show the typed input as a prompt line
    const newLines: TerminalLine[] = [
      ...lines(),
      { type: "input", text: rawInput },
    ];

    if (rawInput.toLowerCase() === "help") {
      newLines.push(
        { type: "info", text: "Usage: type any first name to look up its gender." },
        { type: "info", text: 'Example: tom, anna, alex, jordan' },
        { type: "info", text: 'Type "clear" to reset the terminal.' },
        { type: "info", text: "" }
      );
      setLines(newLines);
      setIsProcessing(false);
      setTimeout(scrollToBottom, 0);
      return;
    }

    if (rawInput.toLowerCase() === "clear") {
      setLines([
        { type: "info", text: "Welcome to Gender Engine!" },
        { type: "info", text: "Type any name and press Enter to find its gender." },
        { type: "info", text: "" },
      ]);
      setIsProcessing(false);
      return;
    }

    const name = rawInput.split(/\s+/)[0]; // Take first word as the name
    const countryParam = props.country ? `&country=${props.country.code}` : "";
    newLines.push({
      type: "output",
      text: `> curl -X GET "${API_BASE}/api/v1/gender?name=${name.toLowerCase()}${countryParam}"`,
    });
    setLines([...newLines]);
    setTimeout(scrollToBottom, 0);

    try {
      const json = await fetchGenderResult(name, props.country);
      newLines.push(
        { type: "json", text: json },
        { type: "info", text: "" }
      );
    } catch {
      newLines.push(
        { type: "info", text: "Error: could not reach the API." },
        { type: "info", text: "" }
      );
    }
    setLines([...newLines]);
    setIsProcessing(false);
    setTimeout(scrollToBottom, 0);
    setTimeout(() => currentInputRef?.focus(), 10);
  };

  return (
    <div
      ref={(el) => (containerRef = el)}
      onClick={() => currentInputRef?.focus()}
      class="max-h-[340px] overflow-y-auto no-scrollbar py-4 cursor-text"
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
          <div class="relative group/input flex items-center overflow-x-scroll no-scrollbar caret-transparent pr-[10px]">
            <span
              ref={(el) => (currentInputRef = el)}
              contentEditable={true}
              spellcheck={false}
              onInput={(event) =>
                handleTerminalInput(
                  event as InputEvent & {
                    currentTarget: HTMLSpanElement;
                    target: HTMLSpanElement;
                  }
                )
              }
              onKeyDown={(event) => handleTerminalSubmit(event as KeyboardEvent)}
              onKeyUp={() => handleKeyUp()}
              onSelect={() => handleKeyUp()}
              onMouseMove={() => handleKeyUp()}
              onMouseUp={() => handleKeyUp()}
              onTouchStart={() => handleKeyUp()}
              onPaste={() => handleKeyUp()}
              onCut={() => handleKeyUp()}
              class="text-neutral-800 dark:text-white flex gap-2 flex-wrap focus:outline-none whitespace-nowrap"
            />
            <div
              class="absolute inset-0 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              <div class="flex items-center whitespace-nowrap focus:outline-none">
                <span class="text-transparent">
                  {currentInput().substring(0, currentInputIndex())}
                </span>
                <div
                  ref={(el) => (carretDivRef = el)}
                  class="hidden group-has-[:focus]/input:block bg-neutral-800 dark:bg-white w-[10px] h-[21px] shrink-0 animate-blink"
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
