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
    const apiUrl = 'http://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles?positionType=CORRECTED'
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => data.vehicles.map((item) => !item.isDeleted && item.latitude && item.longitude && markers.push({
        id: item.id,
        position: [item.latitude / 3600000, item.longitude / 3600000],
        icon: this.makeIcon(item.name.split(' ')[0], item.heading),
      })))
      .then(() => this.setState({markers}))
  }

  componentDidMount() {  
    this.refreshVehicles();
  }

  showPath(id) {
    const apiUrl = 'http://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/pathinfo/vehicle?id=' + id
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const newPolyline = data.paths[0].wayPoints.map((item) => [item.lat / 3600000, item.lon / 3600000])
        this.setState({polyline: newPolyline})
      });
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