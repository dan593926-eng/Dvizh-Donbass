import { motion } from "framer-motion";
import { Clock, ExternalLink, MapPin, Move, Navigation } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { manualMeetups, meetupsConfig } from "@/config/meetups";
import { socialLinks } from "@/config/siteData";
import { SectionHeading } from "@/components/SectionHeading";
import { activeMeetups, buildMeetups, csvToMeetups, statusOf, type Meetup } from "@/lib/meetups";
import { useIsTouchDevice } from "@/hooks/usePointerType";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeUp } from "@/animations/variants";
import "@/styles/map.css";

const OPTS = {
  defaultOffset: meetupsConfig.defaultTimezone,
  defaultDurationHours: meetupsConfig.defaultDurationHours,
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function directionsUrl(m: Meetup) {
  return `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;
}

function popupHtml(m: Meetup): string {
  return [
    `<h4>${escapeHtml(m.title)}</h4>`,
    `<div class="when">${escapeHtml(m.whenLabel)}</div>`,
    m.address ? `<div class="addr">${escapeHtml(m.address)}</div>` : "",
    m.description ? `<p>${escapeHtml(m.description)}</p>` : "",
    `<p><a href="${directionsUrl(m)}" target="_blank" rel="noreferrer noopener">Маршрут</a>`,
    m.link ? ` · <a href="${escapeHtml(m.link)}" target="_blank" rel="noreferrer noopener">Подробнее</a>` : "",
    `</p>`,
  ].join("");
}

/* =====================================================================
   Карта (Leaflet + OpenStreetMap). Библиотека подгружается только когда
   посетитель долистал до карты — на скорость остального сайта не влияет.
   ===================================================================== */

type Focus = { id: string; n: number } | null;

function LeafletMap({ meetups, now, focus }: { meetups: Meetup[]; now: number; focus: Focus }) {
  const boxRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layer = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markers = useRef<Map<string, any>>(new Map());
  const lastFitKey = useRef("");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();

  // 1. Ленивая загрузка карты при приближении к ней
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    let destroyed = false;

    const init = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [mod] = await Promise.all([import("leaflet") as Promise<any>, import("leaflet/dist/leaflet.css")]);
        if (destroyed || !boxRef.current) return;
        const Lf = mod.default ?? mod;
        L.current = Lf;
        const touch = window.matchMedia("(pointer: coarse)").matches;
        const m = Lf.map(boxRef.current, {
          center: meetupsConfig.mapCenter,
          zoom: meetupsConfig.mapZoom,
          scrollWheelZoom: false, // колесо мыши не «угоняет» прокрутку страницы
          dragging: !touch, // на телефоне пальцем листается страница, пока карту не «включили»
          touchZoom: !touch,
          worldCopyJump: true,
        });
        // Подложка OpenStreetMap: бесплатно и без ключа. Тёмной её делает фильтр в map.css
        Lf.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
        }).addTo(m);
        // Клик по карте включает зум колесом, уход мыши — выключает
        m.on("click", () => m.scrollWheelZoom.enable());
        m.on("mouseout", () => m.scrollWheelZoom.disable());
        layer.current = Lf.layerGroup().addTo(m);
        map.current = m;
        setReady(true);
      } catch {
        if (!destroyed) setFailed(true);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          init();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);

    return () => {
      destroyed = true;
      io.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // 2. Точки. Перестраиваются, только когда меняется список или «идёт сейчас»
  const markersKey = meetups.map((m) => `${m.id}:${m.start <= now ? 1 : 0}`).join("|");
  useEffect(() => {
    if (!ready || !L.current || !layer.current) return;
    const Lf = L.current;
    layer.current.clearLayers();
    markers.current.clear();
    for (const m of meetups) {
      const live = m.start <= now;
      const icon = Lf.divIcon({
        className: "meetup-pin-wrap",
        html: `<span class="meetup-pin${live ? " is-live" : ""}"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -12],
      });
      const marker = Lf.marker([m.lat, m.lng], { icon, title: m.title, keyboard: true })
        .bindPopup(popupHtml(m), { className: "meetup-popup", maxWidth: 260 });
      layer.current.addLayer(marker);
      markers.current.set(m.id, marker);
    }
    // Подгоняем масштаб, только если набор точек изменился
    const fitKey = meetups.map((m) => m.id).join("|");
    if (fitKey !== lastFitKey.current) {
      lastFitKey.current = fitKey;
      if (meetups.length === 1) map.current.setView([meetups[0].lat, meetups[0].lng], 13);
      else if (meetups.length > 1)
        map.current.fitBounds(Lf.latLngBounds(meetups.map((m) => [m.lat, m.lng])), { padding: [40, 40], maxZoom: 13 });
      else map.current.setView(meetupsConfig.mapCenter, meetupsConfig.mapZoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, markersKey]);

  // 3. «Показать на карте» из списка
  useEffect(() => {
    if (!ready || !focus) return;
    const marker = markers.current.get(focus.id);
    if (!marker) return;
    const target = marker.getLatLng();
    if (reducedMotion) map.current.setView(target, 15);
    else map.current.flyTo(target, 15, { duration: 0.8 });
    marker.openPopup();
  }, [ready, focus, reducedMotion]);

  const unlock = () => {
    map.current?.dragging.enable();
    map.current?.touchZoom.enable();
    setUnlocked(true);
  };

  return (
    // isolate + z-0: внутренние слои Leaflet (z-index до 1000) не вылезают поверх шапки и меню
    <div className="meetup-map relative isolate z-0 h-[380px] overflow-hidden rounded-lg border border-white/10 bg-black sm:h-[480px] lg:h-full lg:min-h-[520px]">
      <div ref={boxRef} className="absolute inset-0" aria-label="Карта сходок" role="region" />
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-fog">
          Карта не загрузилась. Проверьте интернет и обновите страницу.
        </div>
      )}
      {ready && meetups.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-[1000] flex justify-center px-4">
          <span className="rounded-full bg-black/80 px-4 py-2 text-xs text-fog">Сейчас сходок нет</span>
        </div>
      )}
      {ready && isTouch && !unlocked && (
        <button
          type="button"
          onClick={unlock}
          className="absolute bottom-3 left-1/2 z-[1000] flex min-h-[44px] -translate-x-1/2 items-center gap-2 rounded-full bg-gold px-4 text-sm font-semibold text-black shadow-lg"
        >
          <Move size={16} aria-hidden="true" />
          Двигать карту
        </button>
      )}
    </div>
  );
}

