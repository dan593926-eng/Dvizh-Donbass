/**
 * Определяет слабое устройство, чтобы автоматически облегчить эффекты.
 * Критерии: ≤ 4 ядер процессора, ≤ 4 ГБ памяти или включённая экономия трафика.
 * Результат вычисляется один раз при загрузке страницы.
 */
type NavigatorExtra = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function detectLowPerf(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as NavigatorExtra;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData === true;
  return cores <= 4 || memory <= 4 || saveData;
}

export const isLowPerf = detectLowPerf();

/** Вызывается один раз в main.tsx — добавляет класс perf-low на <html> для CSS */
export function applyPerfClass(): void {
  if (isLowPerf) document.documentElement.classList.add("perf-low");
}
