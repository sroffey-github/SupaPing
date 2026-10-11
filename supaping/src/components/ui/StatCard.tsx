import Card from "./Card";

type StatCardProps = {
  value: string;
  label: string;
  color?: string;
};

export default function StatCard({
  value,
  label,
  color = "text-[#0F172A]",
}: StatCardProps) {
  return (
    <Card
      padding="sm"
      className="rounded-2xl"
    >
      <span
        className={`font-mono text-[22px] font-semibold tracking-tight ${color}`}
      >
        {value}
      </span>

      <span className="mt-1 text-[13px] font-medium text-[#475569]">
        {label}
      </span>
    </Card>
  );
}