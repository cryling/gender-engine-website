export default function GenderFinder() {
  return (
    <form
      id="trial-input-form"
      class="relative flex flex-row w-full h-[48px]"
    >
      <div class="bg-white rounded-lg flex flex-row items-center grow overflow-hidden px-4 drop-shadow-xl">
        <span
          class="flex flex-row items-center cursor-pointer mr-3"
          phx-click='[["toggle",{"ins":[["ease-out","duration-100"],["opacity-0","scale-95"],["opacity-100","scale-100"]],"to":"#trial-country-select","outs":[["ease-out","duration-75"],["opacity-100","scale-100"],["opacity-0","scale-95"]]}]]'
        >
          <span class="text-xl">🌎</span>
          <span
            class="hero-chevron-down ml-1 h-3 w-3"
            data-phx-id="m15-phx-F-ysQdSGXP6Fm_qE"
          ></span>
        </span>
        <input
          type="text"
          placeholder="First or full name"
          autofocus={false}
          class="font-mono border-0 focus:ring-0 grow p-0"
          name="trial-input"
          id="trial-input"
          phx-change="update_trial_name"
          value=""
        />
      </div>
      <button
        type="submit"
        aria-label="Check gender"
        class="h-[48px] w-[48px] bg-brand hover:bg-brand-700 rounded-lg ml-2 flex items-center justify-center drop-shadow-xl"
      >
        <span
          class="hero-magnifying-glass text-white h-6 w-6"
          data-phx-id="m16-phx-F-ysQdSGXP6Fm_qE"
        ></span>
      </button>
      <ul
        hidden={true}
        id="trial-country-select"
        class="absolute top-[60px] z-10 bg-white rounded-lg drop-shadow-xl w-full p-2 max-h-[320px] overflow-scroll font-mono text-sm"
      >
        <li
          phx-click='[["toggle",{"ins":[["ease-out","duration-100"],["opacity-0","scale-95"],["opacity-100","scale-100"]],"to":"#trial-country-select","outs":[["ease-out","duration-75"],["opacity-100","scale-100"],["opacity-0","scale-95"]]}],["push",{"value":{"country_id":"nil"},"event":"update_trial_country"}]]'
          class="px-4 py-2 hover:bg-zinc-100 rounded-md"
        >
          <p>🌎 Global</p>
        </li>
        <li
          phx-click='[["toggle",{"ins":[["ease-out","duration-100"],["opacity-0","scale-95"],["opacity-100","scale-100"]],"to":"#trial-country-select","outs":[["ease-out","duration-75"],["opacity-100","scale-100"],["opacity-0","scale-95"]]}],["push",{"value":{"country_id":"AF"},"event":"update_trial_country"}]]'
          class="px-4 py-2 hover:bg-zinc-100 rounded-md"
        >
          <p>🇦🇫 Afghanistan</p>
        </li>
      </ul>
    </form>
  );
}
