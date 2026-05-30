const FLOWERS = [
  "flower1",
  "flower2",
  "flower3",
  "flower4",
  "flower5",
  "flower6",
] as const;

export function FlowersOverlay({ className }: { className?: string }) {
  return (
    <div
      className={`flower-container ${className ?? ""}`.trim()}
      aria-hidden
    >
      {FLOWERS.map((name) => (
        <div key={name} className={`flower ${name}`}>
          <div className="petal one" />
          <div className="petal two" />
          <div className="petal three" />
          <div className="petal four" />
        </div>
      ))}
    </div>
  );
}
