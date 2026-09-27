/**
 * Логика карты сходок: чтение таблицы, разбор координат и времени, «истечение» точек.
 * Код без зависимостей — отдельно от карты, чтобы его было легко проверять.
 */

export type Meetup = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  /** Абсолютное время начала/конца (мс с 1970 г.), с учётом часового пояса места */
  start: number;
  end: number;
  /** Как показывать время людям — «как на месте»: «5 октября, 19:00» */
  whenLabel: string;
  address: string;
  description: string;
  link: string;
};

export type ParseResult = { meetups: Meetup[]; errors: string[] };

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/* ---------------- CSV (формат, в котором Google Таблицы отдают данные) ---------------- */

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/* ---------------- Координаты ---------------- */

/**
 * Понимает: "48.0159, 37.8028" · "48.0159 37.8028" · "48,0159; 37,8028"
 * и ссылки Google Maps вида ...@48.0159,37.8028,15z или ...?q=48.0159,37.8028
 */
export function parseCoords(input: string): [number, number] | null {
  const s = (input || "").trim();
  if (!s) return null;
  const fromUrl = s.match(/[@=](-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/);
  let lat: number;
  let lng: number;
  if (fromUrl) {
    lat = parseFloat(fromUrl[1]);
    lng = parseFloat(fromUrl[2]);
  } else {
    // "48,0159; 37,8028" — десятичная запятая и точка с запятой между числами
    const normalized = s.includes(";") ? s.replace(/,/g, ".").replace(/;/g, " ") : s;
    const nums = normalized.match(/-?\d+(?:\.\d+)?/g);
    if (!nums || nums.length < 2) return null;
    lat = parseFloat(nums[0]);
    lng = parseFloat(nums[1]);
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return [lat, lng];
}

/* ---------------- Часовой пояс ---------------- */

/** "+3", "+03:00", "UTC+3", "GMT+2", "3", "-1", "+5:30" → часы (3, 2, -1, 5.5) */
export function parseOffset(input: string | undefined): number | null {
  const s = (input || "").trim().toUpperCase().replace(/^(UTC|GMT|МСК)/, "");
  if (!s) return null;
  const m = s.match(/^([+-])?\s*(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  const hours = parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) / 60 : 0);
  if (hours > 14) return null;
  return sign * hours;
}

/* ---------------- Дата и время ---------------- */

type Wall = { y: number; mo: number; d: number; h: number; mi: number; hasTime: boolean };

/**
 * Понимает: "05.10.2026 19:00" · "5.10.2026 19:00:00" · "05.10.26 19:00"
 *           "2026-10-05 19:00" · "2026-10-05T19:00"  · "05.10.2026" (без времени)
 */
export function parseWallTime(input: string): Wall | null {
  const s = (input || "").trim();
  let m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})(?:[ ,T]+(\d{1,2})[:.](\d{2})(?::\d{2})?)?$/);
  let y: number, mo: number, d: number, h = 0, mi = 0, hasTime = false;
  if (m) {
    d = +m[1];
    mo = +m[2];
    y = +m[3];
    if (y < 100) y += 2000;
    if (m[4] !== undefined) {
      h = +m[4];
      mi = +m[5];
      hasTime = true;
    }
  } else {
    m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T]+(\d{1,2}):(\d{2})(?::\d{2})?)?$/);
    if (!m) return null;
    y = +m[1];
    mo = +m[2];
    d = +m[3];
    if (m[4] !== undefined) {
      h = +m[4];
      mi = +m[5];
      hasTime = true;
    }
  }
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null;
  // Проверка несуществующих дат вроде 31.02
  const check = new Date(Date.UTC(y, mo - 1, d));
  if (check.getUTCMonth() !== mo - 1) return null;
  return { y, mo, d, h, mi, hasTime };
}

function wallToMs(w: Wall, offsetHours: number): number {
  return Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi) - offsetHours * 3600_000;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function whenLabel(start: Wall, end: Wall | null): string {
  const date = `${start.d} ${MONTHS[start.mo - 1]}`;
  const from = start.hasTime ? `, ${pad(start.h)}:${pad(start.mi)}` : "";
  if (end && end.hasTime && start.hasTime) {
    const sameDay = end.y === start.y && end.mo === start.mo && end.d === start.d;
    return sameDay
      ? `${date}${from}–${pad(end.h)}:${pad(end.mi)}`
      : `${date}${from} — ${end.d} ${MONTHS[end.mo - 1]}, ${pad(end.h)}:${pad(end.mi)}`;
  }
  return date + from;
}

/* ---------------- Строки таблицы → сходки ---------------- */

const HEADERS: Record<string, string[]> = {
  title: ["название", "что", "name", "title"],
  coords: ["координаты", "где", "место", "coords", "coordinates", "location"],
  start: ["начало", "когда", "дата", "start", "date"],
  end: ["конец", "до", "окончание", "end"],
  tz: ["пояс", "часовой пояс", "timezone", "tz", "utc"],
  address: ["адрес", "address"],
  description: ["описание", "подробности", "description"],
  link: ["ссылка", "link", "url"],
};

function mapHeader(row: string[]): Record<string, number> {
  const idx: Record<string, number> = {};
  row.forEach((cell, i) => {
    const c = cell.trim().toLowerCase();
    for (const [key, names] of Object.entries(HEADERS)) {
      if (idx[key] === undefined && names.includes(c)) idx[key] = i;
    }
  });
  return idx;
}

