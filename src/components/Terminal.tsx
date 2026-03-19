import { createSignal, For, onMount } from "solid-js";
import "../styles/global.css";

interface TerminalLine {
  type: "prompt" | "input" | "output" | "info" | "json";
  text: string;
}

const MOCK_GENDERS: Record<string, { gender: string; probability: string }> = {
  tom: { gender: "M", probability: "0.9956" },
  thomas: { gender: "M", probability: "0.9981" },
  anna: { gender: "F", probability: "0.9945" },
  maria: { gender: "F", probability: "0.9978" },
  john: { gender: "M", probability: "0.9992" },
  jane: { gender: "F", probability: "0.9967" },
  alex: { gender: "M", probability: "0.6234" },
  sam: { gender: "M", probability: "0.6012" },
  emma: { gender: "F", probability: "0.9989" },
  james: { gender: "M", probability: "0.9995" },
  sarah: { gender: "F", probability: "0.9971" },
  chris: { gender: "M", probability: "0.7845" },
  jordan: { gender: "M", probability: "0.5234" },
  taylor: { gender: "F", probability: "0.5567" },
  kim: { gender: "F", probability: "0.7823" },
  max: { gender: "M", probability: "0.9876" },
  sophie: { gender: "F", probability: "0.9934" },
  kai: { gender: "M", probability: "0.6789" },
  robin: { gender: "M", probability: "0.5612" },
  lisa: { gender: "F", probability: "0.9956" },
};

function getGenderResult(name: string): { gender: string; probability: string } {
  const lower = name.toLowerCase().trim();
  if (MOCK_GENDERS[lower]) return MOCK_GENDERS[lower];
  // Generate a deterministic-looking result based on name
  const hash = [...lower].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gender = hash % 2 === 0 ? "F" : "M";
  const prob = (0.5 + (hash % 50) / 100).toFixed(4);
  return { gender, probability: prob };
}

function formatJsonResponse(name: string): string {
  const { gender, probability } = getGenderResult(name);
  return JSON.stringify(
    {
      message: `${name.toLowerCase()} could be found`,
      result: {
        Name: name.toLowerCase(),
        Gender: gender,
        Probability: probability,
      },
    },
    null,
    2
  );
}

export default function Terminal() {
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

  onMount(() => {
    currentInputRef?.focus();
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

  const handleTerminalSubmit = async (event: KeyboardEvent) => {
    handleKeyUp();
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (isProcessing()) return;

    const rawInput = currentInput().replace(/&nbsp/g, " ").trim();
    if (!rawInput) return;

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

    // Simulate the curl command
    const name = rawInput.split(/\s+/)[0]; // Take first word as the name
    newLines.push({
      type: "output",
      text: `> curl -X GET "http://localhost:8080/api/v1/gender?name=${name.toLowerCase()}"`,
    });
    setLines([...newLines]);
    setTimeout(scrollToBottom, 0);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));

    const json = formatJsonResponse(name);
    newLines.push(
      { type: "json", text: json },
      { type: "info", text: "" }
    );
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
                <span class="text-neutral-400 dark:text-gray-400">$&nbsp;</span>
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
          <span class="text-neutral-400 dark:text-gray-400">$&nbsp;</span>
          <div class="relative group/input flex items-center overflow-x-scroll no-scrollbar caret-transparent pr-[10px]">
            <span
              ref={(el) => (currentInputRef = el)}
              contentEditable={true}
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
