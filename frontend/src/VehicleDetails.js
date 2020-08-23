import React, { useEffect, useRef } from 'react'
import VehicleTimetable from './VehicleTimetable'
import './VehicleDetails.css'

export default function VehicleDetails({
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

    <VehicleTimetable departures={departures} />
  </div>
}
