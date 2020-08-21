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

  makeIcon(label, heading) {
    return new L.divIcon({
      html: ReactDOMServer.renderToStaticMarkup(
        <div className="vehicle vehicle_T" style={{transform: 'rotate(' + heading + 'deg'}}>
          <div style={{transform: 'rotate(' + -heading + 'deg'}}>
            {label}
          </div>
        </div>
      ),
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  refreshVehicles() {
    const {markers} = this.state;
    const apiUrl = '/api/vehicles'
    fetch(apiUrl)
      .then(res => res.json())
      .then(vehicles => vehicles.map(item => markers.push({
        id: item.id,
        position: [item.latitude, item.longitude],
        icon: this.makeIcon(item.line, item.heading),
      })))
      .then(() => this.setState({markers}))
  }

  componentDidMount() {  
    this.refreshVehicles();
  }

  showPath(id) {
    const apiUrl = '/api/path?id=' + id
    fetch(apiUrl)
      .then(res => res.json())
      .then(points => this.setState({polyline: points}));
  }

  hidePath() {
    this.setState({polyline: null})
  }

  render() {
    const position = [this.state.lat, this.state.lng]

    return <Map center={position} zoom={this.state.zoom} onClick={() => this.hidePath()}>
      <TileLayer
        attribution='Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
      />
      <ScaleControl />
      {this.state.markers.map(({id, position, icon}, idx) => 
          <Marker key={id} position={position} icon={icon} onClick={() => this.showPath(id)}/>
      )}
      {this.state.polyline && <Polyline positions={this.state.polyline} color="red" opacity="0.5" weight="5" />}      
    </Map>
  }
}