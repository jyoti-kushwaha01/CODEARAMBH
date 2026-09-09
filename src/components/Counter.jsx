import { useCountUp, useInView, fmt } from "../lib/hooks";

export default function Counter({ to, decimals = 0, suffix = "", prefix = "", className = "", duration = 1600 }) {
  const [ref, inView] = useInView();
  const n = useCountUp(to, { decimals, run: inView, duration });
  return (
    <span ref={ref} className={className}>
      {prefix}
      {fmt(n, decimals)}
      {suffix}
    </span>
  );
}
