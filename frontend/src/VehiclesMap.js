import React from 'react'
import { Map, TileLayer, ScaleControl } from 'react-leaflet'
import VehicleMarkers from './VehicleMarkers'
import VehiclePolyline from './VehiclePolyline'
import './VehiclesMap.css'

export default function VehiclesMap({ vehicles, setActiveVehicle, unselectActiveVehicle, activeVehiclePolyline }) {
  const center = [50.04, 19.96]
  const zoom = 12

  return <Map center={center} zoom={zoom} onClick={unselectActiveVehicle}>
    <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
    />
    <ScaleControl />
    <VehicleMarkers vehicles={vehicles} setActiveVehicle={setActiveVehicle} />
    {activeVehiclePolyline && <VehiclePolyline activeVehiclePolyline={activeVehiclePolyline} />}
  </Map>
}
