import { createSignal, onMount } from "solid-js";
import Terminal from "./Terminal";
import CountryPicker from "./CountryPicker";
import type { Country } from "./CountryPicker";

const tabs = ["Quick Start", "Try it"] as const;
const TRIED_KEY = "tried-terminal";

function QuickStartContent(props: { country: Country | null }) {
  const dockerSnippetLines = () => {
    const country = props.country;
    const countryParam = country ? `&country=${country.code}` : "";
    const curlCmd = `$ curl -X GET "http://localhost:8080/api/v1/gender?name=tom${countryParam}"`;

    const resultFields: { type: "json-key"; key: string; value: string; last: boolean; indent: 2 }[] = [
      { type: "json-key", key: "Name", value: '"tom"', last: false, indent: 2 },
      { type: "json-key", key: "Gender", value: '"M"', last: !country, indent: 2 },
    ];
    if (country) {
      resultFields.push(
        { type: "json-key", key: "Country", value: `"${country.code}"`, last: false, indent: 2 },
        { type: "json-key", key: "Probability", value: '"0.99560356"', last: true, indent: 2 },
      );
    }

    const message = country ? '"tom could be found in ' + country.code + '"' : '"tom could be found"';

    return [
      { type: "comment" as const, text: "# Download the image" },
      { type: "command" as const, text: "$ docker pull ghcr.io/cryling/gender-engine:latest" },
      { type: "blank" as const },
      { type: "comment" as const, text: "# Run the image" },
      { type: "command" as const, text: "$ docker run -p 8080:8080 ghcr.io/cryling/gender-engine" },
      { type: "blank" as const },
      { type: "comment" as const, text: "# Off you go!" },
      { type: "command" as const, text: curlCmd },
      { type: "json" as const, text: "{" },
      { type: "json-key" as const, key: "message", value: message, last: false },
      { type: "json-nested-start" as const, key: "result", text: "{" },
      ...resultFields,
      { type: "json" as const, text: "  }" },
      { type: "json" as const, text: "}" },
    ];
  };

  return (
    <pre class="px-6 pt-4 pb-6 font-mono text-sm leading-relaxed whitespace-pre overflow-x-auto no-scrollbar">
      {dockerSnippetLines().map((line) => {
        if (line.type === "blank") return "\n";
        if (line.type === "comment")
          return <><span class="text-neutral-400 dark:text-[#6272a4]">{line.text}</span>{"\n"}</>;
        if (line.type === "command")
          return <><span class="text-emerald-600 dark:text-[#bd93f9]">$</span><span class="text-neutral-700 dark:text-[#f8f8f2]"> {line.text.slice(2)}</span>{"\n"}</>;
        if (line.type === "json")
          return <><span class="text-neutral-700 dark:text-[#f8f8f2]">{line.text}</span>{"\n"}</>;
        if (line.type === "json-nested-start")
          return <><span class="text-neutral-700 dark:text-[#f8f8f2]">{"  "}<span class="text-teal-600 dark:text-[#8be9fd]">"{line.key}"</span>{": {"}</span>{"\n"}</>;
        if (line.type === "json-key") {
          const indent = "indent" in line ? "    " : "  ";
          return <><span class="text-neutral-700 dark:text-[#f8f8f2]">{indent}<span class="text-teal-600 dark:text-[#8be9fd]">"{line.key}"</span>{": "}<span class="text-amber-600 dark:text-[#f1fa8c]">{line.value}</span>{!line.last && ","}</span>{"\n"}</>;
        }
        return null;
      })}
    </pre>
  );
}

export default function TabbedWindow() {
  const [activeTab, setActiveTab] = createSignal<number>(0);
  const [showDot, setShowDot] = createSignal(false);
  const [country, setCountry] = createSignal<Country | null>(null);
  let terminalApi: { focus: () => void } | undefined;

  onMount(() => {
    if (!localStorage.getItem(TRIED_KEY)) {
      setShowDot(true);
    }
  });

  const selectTab = (i: number) => {
    setActiveTab(i);
    if (i === 1) {
      setShowDot(false);
      localStorage.setItem(TRIED_KEY, "1");
      setTimeout(() => terminalApi?.focus(), 0);
    }
  };

  return (
    <div>
      <div class="pl-4 pt-4">
        <svg
          aria-hidden="true"
          viewBox="0 0 42 10"
          fill="none"
          class="h-2.5 w-auto stroke-neutral-300 dark:stroke-neutral-500/30"
        >
          <circle cx="5" cy="5" r="4.5" />
          <circle cx="21" cy="5" r="4.5" />
          <circle cx="37" cy="5" r="4.5" />
        </svg>
      </div>

      <div class="flex items-center gap-1 px-4 pt-3 border-b border-neutral-200 dark:border-white/5">
        {tabs.map((tab, i) => (
          <button
            onClick={() => selectTab(i)}
            class={`relative px-4 py-2 text-xs font-medium rounded-t-lg transition-colors ${
              activeTab() === i
                ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                : "text-neutral-400 hover:text-neutral-500 hover:bg-neutral-50 dark:hover:text-neutral-300 dark:hover:bg-white/5"
            }`}
          >
            {tab}
            {i === 1 && showDot() && (
              <span class="absolute top-1.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
            )}
          </button>
        ))}
        <div class="ml-auto pr-1">
          <CountryPicker selected={country()} onSelect={setCountry} />
        </div>
      </div>

      <div class="min-h-85">
        <div class={activeTab() === 0 ? "" : "hidden"}>
          <QuickStartContent country={country()} />
        </div>
        <div class={activeTab() === 1 ? "" : "hidden"}>
          <Terminal country={country()} onReady={(api) => (terminalApi = api)} />
        </div>
      </div>
    </div>
  );
}
