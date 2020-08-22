import React, { useState, useEffect } from 'react'
import VehiclesMap from './VehiclesMap'
import VehicleTimetable from './VehicleTimetable'
import './App.css'

export default function App() {
  const [activeVehicle, setActiveVehicle] = useState()
  const [activeVehicleData, setActiveVehicleData] = useState()

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

  useEffect(() => {
    if (!activeVehicle) {
      setActiveVehicleData()
      return
    }

    const {category, vehicleId, tripId} = activeVehicle
    fetch('/api/path?category=' + category + '&vehicleId=' + vehicleId + '&tripId=' + tripId)
      .then(res => res.json())
      .then(data => setActiveVehicleData(data))
  }, [activeVehicle, time])

  return <>
    <VehiclesMap vehicles={vehicles} setActiveVehicle={setActiveVehicle} activeVehicleData={activeVehicleData} />
    {activeVehicleData && activeVehicleData.line && <VehicleTimetable activeVehicleData={activeVehicleData} />}
  </>
}
