import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, TouchableHighlight, CameraRoll } from 'react-native';
import Camera from 'react-native-camera';
import Share from 'react-native-share';

class socialphotobooth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'back',
      images: []
    }
  }

  componentWillMount() {
    CameraRoll
      .getPhotos({first: 1})
      .then(resp => {
        console.log('camera roll mount')
        const assets = resp.edges;
        const images = assets.map(asset => asset.node.image);
        this.setState({ images })
      })
      .catch(err => {
        throw err;
      })
  }

  switchCamera = () => {
    if(this.state.type === 'back') {
      this.setState({ type: 'front' })
    } else {
      this.setState({ type: 'back' })
    }
  }

  storeImages(data) {
    const assets = data.edges;
    const images = assets.map( asset => asset.node.image );
    this.setState({ images });
  }

  takePicture = () => {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
    .then((data) => console.log(data))
    .catch(err => console.error(err));

    CameraRoll
      .getPhotos({first: 1})
      .then(resp => {
        const assets = resp.edges;
        const images = assets.map(asset => asset.node.image);
        console.log('images: ', images)
        this.setState({ images });
      })
      .catch(err => {
        console.log('error: ' + err);
      })
  }

  // Image can't be pressed?
  render() {
    const { type, images } = this.state;
    if(typeof images[0] === 'undefined') {
      console.log('images is undefined')
      return (
        <View>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            type={type}>
            <TouchableHighlight style={{marginBottom: 10, marginTop: 20}} onPress={this.switchCamera}>
              <Image style={styles.switch} source={require('./Images/switch-camera.png')} />
            </TouchableHighlight>
            <TouchableHighlight style={{marginBottom: 20, marginTop: 10}} onPress={this.takePicture}>
              <Image style={styles.captureButton} source={require('./Images/camera-icon.png')} />
            </TouchableHighlight>
          </Camera>
        </View>
      )
    }
    console.log(images[0])
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          type={type}>
          <Image style={{height: '100%', width: '100%'}} source={{uri: images[0].uri}} />
          <TouchableHighlight style={{marginBottom: 10, marginTop: 20}} onPress={this.switchCamera}>
            <Image style={styles.switch} source={require('./Images/switch-camera.png')} />
          </TouchableHighlight>
          <TouchableHighlight style={{marginBottom: 20, marginTop: 10}} onPress={this.takePicture}>
            <Image style={styles.captureButton} source={require('./Images/camera-icon.png')} />
          </TouchableHighlight>
        </Camera>
      </View>
    );
  }
}
// <Image source={{uri: images[0].uri.toString()}} />

// Media queries and everything responsive later
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  captureButton: {
    flex: 0,
    width: 80,
    height: 60
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  switch: {
    width: 50,
    height: 40,
    alignSelf: 'flex-start'
  }
});

AppRegistry.registerComponent('socialphotobooth', () => socialphotobooth);
