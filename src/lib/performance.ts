/**
 * Определяет по-настоящему слабое устройство, чтобы облегчить эффекты.
 * Критерии: 2 ядра процессора или меньше, 2 ГБ памяти или меньше,
 * либо включённая экономия трафика. Обычные телефоны (4+ ГБ) сюда не попадают.
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
  return cores <= 2 || memory <= 2 || saveData;
}

export const isLowPerf = detectLowPerf();

/** Вызывается один раз в main.tsx — добавляет класс perf-low на <html> для CSS */
export function applyPerfClass(): void {
  if (isLowPerf) document.documentElement.classList.add("perf-low");
}
