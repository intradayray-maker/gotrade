"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";

const FLAGS: Record<string, string> = {
  US: "🇺🇸",
  BR: "🇧🇷",
  UK: "🇬🇧",
  EU: "🇪🇺",
  AE: "🇦🇪",
  PK: "🇵🇰",
  BD: "🇧🇩",
  TH: "🇹🇭",
  CN: "🇨🇳",
  JP: "🇯🇵",
  AU: "🇦🇺",
};

const TIMEZONE_GROUPS = [
  {
    label: "Americas",
    zones: [
      { value: "Pacific/Midway", label: "GMT-11 — Midway", flag: FLAGS.US },
      { value: "Pacific/Honolulu", label: "GMT-10 — Honolulu", flag: FLAGS.US },
      { value: "America/Anchorage", label: "GMT-9 — Anchorage", flag: FLAGS.US },
      { value: "America/Los_Angeles", label: "GMT-8 — Los Angeles", flag: FLAGS.US },
      { value: "America/Denver", label: "GMT-7 — Denver", flag: FLAGS.US },
      { value: "America/Chicago", label: "GMT-6 — Chicago", flag: FLAGS.US },
      { value: "America/New_York", label: "GMT-5 — New York", flag: FLAGS.US },
      { value: "America/Sao_Paulo", label: "GMT-3 — São Paulo", flag: FLAGS.BR },
    ],
  },
  {
    label: "Europe",
    zones: [
      { value: "UTC", label: "GMT+0 — UTC", flag: FLAGS.UK },
      { value: "Europe/London", label: "GMT+0 — London", flag: FLAGS.UK },
      { value: "Europe/Berlin", label: "GMT+1 — Berlin", flag: FLAGS.EU },
      { value: "Europe/Athens", label: "GMT+2 — Athens", flag: FLAGS.EU },
    ],
  },
  {
    label: "Middle East & Asia",
    zones: [
      { value: "Asia/Dubai", label: "GMT+4 — Dubai", flag: FLAGS.AE },
      { value: "Asia/Karachi", label: "GMT+5 — Karachi", flag: FLAGS.PK },
      { value: "Asia/Dhaka", label: "GMT+6 — Dhaka", flag: FLAGS.BD },
      { value: "Asia/Bangkok", label: "GMT+7 — Bangkok", flag: FLAGS.TH },
      { value: "Asia/Shanghai", label: "GMT+8 — Shanghai", flag: FLAGS.CN },
      { value: "Asia/Tokyo", label: "GMT+9 — Tokyo", flag: FLAGS.JP },
    ],
  },
  {
    label: "Oceania",
    zones: [
      { value: "Australia/Sydney", label: "GMT+10 — Sydney", flag: FLAGS.AU },
    ],
  },
];

export default function TimezoneSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className="
          w-full flex items-center justify-between
          bg-white/10 border border-white/10
          px-3 py-2 rounded-lg text-white
          focus:outline-none focus:ring-2 focus:ring-white/20
        "
      >
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-white/60" />
          <Select.Value />
        </div>
        <ChevronDown size={16} className="text-white/60" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="
            bg-black/90 backdrop-blur-xl border border-white/10
            rounded-xl shadow-xl overflow-hidden
            animate-in fade-in zoom-in-95
          "
        >
          <Select.ScrollUpButton className="flex items-center justify-center py-1 text-white/40">
            <ChevronUp size={16} />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-2 max-h-72 overflow-y-auto">
            {TIMEZONE_GROUPS.map((group) => (
              <div key={group.label} className="mb-3">
                <p className="text-xs uppercase tracking-wider text-white/40 px-2 mb-1">
                  {group.label}
                </p>

                {group.zones.map((tz) => (
                  <Select.Item
                    key={tz.value}
                    value={tz.value}
                    className="
                      flex items-center gap-2 px-3 py-2 rounded-lg
                      text-white cursor-pointer
                      hover:bg-white/10
                      data-[state=checked]:bg-white/20
                      transition
                    "
                  >
                    <Select.ItemText>
                      <span className="mr-2">{tz.flag}</span>
                      {tz.label}
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </div>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex items-center justify-center py-1 text-white/40">
            <ChevronDown size={16} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
