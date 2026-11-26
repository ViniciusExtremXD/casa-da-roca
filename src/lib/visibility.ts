/*
 * Animações infinitas (estrelas, luz da janela) só rodam com a cena perto da tela.
 * Fora dela, a cena recebe `anim-paused` e todos os filhos param (ver styles.css).
 */
export function pauseOffscreenAnimations() {
  if (typeof IntersectionObserver === "undefined") return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle("anim-paused", !entry.isIntersecting);
    },
    { rootMargin: "160px 0px" },
  );
  document.querySelectorAll("[data-scene]").forEach((el) => io.observe(el));

  return () => io.disconnect();
}
