import React from 'react'
import VehicleMarker from './VehicleMarker'

export default function VehicleMarkers({ vehicles, setActiveVehicle }) {
  return vehicles.map(vehicle => <VehicleMarker key={vehicle.vehicleId} vehicle={vehicle} setActiveVehicle={setActiveVehicle} />)
}
