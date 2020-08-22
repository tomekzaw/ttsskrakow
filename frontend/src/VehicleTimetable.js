import React, { useEffect, useRef } from 'react'
import './VehicleTimetable.css'

export default function VehicleTimetable({
  activeVehicleData,
  activeVehicleData: {category, line, direction, departures}
}) {
  const detailsRef = useRef()

  useEffect(() => detailsRef.current.scrollTo(0, 0), [activeVehicleData])

  return <div className="details" ref={detailsRef}>
    <table class="line_direction">
      <tr>
        <td>
          <span className={"line line--" + category}>{line}</span>
        </td>
        <td className="direction">
          {direction}
        </td>
      </tr>
    </table>

    <table class="departures">
      {departures.map(departure => <tr class={"departure--" + departure.status.toLowerCase()}>
        <td className="departure__time">
          {departure.status === "STOPPING" ? ">>>" : departure.time}
        </td>
        <td className="departure__status">
          <img src={process.env.PUBLIC_URL + '/stop_' + departure.status.toLowerCase() + '.svg'} alt={departure.status} className="departure__icon" />
        </td>
        <td className="departure__stop_name">
          {departure.stopName}
        </td>
      </tr>)}
    </table>
  </div>
}
