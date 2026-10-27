"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import clsx from "clsx";
import type { GalleryItem } from "@/lib/types";
import { useLang } from "./LangProvider";
import { SmartImage } from "./SmartImage";

/** Photo grid with album filter chips and a full-screen lightbox (keyboard + swipe friendly). */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const { t } = useLang();
  // "All" is an internal key; labels are translated for display only.
  // Photos saved in the old "Nursery" album belong with "Kindergarten".
  const albumOf = (i: GalleryItem) => (i.album === "Nursery" ? "Kindergarten" : i.album);
  const albums = ["All", ...Array.from(new Set(items.map(albumOf)))];
  const label = (a: string) => (a === "All" ? t.gallery.all : t.gallery.albums[a] ?? a);
  const [album, setAlbum] = useState("All");
  const [index, setIndex] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const shown = album === "All" ? items : items.filter((i) => albumOf(i) === album);

  const close = useCallback(() => {
    setIndex(null);
    lastFocus.current?.focus();
  }, []);
  const step = useCallback((d: number) => {
    setIndex((i) => (i === null ? i : (i + d + shown.length) % shown.length));
  }, [shown.length]);

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  const current = index !== null ? shown[index] : null;

  return (
    <>
      {albums.length > 2 && (
        <div role="group" aria-label={t.gallery.filter} className="mb-6 flex flex-wrap justify-center gap-2">
          {albums.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={album === a}
              onClick={() => setAlbum(a)}
              className={clsx(
                "min-h-10 rounded-full border-2 px-4 text-sm font-bold transition-colors",
                album === a ? "border-brand-green bg-brand-green text-white" : "border-brand-green/30 bg-white text-brand-green hover:bg-brand-green-soft",
              )}
            >
              {label(a)}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-center text-gray-600">{t.gallery.none}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((g, i) => (
            <li key={g.id}>
              <button
                type="button"
                className="group block w-full overflow-hidden rounded-2xl shadow-md"
                aria-label={`${t.gallery.open}${g.alt}`}
                onClick={(e) => { lastFocus.current = e.currentTarget; setIndex(i); }}
              >
                <SmartImage src={g.image_url} alt={g.alt} width={600} height={450} sizes="(min-width:1024px) 280px, (min-width:640px) 33vw, 50vw" className="aspect-[4/3] w-full object-cover object-[50%_35%] transition-transform duration-300 group-hover:scale-105" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.gallery.viewer}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3"
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
            touchX.current = null;
          }}
        >
          <button ref={closeBtn} type="button" onClick={close} aria-label={t.gallery.closeViewer} className="absolute right-3 top-3 rounded-full bg-white/15 p-3 text-white hover:bg-white/30">
            <X className="h-6 w-6" aria-hidden />
          </button>
          {shown.length > 1 && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label={t.gallery.prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-white/30">
                <ChevronLeft className="h-7 w-7" aria-hidden />
              </button>
              <button type="button" onClick={() => step(1)} aria-label={t.gallery.next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-white/30">
                <ChevronRight className="h-7 w-7" aria-hidden />
              </button>
            </>
          )}
          <figure className="max-h-full max-w-5xl">
            <SmartImage src={current.image_url} alt={current.alt} width={1600} height={1200} sizes="100vw" className="max-h-[80dvh] w-auto rounded-xl object-contain" />
            <figcaption className="mt-2 text-center text-sm text-white/85">
              {label(albumOf(current))} · {index! + 1} / {shown.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
