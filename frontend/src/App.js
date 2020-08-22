import React, { useState, useEffect } from 'react'
import VehiclesMap from './VehiclesMap'
import VehicleTimetable from './VehicleTimetable'
import './App.css'

export default function App() {
  const [activeVehicle, setActiveVehicle] = useState()
  const [activeVehicleData, setActiveVehicleData] = useState()

  useEffect(() => {
    if (!activeVehicle) {
      setActiveVehicleData()
      return
    }

    const {category, vehicleId, tripId} = activeVehicle
    fetch('/api/path?category=' + category + '&vehicleId=' + vehicleId + '&tripId=' + tripId)
      .then(res => res.json())
      .then(data => setActiveVehicleData(data))
  }, [activeVehicle])

  return <>
    <VehiclesMap setActiveVehicle={setActiveVehicle} activeVehicleData={activeVehicleData} />
    {activeVehicle && <VehicleTimetable activeVehicleData={activeVehicleData} />}
  </>
}
