import { createSignal, For } from "solid-js";
import "../styles/utils.css";

interface Command {
  input: string;
  output: string;
}

export default function Terminal() {
  let currentInputRef: HTMLSpanElement | undefined;
  let carretDivRef: HTMLDivElement | undefined;

  const [commands, setCommands] = createSignal<Command[]>([

  ]);
  const [currentInput, setCurrentInput] = createSignal<string>("");
  const [currentInputIndex, setCurrentInputIndex] = createSignal<number>(0);

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
    const input = currentInput().replace(/&nbsp/g, " ");
    let output = await fetchData(input);
    setCommands([...commands(), { input, output }]);
    setCurrentInput("");
    if (currentInputRef) currentInputRef.textContent = "";
  };

  const fetchData = async (command: string) => {
    // Simulate a fetch call
    command = command.toUpperCase();
    return `Executed: ${command}`;
  };

  return (
    <div>
      <For each={commands()}>
        {(command) => (
          <div>
            <span class="flex items-center text-gray-10 font-mono px-6 text-white">
              <span class="text-gray-400">$&nbsp;</span>
              {command.input}
            </span>

            <div class="flex items-center text-gray-10 font-mono px-6 text-white">
              {command.output}
            </div>
          </div>
        )}
      </For>
      <div
        onClick={() => currentInputRef?.focus()}
        class="group flex items-center text-gray-10 font-mono px-6"
      >
        <span class="text-gray-400">$&nbsp;</span>
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
            class="text-white flex gap-2 flex-wrap focus:outline-none whitespace-nowrap"
          ></span>
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
                class="hidden group-has-[:focus]/input:block bg-white w-[10px] h-[21px] shrink-0 animate-blink"
              ></div>
              <span class="text-transparent"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