/* =====================================================================
   Секция: карта + список ближайших сходок
   ===================================================================== */

export function MeetupMap() {
  const sheetUrl = meetupsConfig.sheetCsvUrl.trim();
  const manual = useMemo(() => buildMeetups(manualMeetups, OPTS, 1), []);
  const [fromSheet, setFromSheet] = useState<Meetup[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(!sheetUrl);
  const [loadFailed, setLoadFailed] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [focus, setFocus] = useState<Focus>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const debug = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("proverka");

  // Часы: раз в 30 секунд пересчитываем, что уже закончилось — точки исчезают сами
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Таблица: загрузка при открытии и обновление раз в 5 минут, пока вкладка открыта
  useEffect(() => {
    if (!sheetUrl) return;
    let cancelled = false;
    const load = async () => {
      try {
        const sep = sheetUrl.includes("?") ? "&" : "?";
        const res = await fetch(`${sheetUrl}${sep}_=${Math.floor(Date.now() / 60_000)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const text = await res.text();
        if (/<html/i.test(text.slice(0, 300))) throw new Error("не CSV");
        const r = csvToMeetups(text, OPTS);
        if (cancelled) return;
        setFromSheet(r.meetups);
        setErrors(r.errors);
        setLoadFailed(false);
      } catch {
        if (!cancelled) setLoadFailed(true);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    load();
    const id = window.setInterval(() => {
      if (!document.hidden) load();
    }, 5 * 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [sheetUrl]);

  const all = useMemo(() => [...manual.meetups, ...fromSheet], [manual, fromSheet]);
  const active = useMemo(() => activeMeetups(all, now), [all, now]);
  const allErrors = [...manual.errors, ...errors];
  const telegram = socialLinks.find((l) => l.type === "telegram");

  const showOnMap = (id: string) => {
    setFocus({ id, n: Date.now() });
    // На телефоне карта выше списка — прокручиваем к ней
    if (window.matchMedia("(max-width: 1023px)").matches) {
      mapBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section id="map" className="bg-black px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={meetupsConfig.heading} subtitle={meetupsConfig.subtitle} />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Список ближайших сходок */}
          <div className="order-2 flex flex-col gap-3 lg:order-1">
            {!loaded && <p className="text-sm text-fog">Загружаю сходки…</p>}

            {loaded && active.length === 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                className="rounded-lg border border-white/10 bg-graphite p-6"
              >
                <MapPin className="mb-3 text-gold" size={22} aria-hidden="true" />
                <p className="text-sm text-fog sm:text-base">{meetupsConfig.emptyText}</p>
                {telegram && (
                  <a
                    href={telegram.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="hover"
                    className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-gold hover:text-gold-bright"
                  >
                    <ExternalLink size={16} aria-hidden="true" />
                    Анонсы в Telegram
                  </a>
                )}
              </motion.div>
            )}

            {active.map((m) => {
              const st = statusOf(m, now);
              return (
                <article
                  key={m.id}
                  className={`rounded-lg border bg-graphite p-5 ${st.live ? "border-gold/60" : "border-white/10"}`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      st.live ? "bg-gold text-black" : "bg-white/5 text-fog"
                    }`}
                  >
                    {st.live && <span className="h-1.5 w-1.5 rounded-full bg-black" aria-hidden="true" />}
                    {st.text}
                  </span>
                  <h3 className="font-display mt-3 text-xl font-semibold uppercase leading-tight text-bone sm:text-2xl">
                    {m.title}
                  </h3>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gold">
                    <Clock size={15} aria-hidden="true" />
                    {m.whenLabel}
                  </p>
                  {m.address && <p className="mt-1 text-sm text-fog">{m.address}</p>}
                  {m.description && <p className="mt-2 text-sm leading-relaxed text-fog">{m.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => showOnMap(m.id)}
                      data-cursor="hover"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 px-4 text-sm text-bone hover:border-gold hover:text-gold"
                    >
                      <MapPin size={15} aria-hidden="true" />
                      На карте
                    </button>
                    <a
                      href={directionsUrl(m)}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor="hover"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 px-4 text-sm text-bone hover:border-gold hover:text-gold"
                    >
                      <Navigation size={15} aria-hidden="true" />
                      Маршрут
                    </a>
                    {m.link && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        data-cursor="hover"
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 px-4 text-sm text-bone hover:border-gold hover:text-gold"
                      >
                        <ExternalLink size={15} aria-hidden="true" />
                        Подробнее
                      </a>
                    )}
                  </div>
                </article>
              );
            })}

            {/* Режим проверки таблицы: откройте сайт с ?proverka в конце адреса */}
            {debug && (
              <div className="rounded-lg border border-dashed border-white/20 p-4 text-xs text-fog">
                <p className="font-semibold text-bone">Проверка таблицы</p>
                <p className="mt-1">
                  Таблица: {sheetUrl ? (loadFailed ? "не загрузилась — проверьте ссылку" : "загружена") : "не подключена"} ·
                  всего строк-сходок: {all.length} · показано сейчас: {active.length}
                </p>
                {allErrors.length > 0 ? (
                  <ul className="mt-2 list-disc pl-4">
                    {allErrors.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1">Ошибок в таблице нет.</p>
                )}
              </div>
            )}
          </div>

          {/* Карта */}
          <div ref={mapBoxRef} className="order-1 lg:order-2">
            <LeafletMap meetups={active} now={now} focus={focus} />
          </div>
        </div>
      </div>
    </section>
  );
}
