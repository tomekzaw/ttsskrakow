import React, { useState, useEffect } from 'react'
import axios from 'axios'
import VehiclesMap from './VehiclesMap'
import VehicleDetails from './VehicleDetails'
import './App.css'

export default function App() {
  const [activeVehicle, setActiveVehicle] = useState()
  const [activeVehiclePolyline, setActiveVehiclePolyline] = useState()
  const [activeVehicleTimetable, setActiveVehicleTimetable] = useState()

  const [time, setTime] = useState(Date.now())
  const [vehicles, setVehicles] = useState([])
  const [stops, setStops] = useState([])

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 3000);
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    axios.get('/api/stops').then(res => setStops(res.data))
  }, [])

  useEffect(() => {
    axios.get('/api/vehicles').then(res => setVehicles(res.data))
  }, [time])

  useEffect(() => {
    if (!activeVehicle) return
    const {category, vehicleId} = activeVehicle
    const url = `/api/path?category=${category}&vehicleId=${vehicleId}`
    axios.get(url).then(res => setActiveVehiclePolyline(res.data))
  }, [activeVehicle])

  useEffect(() => {
    if (!activeVehicle) return
    const {category, tripId} = activeVehicle
    const url = `/api/timetable?category=${category}&tripId=${tripId}`
    axios.get(url).then(res => setActiveVehicleTimetable(res.data))
  }, [activeVehicle, time])

  function unselectActiveVehicle() {
    setActiveVehicle()
    setActiveVehiclePolyline()
    setActiveVehicleTimetable()
  }

  return <>
    <VehiclesMap
      stops={stops}
      vehicles={vehicles}
      setActiveVehicle={setActiveVehicle}
      unselectActiveVehicle={unselectActiveVehicle} activeVehiclePolyline={activeVehiclePolyline} />
    {activeVehicleTimetable && activeVehicleTimetable.line && <VehicleDetails activeVehicleTimetable={activeVehicleTimetable} />}
  </>
}
