import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server';
import { Map, TileLayer, Marker, ScaleControl, Polyline } from 'react-leaflet'
import L from 'leaflet'
import './App.css'

export default class App extends Component {
  state = {
    lat: 50.06, 
    lng: 19.94,
    zoom: 12,
    markers: [],
    polyline: null,
  }

  makeIcon(category, label, heading) {
    var elem;
    if (category === 'tram') {
      elem = <div className="vehicle vehicle_tram" style={{transform: 'rotate(' + heading + 'deg'}}>
        <div style={{transform: 'rotate(' + -heading + 'deg'}}>{label}</div>
      </div>;
    } else {
      elem = <div className="vehicle vehicle_bus">{label}</div>
    }

    return new L.divIcon({
      html: ReactDOMServer.renderToStaticMarkup(elem),
      className: '',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
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

  showPath(category, id) {
    this.setState({polyline: null})
    const apiUrl = '/api/path?category=' + category + '&id=' + id
    fetch(apiUrl)
      .then(res => res.json())
      .then(positions => this.setState({
        polyline: {
          positions: positions,
          color: category === 'tram' ? 'red' : 'blue'
        }
      }))
  }

  hidePath() {
    this.setState({polyline: null})
  }

  render() {
    const position = [this.state.lat, this.state.lng]

    return <Map center={position} zoom={this.state.zoom} onClick={() => this.hidePath()}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />
      <ScaleControl />
      {this.state.markers.map(({category, id, position, icon}, idx) => 
          <Marker key={id} position={position} icon={icon} onClick={() => this.showPath(category, id)}/>
      )}
      {this.state.polyline && <Polyline positions={this.state.polyline.positions} color={this.state.polyline.color} opacity="0.5" weight="5" />}      
    </Map>
  }
}