import React from 'react'
import ReactDOMServer from 'react-dom/server';
import { Marker } from 'react-leaflet'
import L from 'leaflet'
import './VehicleMarker.css'

const iconSize = 50

export default function VehicleMarker({
  vehicle: {category, vehicleId, tripId, latitude, longitude, heading, line},
  setActiveVehicle
}) {
  const src = category === 'tram' ? '/triangle_T.svg' : '/triangle_A.svg'

  const elem = <div className="vehicle">
    <img src={process.env.PUBLIC_URL + src} alt="" className="vehicle__triangle" style={{width: iconSize, transform: 'rotate(' + heading + 'deg)'}} />
    <div className="vehicle__label">{line}</div>
  </div>

  const icon = new L.divIcon({
    html: ReactDOMServer.renderToStaticMarkup(elem),
    className: null,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  })

  function handleClick() {
    setActiveVehicle({category, vehicleId, tripId})
  }

  return <Marker position={[latitude, longitude]} icon={icon} onClick={handleClick} />
}
