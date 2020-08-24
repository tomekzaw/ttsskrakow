import React from 'react'
import { Polyline } from 'react-leaflet'

export default function VehiclePolyline({ activeVehiclePolyline: { category, path } }) {
  const color = category === 'tram' ? 'red' : 'blue'

  return <Polyline positions={path} color={color} opacity="0.5" weight="5" />
}
