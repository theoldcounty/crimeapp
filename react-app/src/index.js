import React, { Component } from 'react'
import { render } from 'react-dom'
import {Provider, connect} from 'react-redux'
import {createStore, applyMiddleware} from 'redux' 
import thunk from 'redux-thunk';

import MapChart from './modules/mapChart/MapChart'
import './index.css'

function fetchPostsRequest(){
  return {
    type: "FETCH_REQUEST"
  }
}

function fetchPostsSuccess(payload) {
  return {
    type: "FETCH_SUCCESS",
    payload
  }
}

function fetchPostsError() {
  return {
    type: "FETCH_ERROR"
  }
}

const reducer = (state = {}, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return state;
    case "FETCH_SUCCESS": 
      return {...state, posts: action.payload};
    default:
      return state;
  }
} 

function fetchPostsWithRedux() {
  return (dispatch) => {
    dispatch(fetchPostsRequest());
    return fetchPosts().then(([response, json]) =>{
      if(response.status === 200){
        dispatch(fetchPostsSuccess(json))
      }
      else{
        dispatch(fetchPostsError())
      }
    })
  }
}

function fetchPosts() {
  const URL = 'https://data.police.uk/api/crimes-street/all-crime?poly=52.268,0.543:52.794,0.238:52.130,0.478&date=2017-01';
  return fetch(URL, { method: 'GET'})
     .then( response => Promise.all([response, response.json()]));
}

// this is how you'll get your icon links
// instead of a switch with loads of repetitive bytes
const iconMap = {
  'anti-social-behaviour':  'green-dot',
  'burglary':               'red-dot',
  'other-theft':            'pink-dot',
  'public-order':            'purple',
  'robbery':                 'yellow',
  'vehicle-crime':          'orange',
  'violent-crime':          'orange-dot',
  'other-crime':            'ltblue-dot',
  'criminal-damage-arson':  'yellow-dot',
  'drugs':                  'purple-dot',
  'shoplifting':            'blue-dot'
}

// this is a class because it needs state
class CrimeMap extends Component {
  state = {
    markers: []
  }

  componentDidMount() {    
    this.props.fetchPostsWithRedux()
  }

  componentWillReceiveProps(nextProps){
    this.setState({markers: this.mapLayerData(nextProps.posts)});
  }

  // store only the data you want to pass as props to each Marker
  // instead of mapping it directly in MapChart every time it renders
  mapLayerData(markers) {
    // use a standard map function instead of $.each
    // destructuring saves time and repetition
    return markers.map(({ category, location }) => ({
      // use a template string and a simple map of icon names to get your icon uri
      icon: 'http://maps.google.com/mapfiles/ms/icons/'+ iconMap[category] +'.png',
      label: category,
      name: category,
      position: {
        lat: location.latitude,
        lng: location.longitude
      }
    }))
  }

  render() {
    // there's only one layer, so render it directly
    return (
      <div className="app">
        <MapChart markers={this.state.markers} />
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    posts: state.posts
  }
}    

let Container = connect(mapStateToProps, {fetchPostsWithRedux})(CrimeMap);

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

render(
    <Provider store={store}>
      <Container/>
    </Provider>,
    document.getElementById('root')
);