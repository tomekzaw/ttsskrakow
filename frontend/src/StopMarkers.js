import React from 'react'
import StopMarker from './StopMarker'

export default function StopMarkers({ stops }) {
  return stops.map(stop => <StopMarker key={stop.name} stop={stop} />)
}
