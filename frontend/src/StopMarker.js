import React from 'react'
import { Marker } from 'react-leaflet'

export default function StopMarker({ stop: {latitude, longitude} }) {
  return <Marker position={[latitude, longitude]} />
}
