export function focusSignup(): boolean {
  const target = document.getElementById("cadastro");
  if (!target) return false;
  history.replaceState(null, "", "#cadastro");
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
  document.getElementById("waitlist-email")?.focus({ preventScroll: true });
  return true;
}
