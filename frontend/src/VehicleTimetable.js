import React from 'react'
import './VehicleTimetable.css'

export default function VehicleTimetable({ departures }) {
  return <table class="departures">
    {departures.map(departure => <tr class={"departure--" + departure.status.toLowerCase()}>
      <td className="departure__time">
        {departure.time}
      </td>
      <td className="departure__status">
        <img src={process.env.PUBLIC_URL + '/stop_' + departure.status.toLowerCase() + '.svg'} alt={departure.status} className="departure__icon" />
      </td>
      <td className="departure__stop_name">
        {departure.stopName}
      </td>
    </tr>)}
  </table>
}
