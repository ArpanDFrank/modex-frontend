import React, { useEffect, useState } from 'react';
import SeatGrid from './components/SeatGrid';
import BookingHistory from './components/BookingHistory';
import { getShows, createShow } from './api';

export default function App(){
  const [shows, setShows] = useState<any[]>([]);
  const [selectedShow, setSelectedShow] = useState<number | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingShows, setLoadingShows] = useState(false);

  async function loadShows(){
    setLoadingShows(true);
    try {
      const s = await getShows();
      setShows(s);
      if (!selectedShow && s.length>0) setSelectedShow(s[0].id);
    } catch (e:any) { console.error(e); }
    setLoadingShows(false);
  }

  useEffect(()=>{ loadShows(); },[]);

  async function handleCreateDemoShow(){
    const now = new Date();
    const payload = { name: `Demo ${now.getFullYear()}-${now.getMonth()+1}`, start_time: now.toISOString(), total_seats: 100 };
    try {
      const res = await createShow(payload);
      await loadShows();
      setSelectedShow(res.id);
    } catch (e:any) { console.error(e); alert('Create failed'); }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Modex — Seat Booking</h1>
        <div style={{textAlign:'right'}}>
          <div className="small">Backend: <span style={{fontWeight:600}}>{process.env.REACT_APP_API_URL || 'http://localhost:4000'}</span></div>
          <div style={{marginTop:6}}><button className="small-btn" onClick={loadShows} disabled={loadingShows}>Refresh shows</button></div>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <div className="controls">
          <label className="small">Select show:</label>
          <select value={selectedShow ?? ''} onChange={e=>setSelectedShow(Number(e.target.value))}>
            {shows.map(s=> <option key={s.id} value={s.id}>{s.name} — {new Date(s.start_time).toLocaleString()}</option>)}
          </select>
          <button className="small-btn" onClick={handleCreateDemoShow} style={{marginLeft:8}}>Create demo show</button>
        </div>

        <div className="grid" style={{marginTop:12}}>
          <div>
            {selectedShow ? <SeatGrid showId={selectedShow} /> : <div className="card">No show selected</div>}
          </div>

          <aside>
            <BookingHistory bookings={bookings} />
            <div className="card" style={{marginTop:12}}>
              <h3 style={{marginTop:0}}>Tips</h3>
              <ul style={{paddingLeft:16}}>
                <li className="small">Create a show, seed seats via SQL then use the seat map to book.</li>
                <li className="small">If a seat is already booked you will get a conflict response.</li>
                <li className="small">Set REACT_APP_API_URL in .env if backend is remote.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <footer>
        <div className="small">Made for Modex assignment — frontend demo</div>
      </footer>
    </div>
  );
}
