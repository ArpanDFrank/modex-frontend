import React from 'react';

export default function BookingHistory({ bookings }: { bookings?: any[] }) {
  if (!bookings || bookings.length === 0) return <div className="card small">No bookings yet</div>;
  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Recent bookings</h3>
      <ul style={{paddingLeft:16, margin:0}}>
        {bookings.slice(0,8).map((b:any)=>(
          <li key={b.id} className="small" style={{marginBottom:6}}>
            <strong>#{b.id}</strong> Show {b.show_id} — {Array.isArray(b.seats)? b.seats.join(', '):JSON.stringify(b.seats)} <span style={{color:'#777'}}>({new Date(b.created_at).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
