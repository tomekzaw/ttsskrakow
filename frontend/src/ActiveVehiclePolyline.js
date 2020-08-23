import React from 'react'
import { Polyline } from 'react-leaflet'

export default function ActiveVehiclePolyline({ activeVehiclePolyline: { path, color } }) {
  return <Polyline positions={path} color={color} opacity="0.5" weight="5" />
}
