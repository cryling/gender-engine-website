import { createSignal } from "solid-js";
import Terminal from "./Terminal";

const tabs = ["Quick Start", "Try it"] as const;

const dockerSnippetLines = [
  { type: "comment", text: "# Download the image" },
  { type: "command", text: "$ docker pull ghcr.io/cryling/gender-engine:latest" },
  { type: "blank" },
  { type: "comment", text: "# Run the image" },
  { type: "command", text: "$ docker run -p 8080:8080 ghcr.io/cryling/gender-engine" },
  { type: "blank" },
  { type: "comment", text: "# Off you go!" },
  {
    type: "command",
    text: '$ curl -X GET "http://localhost:8080/api/v1/gender?name=tom&country=US"',
  },
  { type: "json", text: "{" },
  { type: "json-key", key: "message", value: '"tom could be found"', last: false },
  { type: "json-nested-start", key: "result", text: "{" },
  { type: "json-key", key: "Name", value: '"tom"', last: false, indent: 2 },
  { type: "json-key", key: "Gender", value: '"M"', last: false, indent: 2 },
  { type: "json-key", key: "Country", value: '"US"', last: false, indent: 2 },
  { type: "json-key", key: "Probability", value: '"0.99560356"', last: true, indent: 2 },
  { type: "json", text: "  }" },
  { type: "json", text: "}" },
] as const;

function QuickStartContent() {
  return (
    <div class="px-6 pt-4 pb-6 font-mono text-sm leading-relaxed">
      {dockerSnippetLines.map((line) => {
        if (line.type === "blank") return <div class="h-4" />;
        if (line.type === "comment")
          return <div class="text-[#6272a4]">{line.text}</div>;
        if (line.type === "command")
          return (
            <div class="text-[#f8f8f2]">
              <span class="text-[#bd93f9]">$</span>{" "}
              {line.text.slice(2)}
            </div>
          );
        if (line.type === "json")
          return <div class="text-[#f8f8f2]">{line.text}</div>;
        if (line.type === "json-nested-start")
          return (
            <div class="text-[#f8f8f2]">
              {"  "}
              <span class="text-[#8be9fd]">"{line.key}"</span>
              {": {"}
            </div>
          );
        if (line.type === "json-key") {
          const indent = "indent" in line ? "    " : "  ";
          return (
            <div class="text-[#f8f8f2]">
              {indent}
              <span class="text-[#8be9fd]">"{line.key}"</span>
              {": "}
              <span class="text-[#f1fa8c]">{line.value}</span>
              {!line.last && ","}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function TabbedWindow() {
  const [activeTab, setActiveTab] = createSignal<number>(0);

  return (
    <div>
      <div class="pl-4 pt-4">
        <svg
          aria-hidden="true"
          viewBox="0 0 42 10"
          fill="none"
          class="h-2.5 w-auto stroke-neutral-500/30"
        >
          <circle cx="5" cy="5" r="4.5" />
          <circle cx="21" cy="5" r="4.5" />
          <circle cx="37" cy="5" r="4.5" />
        </svg>
      </div>

      <div class="flex gap-1 px-4 pt-3 border-b border-white/5">
        {tabs.map((tab, i) => (
          <button
            onClick={() => setActiveTab(i)}
            class={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors ${
              activeTab() === i
                ? "bg-white/10 text-white"
                : "text-neutral-400 hover:text-neutral-300 hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div class="min-h-[340px]">
        {activeTab() === 0 && <QuickStartContent />}
        {activeTab() === 1 && <Terminal />}
      </div>
    </div>
  );
}
