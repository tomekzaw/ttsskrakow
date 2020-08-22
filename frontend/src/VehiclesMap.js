import React, { useState, useEffect } from 'react'
import { Map, TileLayer, ScaleControl } from 'react-leaflet'
import VehicleMarkers from './VehicleMarkers.js'
import ActiveVehiclePolyline from './ActiveVehiclePolyline.js'
import './VehiclesMap.css'

export default function VehiclesMap({ setActiveVehicle, activeVehicleData }) {
  const position = [50.04, 19.96]
  const zoom = 12

  const [time, setTime] = useState(Date.now())
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 3000);
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(setVehicles)
  }, [time])

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
