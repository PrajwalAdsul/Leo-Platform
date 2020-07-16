/*
import React, { Component, useState } from 'react';
import ReactMapGL from 'react-map-gl';
 
export default function SimpleApp() {
     const [viewport, setViewport] = useState({
    latitude : 75.1212,
    longitude : 70.234,
    width : "100vw",
    height : "100vh",
    zoom : 10
  });

 

    return (
      <div>
      <ReactMapGL 
        {...viewport} 
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}>markers here</ReactMapGL>
      </div>

    );
}
*/

import React, {Component} from 'react';
import MapGL, {GeolocateControl} from 'react-map-gl';


const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
};

export default class SimpleMap extends Component {
  constructor(props){
    super(props);
         
    this.state = {
      viewport: {
        width: 1200,
        height: 700,
        latitude: this.props.latitude,
        longitude: this.props.longitude,
        zoom: 8
      }
    }

  }

  // componentWillMount = async e => {
  //   try{
  //     await this.setState({
  //       latitude : this.props.location.state.latitude,
  //       longitude : this.props.location.state.longitude
  //     });
  //     console.log(this.props.location.state.latitude + " " + this.state.longitude);
  //   }
  //   catch(e){

  //   }
  //   this.forceUpdate();
  // }


  render() {
     return (
      <MapGL
        {...this.state.viewport}
       onViewportChange={(viewport) => this.setState({viewport})}
           mapboxApiAccessToken="pk.eyJ1IjoicHJhandhbGFkIiwiYSI6ImNrNTlzbjh2cjEwNzQzbGxqb3RvOWE5anoifQ.U0JgwrGh7GdNioVRUZUhGQ"
      >
       <GeolocateControl
          style={geolocateStyle}
          positionOptions={{enableHighAccuracy: true}}
          trackUserLocation={true}
        />
        </MapGL>
    );
  }
}

