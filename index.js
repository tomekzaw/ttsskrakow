const express = require('express')
const path = require('path')
const request = require('request')

const app = express()

app.use(express.static(path.join(__dirname, 'frontend/build')))

app.get('/api/vehicles', (req, res) => {
  const url = 'http://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles?positionType=CORRECTED';
  request(url, {json: true}, (err, response, body) => {
    const vehicles = body.vehicles
      .filter(vehicle => !vehicle.isDeleted && vehicle.latitude && vehicle.longitude)
      .map(vehicle => ({
        id: vehicle.id,
        latitude: vehicle.latitude / 3_600_000,
        longitude: vehicle.longitude / 3_600_000,
        heading: vehicle.heading,
        category: 'tram',
        line: vehicle.name.split(' ')[0],
      }))
    res.send(vehicles)
  })
})

app.get('/api/path', (req, res) => {
  var id = req.query.id;
  const url = 'http://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/pathinfo/vehicle?id=' + id
  request(url, {json: true}, (err, response, body) => {
    const points = body.paths[0].wayPoints.map(point => [point.lat / 3_600_000, point.lon / 3_600_000])
    res.send(points)
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)
