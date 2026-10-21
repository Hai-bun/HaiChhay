/**
 * Scroll reveal that replays in both directions: the class is added when an element
 * comes into view and removed once it has fully left, so scrolling back (up or down)
 * plays its entrance again.
 *
 * Adding uses a visible-share threshold (or a big enough slice for tall elements that
 * can never reach it); removing waits until the element is completely out of view, so
 * it never flickers at the edge. Returns a function that disconnects the observer.
 */
export function revealOnScroll(
  els: Element[],
  className: string,
  options: { threshold?: number; rootMargin?: string } = {},
): () => void {
  const { threshold = 0.15, rootMargin = "0px" } = options;
  if (typeof IntersectionObserver === "undefined") {
    els.forEach((el) => el.classList.add(className));
    return () => undefined;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const el = e.target;
        const enough =
          e.intersectionRatio >= threshold || e.intersectionRect.height >= window.innerHeight * 0.3;
        if (enough || (e.isIntersecting && el.classList.contains(className))) {
          el.classList.add(className);
        } else if (!e.isIntersecting) {
          el.classList.remove(className);
        }
      });
    },
    { threshold: [0, threshold], rootMargin },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
