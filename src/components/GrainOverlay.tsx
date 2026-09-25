/**
 * Лёгкая плёночная зернистость поверх всего сайта.
 * Чисто декоративный слой — скрыт от скринридеров и не блокирует клики (pointer-events: none в CSS).
 */
export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
