import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './Component/Navigation/navigaton';
import FaceRecoginition from './Component/FaceRecoginition/FaceRecoginition';
import Signin from './Component/Signin/Signin';
import Register from './Component/Register/Register';
import Clarifai from 'clarifai';
import Logo from './Component/Logo/Logo';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Rank from './Component/Rank/Rank';
import './App.css';



const app = new Clarifai.App({
 apiKey: 'API KEY'
});

const Particlesoptions = {
  particles:{
    number: {
      value:30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box: {},
      route: 'Signin',
      isSigninedIn: false,
      user: {
        id:'',
        name:'',
        email:'',
        entries:0,
        joined: ''
      }

    }
  }

  loadUser = (data) => {
    this.setState ( { user: {
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
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value}); 
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));

  }
  onRouteChange = (route) => {
    if(route === 'SignOut'){
      this.setState({isSigninedIn:false})
    }else if(route === 'home'){
      this.setState({ isSigninedIn: true })
    }
    this.setState({route: route});
  }
  render() {
    const { isSigninedIn, imageUrl, box, route } = this.state;
    return (
      <div className="App">
        <Particles className='particles'>
          params={Particlesoptions}
        </Particles>
        <Navigation isSigninedIn={ isSigninedIn }  onRouteChange={ this.onRouteChange }/>
        { route === 'home' 
          ? <div>
              <Logo/>
              <Rank
                name = {this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecoginition box = {box} imageUrl={imageUrl}/>
            </div>
          :(
            route === 'Signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange} />
          )
           

        }
      </div>
    );
  }
}

export default App;
