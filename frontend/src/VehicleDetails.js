import React, { useEffect, useRef } from 'react'
import VehicleTimetable from './VehicleTimetable'
import './VehicleDetails.css'

export default function VehicleDetails({
  activeVehicleTimetable,
  activeVehicleTimetable: {category, line, direction, departures}
}) {
  const detailsRef = useRef()

  useEffect(() => detailsRef.current.scrollTo(0, 0), [activeVehicleTimetable])

  return <div className="details" ref={detailsRef}>
    <table className="line_direction">
      <tbody>
        <tr>
          <td>
            <span className={"line line--" + category}>{line}</span>
          </td>
          <td className="direction">
            {direction}
          </td>
        </tr>
      </tbody>
    </table>

    <VehicleTimetable departures={departures} />
  </div>
}
