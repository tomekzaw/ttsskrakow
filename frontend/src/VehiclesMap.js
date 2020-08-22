import React from 'react'
import { Map, TileLayer, ScaleControl } from 'react-leaflet'
import VehicleMarkers from './VehicleMarkers.js'
import ActiveVehiclePolyline from './ActiveVehiclePolyline.js'
import './VehiclesMap.css'

export default function VehiclesMap({ vehicles, setActiveVehicle, activeVehicleData }) {
  const position = [50.04, 19.96]
  const zoom = 12

  function handleClick() {
    setActiveVehicle()
  }

  return <Map center={position} zoom={zoom} onClick={handleClick}>
    <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
    />
    <ScaleControl />
    <VehicleMarkers vehicles={vehicles} setActiveVehicle={setActiveVehicle} />
    {activeVehicleData && <ActiveVehiclePolyline activeVehicleData={activeVehicleData} />}
  </Map>
}
