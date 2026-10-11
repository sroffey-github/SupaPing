type StatusDotProps = {
  pulse?: boolean;
};

export default function StatusDot({ pulse = false }: StatusDotProps) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full bg-primary ${
        pulse ? "animate-ping" : ""
      }`}
      aria-hidden="true"
    />
  );
}