import React from 'react'
// only load what you're actually using
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import './MapChart.css'

// this is a stateless component, it doesn't need state or event handlers
const MapContainer = ({ google, markers }) => (
  <Map 
    google={google} 
    initialCenter={{
      lat: 52.268,
      lng: 0.543
    }}
    zoom={9}
  >
    {
      markers.map((marker, i) =>
      	// since you've mapped your data to just the props you need
        // you can just spread it into the component
        <Marker
	      	key={i}
	      	icon={marker.icon}
		    title={marker.label}
		    name={marker.name}
		    position={{lat: marker.position.lat, lng: marker.position.lng}} />				    
      )
    }
  </Map>
)

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDDhX7p-77330SbETVcM8eRLX37wEha4PI'
})(MapContainer)