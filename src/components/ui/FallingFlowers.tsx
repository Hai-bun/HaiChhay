import { useMemo, type CSSProperties } from "react";

// Soft wedding palette: coral, blush, gold, white, rose, peach.
const COLORS = ["#ff8a7a", "#ffb3c1", "#ffd166", "#ffffff", "#f48fb1", "#ffc9a8"];

interface Flower {
  id: number;
  left: number;
  size: number;
  fall: number;
  delay: number;
  drift: number;
  sway: number;
  swayDur: number;
  spin: number;
  color: string;
  kind: "blossom" | "petal";
  opacity: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const makeFlowers = (count: number): Flower[] =>
  Array.from({ length: count }, (_, id) => ({
    id,
    left: rand(0, 100),
    size: rand(14, 30),
    fall: rand(11, 20),
    delay: rand(0, 9),
    drift: rand(-8, 8),
    sway: rand(14, 42),
    swayDur: rand(2.6, 4.6),
    spin: rand(25, 70),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    kind: Math.random() < 0.55 ? "blossom" : "petal",
    opacity: rand(0.72, 0.95),
  }));

const Blossom = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="12" cy="6.2" rx="3.7" ry="5.6" fill={color} transform={`rotate(${a} 12 12)`} />
    ))}
    <circle cx="12" cy="12" r="2.4" fill="#f5b942" />
  </svg>
);

const Petal = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
    <path d="M12 1.5C19 7.5 19 16 12 22.5 5 16 5 7.5 12 1.5Z" fill={color} />
    <path d="M12 4C12 9 12 15 12 20" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="none" />
  </svg>
);

/**
 * Blossoms and petals drift down the screen, swaying and turning as they fall.
 * Pure CSS motion (see `.ff*` in index.css); skipped for visitors who prefer reduced motion.
 */
export const FallingFlowers = () => {
  const flowers = useMemo(() => {
    if (typeof window === "undefined") return [];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return [];
    return makeFlowers(window.innerWidth < 640 ? 12 : 20);
  }, []);

  if (flowers.length === 0) return null;

  return (
    <div className="falling-flowers" aria-hidden="true">
      {flowers.map((f) => (
        <span
          key={f.id}
          className="ff"
          style={
            {
              left: `${f.left}%`,
              opacity: f.opacity,
              "--size": `${f.size}px`,
              "--fall": `${f.fall}s`,
              "--delay": `${f.delay}s`,
              "--drift": `${f.drift}vw`,
            } as CSSProperties
          }>
          <span
            className="ff-sway"
            style={
              {
                "--sway": `${f.sway}px`,
                "--sway-dur": `${f.swayDur}s`,
                "--spin": `${f.spin}deg`,
              } as CSSProperties
            }>
            {f.kind === "blossom" ? <Blossom color={f.color} /> : <Petal color={f.color} />}
          </span>
        </span>
      ))}
    </div>
  );
};
