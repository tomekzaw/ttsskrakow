import React, { useState, useEffect } from 'react'
import axios from 'axios'
import VehiclesMap from './VehiclesMap'
import VehicleDetails from './VehicleDetails'
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
    axios.get('/api/vehicles').then(res => setVehicles(res.data))
  }, [time])

  useEffect(() => {
    if (!activeVehicle) {
      setActiveVehicleData()
      return
    }

    const {category, vehicleId, tripId} = activeVehicle
    axios.get(`/api/path?category=${category}&vehicleId=${vehicleId}&tripId=${tripId}`)
      .then(res => setActiveVehicleData(res.data))
  }, [activeVehicle, time])

  return <>
    <VehiclesMap vehicles={vehicles} setActiveVehicle={setActiveVehicle} activeVehicleData={activeVehicleData} />
    {activeVehicleData && activeVehicleData.line && <VehicleDetails activeVehicleData={activeVehicleData} />}
  </>
}
