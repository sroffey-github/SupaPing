"use client";

type SegmentedControlProps = {
value: boolean;
onChange: (value: boolean) => void;
};

export default function SegmentedControl({ value, onChange }: SegmentedControlProps) {
    return (
    <div className="flex items-center gap-1.5 rounded-xl bg-slate-200 p-1">
        <button
            type="button"
            onClick={() => onChange(true)}
            aria-pressed={value}
            className={`rounded-lg px-3 py-1.5 font-mono text-[11px] transition-all ${
                    value
                        ? "bg-[#EEF2F6] font-semibold text-[#0F172A] shadow"
                        : "text-on-surface-variant"
                    }`}
            >
            SupaPing Active
        </button>
        <button
            type="button"
            onClick={() => onChange(false)}
            aria-pressed={!value}
            className={`rounded-lg px-3 py-1.5 font-mono text-[11px] transition-all ${
            !value
                ? "bg-red-100 font-semibold text-red-600 shadow"
                : "text-on-surface-variant"
            }`}
        >
            Simulate Sleep
        </button>
    </div>
    );
}
