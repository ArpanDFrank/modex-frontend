import React, { useEffect, useState } from 'react';
import { fetchSeats, bookSeats, Seat } from '../api';
import './SeatGrid.css';

export default function SeatGrid({ showId }: { showId: number }) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setMsg(null);
    try {
      const s = await fetchSeats(showId);
      setSeats(s);
    } catch (e: any) {
      setMsg(e?.error || e?.message || 'Failed to load seats');
    }
  }

  useEffect(() => { load(); }, [showId]);

  function toggle(seatNo: string) {
    setMsg(null);
    setSelected(prev => prev.includes(seatNo) ? prev.filter(x => x !== seatNo) : [...prev, seatNo]);
  }

  async function handleBook() {
    if (selected.length === 0) { setMsg('Select seats first'); return; }
    setLoading(true); setMsg(null);
    try {
      const res: any = await bookSeats(showId, selected, 'Arpan');
      setMsg(`Booked ${res.seats.join(', ')} (id ${res.booking_id})`);
      setSelected([]);
      await load();
    } catch (err: any) {
      if (err && err.seats) setMsg(`Failed: ${err.error}. Taken: ${err.seats.join(', ')}`);
      else setMsg(err?.error || JSON.stringify(err));
    } finally { setLoading(false); }
  }

  // group rows of 10
  const perRow = 10;
  const rows: Seat[][] = [];
  for (let i = 0; i < seats.length; i += perRow) rows.push(seats.slice(i, i + perRow));

  return (
    <div className="card seat-grid-wrap">
      <div className="small">Seat map (click available seats)</div>
      <div className="legend" style={{marginTop:8}}>
        <div className="item"><span className="sw avail"></span> Available</div>
        <div className="item"><span className="sw sel"></span> Selected</div>
        <div className="item"><span className="sw book"></span> Booked</div>
      </div>

      <div className="seat-grid">
        {rows.map((row, i) => (
          <div className="row" key={i}>
            {row.map(s => {
              const disabled = s.status !== 'available';
              const isSelected = selected.includes(s.seat_number);
              const cls = disabled ? 'booked' : isSelected ? 'selected' : 'available';
              return (
                <button
                  key={s.seat_number}
                  className={`seat ${cls}`}
                  onClick={() => !disabled && toggle(s.seat_number)}
                  disabled={disabled}
                  title={disabled ? `Booked (id ${s.booking_id})` : 'Click to select'}
                >
                  {s.seat_number}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="controls-row" style={{marginTop:12}}>
        <div className="small">Selected: {selected.join(', ') || '—'}</div>
        <button className="small-btn" onClick={handleBook} disabled={loading || selected.length===0}>
          {loading ? 'Booking...' : `Book ${selected.length} seat(s)`}
        </button>
        <button className="small-btn" onClick={load} disabled={loading}>Refresh</button>
      </div>

      {msg && <div style={{marginTop:10,color:'#333'}}>{msg}</div>}
    </div>
  );
}
