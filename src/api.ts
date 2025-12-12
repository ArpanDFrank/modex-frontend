const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export type Seat = {
  id: number;
  seat_number: string;
  status: 'available' | 'booked' | string;
  booking_id: number | null;
};

export type Show = { id: number; name: string; start_time: string; total_seats: number };

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, opts);
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) throw body || { error: res.statusText };
  return body;
}

export async function getShows(): Promise<Show[]> {
  return request('/shows');
}

export async function createShow(payload: { name: string; start_time: string; total_seats: number }) {
  return request('/admin/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function fetchSeats(showId: number): Promise<Seat[]> {
  return request(`/shows/${showId}/seats`);
}

export async function bookSeats(showId: number, seats: string[], customerName = 'Guest') {
  return request('/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ show_id: showId, seat_numbers: seats, customer_name: customerName }),
  });
}
