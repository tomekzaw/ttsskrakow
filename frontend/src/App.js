import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server';
import { Map, TileLayer, Marker, ScaleControl, Polyline } from 'react-leaflet'
import L from 'leaflet'
import './App.css'

const triangle_T = require('./triangle_T.svg')
const triangle_A = require('./triangle_A.svg')

export default class App extends Component {
  state = {
    lat: 50.06, 
    lng: 19.94,
    zoom: 12,
    markers: [],
    polyline: null,
  }

  makeIcon(category, label, heading) {
    const elem = <div class="vehicle">
      <img src={category === 'tram' ? triangle_T : triangle_A} alt=""
        className="vehicle__triangle"
        style={{width: 50, transform: 'rotate(' + heading + 'deg)'}} />
      <div className="vehicle__label">{label}</div>
    </div>

    return new L.divIcon({
      html: ReactDOMServer.renderToStaticMarkup(elem),
      className: '',
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    })
  }

  refreshVehicles() {
    const apiUrl = '/api/vehicles'
    fetch(apiUrl)
      .then(res => res.json())
      .then(markers => this.setState({markers: markers}))
  }

  componentDidMount() {  
    this.refreshLoop();
  }

  refreshLoop() {
    this.refreshVehicles();
    setTimeout(() => this.refreshLoop(), 5000);
  }

  selectVehicle(category, vehicleId, tripId) {
    const apiUrl = '/api/path?category=' + category + '&vehicleId=' + vehicleId + '&tripId=' + tripId
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => this.setState({
        activeVehicle: {
          category: category,
          line: data.line,
          direction: data.direction,
          departures: data.departures,
          path: data.path,
        }
      }))
  }

  unselectVehicle() {
    this.setState({activeVehicle: null})
  }

  render() {
    const position = [this.state.lat, this.state.lng]

    return <>
      <Map center={position} zoom={this.state.zoom} onClick={() => this.unselectVehicle()}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        <ScaleControl />
        {this.state.markers.map(({category, vehicleId, tripId, latitude, longitude, heading, line}, idx) => 
          <Marker key={vehicleId} position={new L.LatLng(latitude, longitude)} icon={this.makeIcon(category, line, heading)}
            onClick={() => this.selectVehicle(category, vehicleId, tripId)} />
        )}
        {this.state.activeVehicle && <Polyline positions={this.state.activeVehicle.path}
          color={this.state.activeVehicle.category === 'tram' ? 'red' : 'blue'} opacity="0.5" weight="5" />}      
      </Map>
      {(this.state.activeVehicle?.line || this.state.activeVehicle?.direction) && <aside class="right">
        <table class="line_direction">
          <tr>
            <td>
              <span className={"line line--" + this.state.activeVehicle.category}>{this.state.activeVehicle.line}</span>
            </td>
            <td className="direction">
              {this.state.activeVehicle.direction}
            </td>
          </tr>
        </table>

        <table class="departures">
          {this.state.activeVehicle.departures.map(departure => <tr class={"departure--" + departure.status.toLowerCase()}>
            <td className="departure__time">
              {departure.status === "STOPPING" ? ">>>" : departure.time}
            </td>
            <td className="departure__status">
              <img src={require('./stop_' + departure.status.toLowerCase() + '.svg')} alt={departure.status} className="departure__icon" />
            </td>
            <td className="departure__stop_name">
              {departure.status === 'DEPARTED' ? <s>{departure.stopName}</s> : departure.stopName}
            </td>
          </tr>)}
        </table>
      </aside>}
    </>
  }
}