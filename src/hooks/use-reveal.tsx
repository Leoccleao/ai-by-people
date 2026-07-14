import { useEffect, useRef, useState } from "react";

const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState<boolean>(PREFERS_REDUCED_MOTION);

  useEffect(() => {
    if (shown) return;
    const node = ref.current;
    if (!node) return;

    if (PREFERS_REDUCED_MOTION || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // If the element is already on screen at mount, show immediately.
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(node);

    // Safety net: never leave content invisible.
    const failSafe = window.setTimeout(() => {
      setShown(true);
      io.disconnect();
    }, 600);

    return () => {
      window.clearTimeout(failSafe);
      io.disconnect();
    };
  }, [shown]);

  return { ref, shown };
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, shown } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: shown ? `${delay}ms` : "0ms",
        transitionProperty: "opacity, transform",
        transitionDuration: "400ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(12px)",
        willChange: shown ? "auto" : "opacity, transform",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
