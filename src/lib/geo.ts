import type { Venue } from "./types";

export function directionsUrl(venue: Venue): string {
  // Preferimos el enlace exacto guardado en Supabase (venue.map_url).
  // Respaldo: búsqueda por dirección y ciudad, para nunca caer en coordenadas 0,0.
  if (venue.map_url) {
    return venue.map_url;
  }
  const query = `${venue.address}, ${venue.city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}