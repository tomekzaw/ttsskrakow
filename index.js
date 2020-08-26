const express = require('express')
const path = require('path')
const axios = require('axios');

const app = express()

app.use(express.static(path.join(__dirname, 'frontend/build')))

function parseStopsJson(data) {
  return data.stops.map(stop => ({
    name: stop.name,
    latitude: stop.latitude / 3_600_000,
    longitude: stop.longitude / 3_600_000,
  }))
}

function parseVehiclesJson(data, category) {
  return data.vehicles
    .filter(vehicle => !vehicle.isDeleted && vehicle.latitude && vehicle.longitude)
    .map(vehicle => ({
      vehicleId: vehicle.id,
      tripId: vehicle.tripId,
      latitude: vehicle.latitude / 3_600_000,
      longitude: vehicle.longitude / 3_600_000,
      heading: vehicle.heading,
      category: category,
      line: vehicle.name.split(' ', 1),
    }))
}

app.get('/api/stops', async (req, res) => {
  const endpoint = '/internetservice/geoserviceDispatcher/services/stopinfo/stops?left=-648000000&right=648000000&top=324000000&bottom=-324000000'
  const url_A = 'http://91.223.13.70' + endpoint
  const url_T = 'http://www.ttss.krakow.pl' + endpoint

  const [response_T, response_A] = await axios.all([axios.get(url_T), axios.get(url_A)])

  const stops_T = parseStopsJson(response_T.data)
  const stops_A = parseStopsJson(response_A.data)
  const stops = stops_T.concat(stops_A)

  res.send(stops)
})

app.get('/api/vehicles', async (req, res) => {
  const url_A = 'http://91.223.13.70/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles?positionType=CORRECTED'
  const url_T = 'http://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles?positionType=CORRECTED'

  const [response_T, response_A] = await axios.all([axios.get(url_T), axios.get(url_A)])

  const vehicles_T = parseVehiclesJson(response_T.data, 'tram')
  const vehicles_A = parseVehiclesJson(response_A.data, 'bus')
  const vehicles = vehicles_T.concat(vehicles_A)

  res.send(vehicles)
})

app.get('/api/path', async (req, res) => {
  const {category, vehicleId} = req.query

  const baseUrl = category === 'tram' ? 'http://www.ttss.krakow.pl' : 'http://91.223.13.70'
  const url = `${baseUrl}/internetservice/geoserviceDispatcher/services/pathinfo/vehicle?id=${vehicleId}`

  const response = await axios.get(url)

  const path = response.data.paths[0].wayPoints.map(point => [point.lat / 3_600_000, point.lon / 3_600_000])

  res.send({ category, path })
})

app.get('/api/timetable', async (req, res) => {
  const {category, tripId} = req.query

  const baseUrl = category === 'tram' ? 'http://www.ttss.krakow.pl' : 'http://91.223.13.70'
  const url = `${baseUrl}/internetservice/services/tripInfo/tripPassages?tripId=${tripId}`

  const response = await axios.get(url)

  const line = response.data.routeName
  const direction = response.data.directionText
  const departures = response.data.old
    .concat(response.data.actual)
    .map(item => ({
      time: item.actualTime,
      stopName: item.stop.name,
      status: item.status,
    }))

  res.send({ category, line, direction, departures })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)
