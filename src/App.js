import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
//import Clarifai from 'clarifai';
import './App.css';

const particleOptions = {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route : 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState
  }

  //Api Testing
  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //   .then(response => response.json())
  //   .then(console.log);
  // }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = image.width;
    const height = image.height;
    console.log(data);
    console.log(clarifaiFace);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFacebox = (box) => {
    console.log('Box: ', box);
    this.setState({box : box});
  }

  onInputChange = (event) => {
     this.setState({input: event.target.value});
  }
  
  onButtonSubmit = () => {
   this.setState({ imageUrl: this.state.input});
   console.log(this.state.input);
    fetch('https://face-detection-api-node.herokuapp.com/imageurl', {
      method: 'POST',
      headers: {'content-type' : 'application/json'},
      body: JSON.stringify({input: this.state.input})
    })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch('https://face-detection-api-node.herokuapp.com/image',{
          method: 'put',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(
            {
              id: this.state.user.id,
            }
          )
        }).then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries : count}))
        })
        .catch(console.log)
      }
      this.displayFacebox(this.calculateFaceLocation(response))
    })
    .catch((err) => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout' ){
      this.setState(initialState)
    }
    else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render(){
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles params = {particleOptions} className="cm-particles"/>
        <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange} />
        
        { route === "home" ? 
            <div>
              <Logo />
              <Rank name = {this.state.user.name} entries = {this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit = {this.onButtonSubmit} />
              <FaceRecognition box={box} imageUrl = {imageUrl} />
            </div>
          : 
          (
            route === "signin"
            ? <Signin onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>
            : <Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser} />
          )
        }
      </div>
    )
  }
}

export default App;