export type RawMeetup = {
  title: string;
  coords: string;
  start: string;
  end?: string;
  tz?: string;
  address?: string;
  description?: string;
  link?: string;
};

export function buildMeetups(
  raws: RawMeetup[],
  opts: { defaultOffset: number; defaultDurationHours: number },
  rowNumberOffset = 2
): ParseResult {
  const meetups: Meetup[] = [];
  const errors: string[] = [];

  raws.forEach((r, i) => {
    const rowNo = i + rowNumberOffset;
    const title = (r.title || "").trim();
    if (!title && !r.coords && !r.start) return; // пустая строка
    const coords = parseCoords(r.coords);
    if (!coords) {
      errors.push(`Строка ${rowNo}${title ? ` («${title}»)` : ""}: не понял координаты «${r.coords || ""}»`);
      return;
    }
    const startWall = parseWallTime(r.start);
    if (!startWall) {
      errors.push(`Строка ${rowNo}${title ? ` («${title}»)` : ""}: не понял время начала «${r.start || ""}»`);
      return;
    }
    const offset = parseOffset(r.tz) ?? opts.defaultOffset;
    const start = wallToMs(startWall, offset);

    let endWall: Wall | null = null;
    let end: number;
    if (r.end && r.end.trim()) {
      endWall = parseWallTime(r.end);
      if (!endWall) {
        // Только время без даты, например "23:00" — тот же день (или следующий, если раньше начала)
        const t = r.end.trim().match(/^(\d{1,2})[:.](\d{2})$/);
        if (t) {
          endWall = { ...startWall, h: +t[1], mi: +t[2], hasTime: true };
          if (wallToMs(endWall, offset) <= start) {
            const next = new Date(Date.UTC(startWall.y, startWall.mo - 1, startWall.d + 1));
            endWall = { ...endWall, y: next.getUTCFullYear(), mo: next.getUTCMonth() + 1, d: next.getUTCDate() };
          }
        }
      }
      if (!endWall) {
        errors.push(`Строка ${rowNo}${title ? ` («${title}»)` : ""}: не понял время конца «${r.end}»`);
        return;
      }
      // Дата конца без времени — до конца этого дня
      if (!endWall.hasTime) endWall = { ...endWall, h: 23, mi: 59, hasTime: false };
      end = wallToMs(endWall, offset);
      if (end <= start) {
        errors.push(`Строка ${rowNo}${title ? ` («${title}»)` : ""}: конец раньше начала`);
        return;
      }
    } else if (!startWall.hasTime) {
      // Указана только дата — точка висит весь этот день
      end = wallToMs({ ...startWall, h: 23, mi: 59 }, offset);
    } else {
      end = start + opts.defaultDurationHours * 3600_000;
    }

    const link = (r.link || "").trim();
    meetups.push({
      id: `${rowNo}-${coords[0]}-${coords[1]}-${start}`,
      title: title || "Движ",
      lat: coords[0],
      lng: coords[1],
      start,
      end,
      whenLabel: whenLabel(startWall, endWall && endWall.hasTime ? endWall : null),
      address: (r.address || "").trim(),
      description: (r.description || "").trim(),
      // Только обычные веб-ссылки — защита от вредных ссылок в таблице
      link: /^https?:\/\//i.test(link) ? link : "",
    });
  });

  return { meetups, errors };
}

export function csvToMeetups(
  csv: string,
  opts: { defaultOffset: number; defaultDurationHours: number }
): ParseResult {
  const rows = parseCsv(csv);
  if (rows.length === 0) return { meetups: [], errors: [] };
  const idx = mapHeader(rows[0]);
  const missing = ["title", "coords", "start"].filter((k) => idx[k] === undefined);
  if (missing.length) {
    const names: Record<string, string> = { title: "Название", coords: "Координаты", start: "Начало" };
    return {
      meetups: [],
      errors: [`В первой строке таблицы нет столбцов: ${missing.map((k) => names[k]).join(", ")}`],
    };
  }
  const get = (r: string[], k: string) => (idx[k] === undefined ? "" : r[idx[k]] ?? "");
  const raws: RawMeetup[] = rows.slice(1).map((r) => ({
    title: get(r, "title"),
    coords: get(r, "coords"),
    start: get(r, "start"),
    end: get(r, "end"),
    tz: get(r, "tz"),
    address: get(r, "address"),
    description: get(r, "description"),
    link: get(r, "link"),
  }));
  return buildMeetups(raws, opts, 2);
}

/* ---------------- Что показывать сейчас ---------------- */

/** Только те, что ещё не закончились, по порядку: ближайшие первыми */
export function activeMeetups(all: Meetup[], now: number): Meetup[] {
  return all.filter((m) => m.end > now).sort((a, b) => a.start - b.start);
}

export function statusOf(m: Meetup, now: number): { live: boolean; text: string } {
  if (m.start <= now) {
    const left = Math.max(0, Math.round((m.end - now) / 60_000));
    return { live: true, text: left < 60 ? `Идёт сейчас · ещё ${left} мин` : "Идёт сейчас" };
  }
  const mins = Math.round((m.start - now) / 60_000);
  if (mins < 60) return { live: false, text: `Через ${Math.max(1, mins)} мин` };
  const hours = Math.round(mins / 60);
  if (hours < 24) return { live: false, text: `Через ${hours} ч` };
  const days = Math.round(hours / 24);
  const word = days % 10 === 1 && days % 100 !== 11 ? "день"
    : [2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100) ? "дня" : "дней";
  return { live: false, text: `Через ${days} ${word}` };
}
