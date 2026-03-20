import { createSignal, createMemo, For, onMount, onCleanup } from "solid-js";

export interface Country {
  code: string;
  name: string;
  emoji: string;
}

const COUNTRIES: Country[] = [
  { code: "AF", name: "Afghanistan", emoji: "\u{1F1E6}\u{1F1EB}" },
  { code: "AL", name: "Albania", emoji: "\u{1F1E6}\u{1F1F1}" },
  { code: "DZ", name: "Algeria", emoji: "\u{1F1E9}\u{1F1FF}" },
  { code: "AD", name: "Andorra", emoji: "\u{1F1E6}\u{1F1E9}" },
  { code: "AO", name: "Angola", emoji: "\u{1F1E6}\u{1F1F4}" },
  { code: "AG", name: "Antigua and Barbuda", emoji: "\u{1F1E6}\u{1F1EC}" },
  { code: "AR", name: "Argentina", emoji: "\u{1F1E6}\u{1F1F7}" },
  { code: "AM", name: "Armenia", emoji: "\u{1F1E6}\u{1F1F2}" },
  { code: "AU", name: "Australia", emoji: "\u{1F1E6}\u{1F1FA}" },
  { code: "AT", name: "Austria", emoji: "\u{1F1E6}\u{1F1F9}" },
  { code: "AZ", name: "Azerbaijan", emoji: "\u{1F1E6}\u{1F1FF}" },
  { code: "BS", name: "Bahamas", emoji: "\u{1F1E7}\u{1F1F8}" },
  { code: "BH", name: "Bahrain", emoji: "\u{1F1E7}\u{1F1ED}" },
  { code: "BD", name: "Bangladesh", emoji: "\u{1F1E7}\u{1F1E9}" },
  { code: "BB", name: "Barbados", emoji: "\u{1F1E7}\u{1F1E7}" },
  { code: "BY", name: "Belarus", emoji: "\u{1F1E7}\u{1F1FE}" },
  { code: "BE", name: "Belgium", emoji: "\u{1F1E7}\u{1F1EA}" },
  { code: "BZ", name: "Belize", emoji: "\u{1F1E7}\u{1F1FF}" },
  { code: "BJ", name: "Benin", emoji: "\u{1F1E7}\u{1F1EF}" },
  { code: "BT", name: "Bhutan", emoji: "\u{1F1E7}\u{1F1F9}" },
  { code: "BO", name: "Bolivia", emoji: "\u{1F1E7}\u{1F1F4}" },
  { code: "BA", name: "Bosnia and Herzegovina", emoji: "\u{1F1E7}\u{1F1E6}" },
  { code: "BW", name: "Botswana", emoji: "\u{1F1E7}\u{1F1FC}" },
  { code: "BR", name: "Brazil", emoji: "\u{1F1E7}\u{1F1F7}" },
  { code: "BN", name: "Brunei", emoji: "\u{1F1E7}\u{1F1F3}" },
  { code: "BG", name: "Bulgaria", emoji: "\u{1F1E7}\u{1F1EC}" },
  { code: "BF", name: "Burkina Faso", emoji: "\u{1F1E7}\u{1F1EB}" },
  { code: "BI", name: "Burundi", emoji: "\u{1F1E7}\u{1F1EE}" },
  { code: "CV", name: "Cabo Verde", emoji: "\u{1F1E8}\u{1F1FB}" },
  { code: "KH", name: "Cambodia", emoji: "\u{1F1F0}\u{1F1ED}" },
  { code: "CM", name: "Cameroon", emoji: "\u{1F1E8}\u{1F1F2}" },
  { code: "CA", name: "Canada", emoji: "\u{1F1E8}\u{1F1E6}" },
  { code: "CF", name: "Central African Republic", emoji: "\u{1F1E8}\u{1F1EB}" },
  { code: "TD", name: "Chad", emoji: "\u{1F1F9}\u{1F1E9}" },
  { code: "CL", name: "Chile", emoji: "\u{1F1E8}\u{1F1F1}" },
  { code: "CN", name: "China", emoji: "\u{1F1E8}\u{1F1F3}" },
  { code: "CO", name: "Colombia", emoji: "\u{1F1E8}\u{1F1F4}" },
  { code: "KM", name: "Comoros", emoji: "\u{1F1F0}\u{1F1F2}" },
  { code: "CG", name: "Congo", emoji: "\u{1F1E8}\u{1F1EC}" },
  { code: "CD", name: "Congo (DRC)", emoji: "\u{1F1E8}\u{1F1E9}" },
  { code: "CR", name: "Costa Rica", emoji: "\u{1F1E8}\u{1F1F7}" },
  { code: "CI", name: "C\u00f4te d'Ivoire", emoji: "\u{1F1E8}\u{1F1EE}" },
  { code: "HR", name: "Croatia", emoji: "\u{1F1ED}\u{1F1F7}" },
  { code: "CU", name: "Cuba", emoji: "\u{1F1E8}\u{1F1FA}" },
  { code: "CY", name: "Cyprus", emoji: "\u{1F1E8}\u{1F1FE}" },
  { code: "CZ", name: "Czechia", emoji: "\u{1F1E8}\u{1F1FF}" },
  { code: "DK", name: "Denmark", emoji: "\u{1F1E9}\u{1F1F0}" },
  { code: "DJ", name: "Djibouti", emoji: "\u{1F1E9}\u{1F1EF}" },
  { code: "DM", name: "Dominica", emoji: "\u{1F1E9}\u{1F1F2}" },
  { code: "DO", name: "Dominican Republic", emoji: "\u{1F1E9}\u{1F1F4}" },
  { code: "EC", name: "Ecuador", emoji: "\u{1F1EA}\u{1F1E8}" },
  { code: "EG", name: "Egypt", emoji: "\u{1F1EA}\u{1F1EC}" },
  { code: "SV", name: "El Salvador", emoji: "\u{1F1F8}\u{1F1FB}" },
  { code: "GQ", name: "Equatorial Guinea", emoji: "\u{1F1EC}\u{1F1F6}" },
  { code: "ER", name: "Eritrea", emoji: "\u{1F1EA}\u{1F1F7}" },
  { code: "EE", name: "Estonia", emoji: "\u{1F1EA}\u{1F1EA}" },
  { code: "SZ", name: "Eswatini", emoji: "\u{1F1F8}\u{1F1FF}" },
  { code: "ET", name: "Ethiopia", emoji: "\u{1F1EA}\u{1F1F9}" },
  { code: "FJ", name: "Fiji", emoji: "\u{1F1EB}\u{1F1EF}" },
  { code: "FI", name: "Finland", emoji: "\u{1F1EB}\u{1F1EE}" },
  { code: "FR", name: "France", emoji: "\u{1F1EB}\u{1F1F7}" },
  { code: "GA", name: "Gabon", emoji: "\u{1F1EC}\u{1F1E6}" },
  { code: "GM", name: "Gambia", emoji: "\u{1F1EC}\u{1F1F2}" },
  { code: "GE", name: "Georgia", emoji: "\u{1F1EC}\u{1F1EA}" },
  { code: "DE", name: "Germany", emoji: "\u{1F1E9}\u{1F1EA}" },
  { code: "GH", name: "Ghana", emoji: "\u{1F1EC}\u{1F1ED}" },
  { code: "GR", name: "Greece", emoji: "\u{1F1EC}\u{1F1F7}" },
  { code: "GD", name: "Grenada", emoji: "\u{1F1EC}\u{1F1E9}" },
  { code: "GT", name: "Guatemala", emoji: "\u{1F1EC}\u{1F1F9}" },
  { code: "GN", name: "Guinea", emoji: "\u{1F1EC}\u{1F1F3}" },
  { code: "GW", name: "Guinea-Bissau", emoji: "\u{1F1EC}\u{1F1FC}" },
  { code: "GY", name: "Guyana", emoji: "\u{1F1EC}\u{1F1FE}" },
  { code: "HT", name: "Haiti", emoji: "\u{1F1ED}\u{1F1F9}" },
  { code: "HN", name: "Honduras", emoji: "\u{1F1ED}\u{1F1F3}" },
  { code: "HU", name: "Hungary", emoji: "\u{1F1ED}\u{1F1FA}" },
  { code: "IS", name: "Iceland", emoji: "\u{1F1EE}\u{1F1F8}" },
  { code: "IN", name: "India", emoji: "\u{1F1EE}\u{1F1F3}" },
  { code: "ID", name: "Indonesia", emoji: "\u{1F1EE}\u{1F1E9}" },
  { code: "IR", name: "Iran", emoji: "\u{1F1EE}\u{1F1F7}" },
  { code: "IQ", name: "Iraq", emoji: "\u{1F1EE}\u{1F1F6}" },
  { code: "IE", name: "Ireland", emoji: "\u{1F1EE}\u{1F1EA}" },
  { code: "IL", name: "Israel", emoji: "\u{1F1EE}\u{1F1F1}" },
  { code: "IT", name: "Italy", emoji: "\u{1F1EE}\u{1F1F9}" },
  { code: "JM", name: "Jamaica", emoji: "\u{1F1EF}\u{1F1F2}" },
  { code: "JP", name: "Japan", emoji: "\u{1F1EF}\u{1F1F5}" },
  { code: "JO", name: "Jordan", emoji: "\u{1F1EF}\u{1F1F4}" },
  { code: "KZ", name: "Kazakhstan", emoji: "\u{1F1F0}\u{1F1FF}" },
  { code: "KE", name: "Kenya", emoji: "\u{1F1F0}\u{1F1EA}" },
  { code: "KI", name: "Kiribati", emoji: "\u{1F1F0}\u{1F1EE}" },
  { code: "KP", name: "North Korea", emoji: "\u{1F1F0}\u{1F1F5}" },
  { code: "KR", name: "South Korea", emoji: "\u{1F1F0}\u{1F1F7}" },
  { code: "KW", name: "Kuwait", emoji: "\u{1F1F0}\u{1F1FC}" },
  { code: "KG", name: "Kyrgyzstan", emoji: "\u{1F1F0}\u{1F1EC}" },
  { code: "LA", name: "Laos", emoji: "\u{1F1F1}\u{1F1E6}" },
  { code: "LV", name: "Latvia", emoji: "\u{1F1F1}\u{1F1FB}" },
  { code: "LB", name: "Lebanon", emoji: "\u{1F1F1}\u{1F1E7}" },
  { code: "LS", name: "Lesotho", emoji: "\u{1F1F1}\u{1F1F8}" },
  { code: "LR", name: "Liberia", emoji: "\u{1F1F1}\u{1F1F7}" },
  { code: "LY", name: "Libya", emoji: "\u{1F1F1}\u{1F1FE}" },
  { code: "LI", name: "Liechtenstein", emoji: "\u{1F1F1}\u{1F1EE}" },
  { code: "LT", name: "Lithuania", emoji: "\u{1F1F1}\u{1F1F9}" },
  { code: "LU", name: "Luxembourg", emoji: "\u{1F1F1}\u{1F1FA}" },
  { code: "MG", name: "Madagascar", emoji: "\u{1F1F2}\u{1F1EC}" },
  { code: "MW", name: "Malawi", emoji: "\u{1F1F2}\u{1F1FC}" },
  { code: "MY", name: "Malaysia", emoji: "\u{1F1F2}\u{1F1FE}" },
  { code: "MV", name: "Maldives", emoji: "\u{1F1F2}\u{1F1FB}" },
  { code: "ML", name: "Mali", emoji: "\u{1F1F2}\u{1F1F1}" },
  { code: "MT", name: "Malta", emoji: "\u{1F1F2}\u{1F1F9}" },
  { code: "MH", name: "Marshall Islands", emoji: "\u{1F1F2}\u{1F1ED}" },
  { code: "MR", name: "Mauritania", emoji: "\u{1F1F2}\u{1F1F7}" },
  { code: "MU", name: "Mauritius", emoji: "\u{1F1F2}\u{1F1FA}" },
  { code: "MX", name: "Mexico", emoji: "\u{1F1F2}\u{1F1FD}" },
  { code: "FM", name: "Micronesia", emoji: "\u{1F1EB}\u{1F1F2}" },
  { code: "MD", name: "Moldova", emoji: "\u{1F1F2}\u{1F1E9}" },
  { code: "MC", name: "Monaco", emoji: "\u{1F1F2}\u{1F1E8}" },
  { code: "MN", name: "Mongolia", emoji: "\u{1F1F2}\u{1F1F3}" },
  { code: "ME", name: "Montenegro", emoji: "\u{1F1F2}\u{1F1EA}" },
  { code: "MA", name: "Morocco", emoji: "\u{1F1F2}\u{1F1E6}" },
  { code: "MZ", name: "Mozambique", emoji: "\u{1F1F2}\u{1F1FF}" },
  { code: "MM", name: "Myanmar", emoji: "\u{1F1F2}\u{1F1F2}" },
  { code: "NA", name: "Namibia", emoji: "\u{1F1F3}\u{1F1E6}" },
  { code: "NR", name: "Nauru", emoji: "\u{1F1F3}\u{1F1F7}" },
  { code: "NP", name: "Nepal", emoji: "\u{1F1F3}\u{1F1F5}" },
  { code: "NL", name: "Netherlands", emoji: "\u{1F1F3}\u{1F1F1}" },
  { code: "NZ", name: "New Zealand", emoji: "\u{1F1F3}\u{1F1FF}" },
  { code: "NI", name: "Nicaragua", emoji: "\u{1F1F3}\u{1F1EE}" },
  { code: "NE", name: "Niger", emoji: "\u{1F1F3}\u{1F1EA}" },
  { code: "NG", name: "Nigeria", emoji: "\u{1F1F3}\u{1F1EC}" },
  { code: "MK", name: "North Macedonia", emoji: "\u{1F1F2}\u{1F1F0}" },
  { code: "NO", name: "Norway", emoji: "\u{1F1F3}\u{1F1F4}" },
  { code: "OM", name: "Oman", emoji: "\u{1F1F4}\u{1F1F2}" },
  { code: "PK", name: "Pakistan", emoji: "\u{1F1F5}\u{1F1F0}" },
  { code: "PW", name: "Palau", emoji: "\u{1F1F5}\u{1F1FC}" },
  { code: "PS", name: "Palestine", emoji: "\u{1F1F5}\u{1F1F8}" },
  { code: "PA", name: "Panama", emoji: "\u{1F1F5}\u{1F1E6}" },
  { code: "PG", name: "Papua New Guinea", emoji: "\u{1F1F5}\u{1F1EC}" },
  { code: "PY", name: "Paraguay", emoji: "\u{1F1F5}\u{1F1FE}" },
  { code: "PE", name: "Peru", emoji: "\u{1F1F5}\u{1F1EA}" },
  { code: "PH", name: "Philippines", emoji: "\u{1F1F5}\u{1F1ED}" },
  { code: "PL", name: "Poland", emoji: "\u{1F1F5}\u{1F1F1}" },
  { code: "PT", name: "Portugal", emoji: "\u{1F1F5}\u{1F1F9}" },
  { code: "QA", name: "Qatar", emoji: "\u{1F1F6}\u{1F1E6}" },
  { code: "RO", name: "Romania", emoji: "\u{1F1F7}\u{1F1F4}" },
  { code: "RU", name: "Russia", emoji: "\u{1F1F7}\u{1F1FA}" },
  { code: "RW", name: "Rwanda", emoji: "\u{1F1F7}\u{1F1FC}" },
  { code: "KN", name: "Saint Kitts and Nevis", emoji: "\u{1F1F0}\u{1F1F3}" },
  { code: "LC", name: "Saint Lucia", emoji: "\u{1F1F1}\u{1F1E8}" },
  { code: "VC", name: "Saint Vincent and the Grenadines", emoji: "\u{1F1FB}\u{1F1E8}" },
  { code: "WS", name: "Samoa", emoji: "\u{1F1FC}\u{1F1F8}" },
  { code: "SM", name: "San Marino", emoji: "\u{1F1F8}\u{1F1F2}" },
  { code: "ST", name: "S\u00e3o Tom\u00e9 and Pr\u00edncipe", emoji: "\u{1F1F8}\u{1F1F9}" },
  { code: "SA", name: "Saudi Arabia", emoji: "\u{1F1F8}\u{1F1E6}" },
  { code: "SN", name: "Senegal", emoji: "\u{1F1F8}\u{1F1F3}" },
  { code: "RS", name: "Serbia", emoji: "\u{1F1F7}\u{1F1F8}" },
  { code: "SC", name: "Seychelles", emoji: "\u{1F1F8}\u{1F1E8}" },
  { code: "SL", name: "Sierra Leone", emoji: "\u{1F1F8}\u{1F1F1}" },
  { code: "SG", name: "Singapore", emoji: "\u{1F1F8}\u{1F1EC}" },
  { code: "SK", name: "Slovakia", emoji: "\u{1F1F8}\u{1F1F0}" },
  { code: "SI", name: "Slovenia", emoji: "\u{1F1F8}\u{1F1EE}" },
  { code: "SB", name: "Solomon Islands", emoji: "\u{1F1F8}\u{1F1E7}" },
  { code: "SO", name: "Somalia", emoji: "\u{1F1F8}\u{1F1F4}" },
  { code: "ZA", name: "South Africa", emoji: "\u{1F1FF}\u{1F1E6}" },
  { code: "SS", name: "South Sudan", emoji: "\u{1F1F8}\u{1F1F8}" },
  { code: "ES", name: "Spain", emoji: "\u{1F1EA}\u{1F1F8}" },
  { code: "LK", name: "Sri Lanka", emoji: "\u{1F1F1}\u{1F1F0}" },
  { code: "SD", name: "Sudan", emoji: "\u{1F1F8}\u{1F1E9}" },
  { code: "SR", name: "Suriname", emoji: "\u{1F1F8}\u{1F1F7}" },
  { code: "SE", name: "Sweden", emoji: "\u{1F1F8}\u{1F1EA}" },
  { code: "CH", name: "Switzerland", emoji: "\u{1F1E8}\u{1F1ED}" },
  { code: "SY", name: "Syria", emoji: "\u{1F1F8}\u{1F1FE}" },
  { code: "TW", name: "Taiwan", emoji: "\u{1F1F9}\u{1F1FC}" },
  { code: "TJ", name: "Tajikistan", emoji: "\u{1F1F9}\u{1F1EF}" },
  { code: "TZ", name: "Tanzania", emoji: "\u{1F1F9}\u{1F1FF}" },
  { code: "TH", name: "Thailand", emoji: "\u{1F1F9}\u{1F1ED}" },
  { code: "TL", name: "Timor-Leste", emoji: "\u{1F1F9}\u{1F1F1}" },
  { code: "TG", name: "Togo", emoji: "\u{1F1F9}\u{1F1EC}" },
  { code: "TO", name: "Tonga", emoji: "\u{1F1F9}\u{1F1F4}" },
  { code: "TT", name: "Trinidad and Tobago", emoji: "\u{1F1F9}\u{1F1F9}" },
  { code: "TN", name: "Tunisia", emoji: "\u{1F1F9}\u{1F1F3}" },
  { code: "TR", name: "Turkey", emoji: "\u{1F1F9}\u{1F1F7}" },
  { code: "TM", name: "Turkmenistan", emoji: "\u{1F1F9}\u{1F1F2}" },
  { code: "TV", name: "Tuvalu", emoji: "\u{1F1F9}\u{1F1FB}" },
  { code: "UG", name: "Uganda", emoji: "\u{1F1FA}\u{1F1EC}" },
  { code: "UA", name: "Ukraine", emoji: "\u{1F1FA}\u{1F1E6}" },
  { code: "AE", name: "United Arab Emirates", emoji: "\u{1F1E6}\u{1F1EA}" },
  { code: "GB", name: "United Kingdom", emoji: "\u{1F1EC}\u{1F1E7}" },
  { code: "US", name: "United States", emoji: "\u{1F1FA}\u{1F1F8}" },
  { code: "UY", name: "Uruguay", emoji: "\u{1F1FA}\u{1F1FE}" },
  { code: "UZ", name: "Uzbekistan", emoji: "\u{1F1FA}\u{1F1FF}" },
  { code: "VU", name: "Vanuatu", emoji: "\u{1F1FB}\u{1F1FA}" },
  { code: "VA", name: "Vatican City", emoji: "\u{1F1FB}\u{1F1E6}" },
  { code: "VE", name: "Venezuela", emoji: "\u{1F1FB}\u{1F1EA}" },
  { code: "VN", name: "Vietnam", emoji: "\u{1F1FB}\u{1F1F3}" },
  { code: "YE", name: "Yemen", emoji: "\u{1F1FE}\u{1F1EA}" },
  { code: "ZM", name: "Zambia", emoji: "\u{1F1FF}\u{1F1F2}" },
  { code: "ZW", name: "Zimbabwe", emoji: "\u{1F1FF}\u{1F1FC}" },
];

interface CountryPickerProps {
  selected: Country | null;
  onSelect: (country: Country | null) => void;
}

export default function CountryPicker(props: CountryPickerProps) {
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");
  let rootRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;

  const filtered = createMemo(() => {
    const q = search().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  });

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
              onInput={(e) => setSearch(e.currentTarget.value)}
              class="w-full px-3 py-1.5 text-sm rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-300 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white dark:placeholder-neutral-500 dark:focus:border-neutral-500"
            />
          </div>
          <div class="max-h-56 overflow-y-auto overscroll-contain">
            <button
              onClick={() => select(null)}
              class={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${
                !props.selected ? "bg-neutral-50 dark:bg-neutral-700/50" : ""
              }`}
            >
              <span class="text-base leading-none">{"\u{1F30D}"}</span>
              <span class="text-neutral-700 dark:text-neutral-200">Global</span>
              <span class="ml-auto text-xs text-neutral-400">All</span>
            </button>
            <For each={filtered()}>
              {(country) => (
                <button
                  onClick={() => select(country)}
                  class={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${
                    props.selected?.code === country.code ? "bg-neutral-50 dark:bg-neutral-700/50" : ""
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
