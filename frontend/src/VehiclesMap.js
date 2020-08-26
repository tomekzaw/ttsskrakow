import React, { useMemo } from 'react'
import { Map, TileLayer, ScaleControl } from 'react-leaflet'
import StopMarkers from './StopMarkers'
import VehicleMarkers from './VehicleMarkers'
import VehiclePolyline from './VehiclePolyline'
import './VehiclesMap.css'

export default function VehiclesMap({ stops, vehicles, setActiveVehicle, unselectActiveVehicle, activeVehiclePolyline }) {
  const center = [50.04, 19.96]
  const zoom = 12

  const stopMarkers = useMemo(() => {
    return <StopMarkers stops={stops} />
  }, [stops])

  const vehicleMarkers = useMemo(() => {
    return <VehicleMarkers vehicles={vehicles} setActiveVehicle={setActiveVehicle} />
  }, [vehicles, setActiveVehicle])

  return <Map center={center} zoom={zoom} onClick={unselectActiveVehicle}>
    <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
    />
    <ScaleControl />
    {/* {stopMarkers} */}
    {vehicleMarkers}
    {activeVehiclePolyline && <VehiclePolyline activeVehiclePolyline={activeVehiclePolyline} />}
  </Map>
}
