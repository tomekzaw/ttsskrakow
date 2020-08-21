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
      .then(vehicles => vehicles.map(item => ({
        category: item.category,
        id: item.id,
        position: [item.latitude, item.longitude],
        icon: this.makeIcon(item.category, item.line, item.heading),
      })))
      .then(markers => this.setState({markers: markers}))
  }

  componentDidMount() {  
    this.refreshLoop();
  }

  refreshLoop() {
    this.refreshVehicles();
    setTimeout(() => this.refreshLoop(), 5000);
  }

  selectVehicle(category, id) {
    this.setState({polyline: null})
    const apiUrl = '/api/path?category=' + category + '&id=' + id
    fetch(apiUrl)
      .then(res => res.json())
      .then(path => this.setState({
        activeVehicle: {
          path: path,
          color: category === 'tram' ? 'red' : 'blue'
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
        {this.state.markers.map(({category, id, position, icon}, idx) => 
          <Marker key={id} position={position} icon={icon} onClick={() => this.selectVehicle(category, id)} />
        )}
        {this.state.activeVehicle && <Polyline positions={this.state.activeVehicle.path} color={this.state.activeVehicle.color} opacity="0.5" weight="5" />}      
      </Map>
    </>
  }
}