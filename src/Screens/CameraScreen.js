/* eslint-disable */
import React, { Component, useState } from 'react';
import {
  AppRegistry,
  View,
  Text,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RNCamera as Camera } from 'react-native-camera';
import Toast, { DURATION } from 'react-native-easy-toast';

import styles from '../Styles/Screens/CameraScreen';
import OpenCV from '../NativeModules/OpenCV';
import CircleWithinCircle from '../assets/svg/CircleWithinCircle';
import CustomSlider from '../Components/Slider/CustomSlider'

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);

    this.takePicture = this.takePicture.bind(this);

    this.checkForBlurryImage = this.checkForBlurryImage.bind(this);
    this.proceedWithCheckingBlurryImage =
      this.proceedWithCheckingBlurryImage.bind(this);
    this.repeatPhoto = this.repeatPhoto.bind(this);
    // this.usePhoto = this.usePhoto.bind(this);
    this.meanBlur = this.meanBlur.bind(this);
    this.doSomethingWithBlur = this.doSomethingWithBlur.bind(this);

    this.addContrastMethod = this.addContrastMethod.bind(this)
    this.proceedWithContrastMethod = this.proceedWithContrastMethod.bind(this)
    this.state = {
      cameraPermission: false,
      photoAsBase64: {
        content: '',
        isPhotoPreview: false,
        photoPath: '',
      },
      modalState: 'none',
    };
  }

  checkForBlurryImage(imageAsBase64) {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        OpenCV.checkForBlurryImage(
          imageAsBase64,
          error => {
            // error handling
          },
          msg => {
            resolve(msg);
          },
        );
      } else {
        OpenCV.checkForBlurryImage(imageAsBase64, (error, dataArray) => {
          resolve(dataArray[0]);
        });
      }
    });
  }

  proceedWithCheckingBlurryImage() {
    const { content, photoPath } = this.state.photoAsBase64;

    this.checkForBlurryImage(content)
      .then(blurryPhoto => {
        if (blurryPhoto) {
          this.refs.toast.show('Photo is blurred!', DURATION.FOREVER);
          return this.repeatPhoto();
        }
        this.refs.toast.show('Photo is clear!', DURATION.FOREVER);
        this.setState({
          photoAsBase64: {
            ...this.state.photoAsBase64,
            isPhotoPreview: true,
            photoPath,
          },
        });
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  async takePicture() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      /* console.log('[DATA]', data);*/
      this.setState({
        ...this.state,
        photoAsBase64: {
          content: data.base64,
          isPhotoPreview: false,
          photoPath: data.uri,
        },
      });
      this.proceedWithCheckingBlurryImage();
    }
  }

  repeatPhoto() {
    this.setState({
      ...this.state,
      photoAsBase64: {
        content: '',
        isPhotoPreview: false,
        photoPath: '',
      },
    });
  }

  meanBlur = imageAsBase64 => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        OpenCV.meanBlurMethod(
          imageAsBase64,
          error => {
            // error handling
            console.log('[MEAN BLUR FUNC ERR!]', error);
          },
          s => {
            console.log('Line 122', s);
            resolve(s);
          },
        );
      } else {
        OpenCV.meanBlurMethod(imageAsBase64, (error, dataArray) => {
          resolve(dataArray[0]);
        });
      }
    });
  };
  //proceedWithMeanBlurMethod
  doSomethingWithBlur() {
    const { content, photoPath } = this.state.photoAsBase64;
    console.log(photoPath);
    this.meanBlur(content)
      .then(blurryPhoto => {
        console.log('[PHOTO CONTENT]: ', blurryPhoto);
        this.setState({
          photoAsBase64: {
            ...this.state.photoAsBase64,
            content: blurryPhoto,
          },
        });
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  addContrastMethod = imageAsBase64 => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        OpenCV.addContrastMethod(
          imageAsBase64,
          error => {
            // error handling
            console.log('[MEAN BLUR FUNC ERR!]', error);
          },
          s => {
            console.log('Line 122', s);
            resolve(s);
          }
        );
      } else {
        OpenCV.addContrastMethod(imageAsBase64, (error, dataArray) => {
          resolve(dataArray[0]);
        });
      }
    });
  }

  //onclick js method for adding contrast
  proceedWithContrastMethod() {
    const { content, photoPath } = this.state.photoAsBase64;
    this.setState({
      ...this.state,
      modalState: 'flex'
    })
    console.log(this.state.modalState);
    this.addContrastMethod(content)
      .then(blurryPhoto => {
        console.log('[PHOTO CONTENT]: ', blurryPhoto);
        this.setState({
          photoAsBase64: {
            ...this.state.photoAsBase64,
            content: blurryPhoto,
          },
        });
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  render() {
    if (this.state.photoAsBase64.isPhotoPreview) {
      return (
        <View style={styles.container}>
          <Toast ref="toast" position="center" />
          {/** PREVIEW */}
          <Image
            source={{
              uri: `data:image/png;base64,${this.state.photoAsBase64.content}`,
            }}
            style={styles.imagePreview}
          />
          <View style={styles.usePhotoContainer}>
            <View style={{ display:  this.state.modalState , marginBottom: '10px' }}>
              <CustomSlider />
            </View>
            <ScrollView horizontal={true}>
              <View>
                <TouchableOpacity onPress={this.repeatPhoto}>
                  <Text style={styles.photoPreviewRepeatPhotoText}>
                    Retake photo
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={this.doSomethingWithBlur}>
                  <Text style={styles.photoPreviewUsePhotoText}>Blur</Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity onPress={this.proceedWithContrastMethod}>
                  <Text style={styles.photoPreviewUsePhotoText}>Contrast</Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity>
                  <Text style={styles.photoPreviewUsePhotoText}>
                    Brightness
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity>
                  <Text style={styles.photoPreviewUsePhotoText}>
                    Brightness
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity>
                  <Text style={styles.photoPreviewUsePhotoText}>
                    Brightness
                  </Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={
            'We need your permission to use your camera phone'
          }>
          <View style={styles.takePictureContainer}>
            <TouchableOpacity onPress={this.takePicture}>
              <View>
                <CircleWithinCircle />
              </View>
            </TouchableOpacity>
          </View>
        </Camera>
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}

AppRegistry.registerComponent('CameraScreen', () => CameraScreen);
