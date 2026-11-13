"use client";

import { useEffect, useState } from "react";
import { SmartImage } from "../SmartImage";

type Photo = { id: string; image_url: string; alt: string };

const SHOWN = 6; // photos on the home page
const PINNED = 2; // the newest uploads that are always shown

/** The newest photos always appear; the rest are picked at random from the whole gallery on every visit. */
function pick(pool: Photo[]): Photo[] {
  if (pool.length <= SHOWN) return pool;
  const rest = pool.slice(PINNED);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [...pool.slice(0, PINNED), ...rest.slice(0, SHOWN - PINNED)];
}

/**
 * `pool` is newest first. The server renders the newest six (so the page works without scripts and is cached);
 * once the browser has loaded, the random mix is chosen, so each refresh can show different pictures.
 */
export function GalleryShowcase({ pool }: { pool: Photo[] }) {
  const [shown, setShown] = useState(() => pool.slice(0, SHOWN));
  useEffect(() => {
    if (pool.length > SHOWN) setShown(pick(pool));
  }, [pool]);

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {shown.map((g) => (
        <li key={g.id} className="group overflow-hidden rounded-2xl shadow-md">
          <SmartImage src={g.image_url} alt={g.alt} width={400} height={300} sizes="(min-width:1024px) 170px, (min-width:640px) 30vw, 46vw" className="aspect-[4/3] w-full object-cover object-[50%_35%] transition-transform duration-500 group-hover:scale-105" />
        </li>
      ))}
    </ul>
  );
}
