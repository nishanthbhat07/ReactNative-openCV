/* eslint-disable */
import React, {Component, useState} from 'react';
import {
  AppRegistry,
  View,
  Text,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {RNCamera as Camera} from 'react-native-camera';
import Toast, {DURATION} from 'react-native-easy-toast';

import styles from '../Styles/Screens/CameraScreen';
import OpenCV from '../NativeModules/OpenCV';
import CircleWithinCircle from '../assets/svg/CircleWithinCircle';
import CustomSlider from '../Components/Slider/CustomSlider';

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);

    this.onChangeValue = 1;

    this.takePicture = this.takePicture.bind(this);
    this.checkForBlurryImage = this.checkForBlurryImage.bind(this);
    this.proceedWithCheckingBlurryImage =
      this.proceedWithCheckingBlurryImage.bind(this);
    this.repeatPhoto = this.repeatPhoto.bind(this);
    // this.usePhoto = this.usePhoto.bind(this);
    this.meanBlur = this.meanBlur.bind(this);
    this.doSomethingWithBlur = this.doSomethingWithBlur.bind(this);

    this.addContrastMethod = this.addContrastMethod.bind(this);
    this.proceedWithContrastMethod = this.proceedWithContrastMethod.bind(this);

    this.addContrastMethod = this.addContrastMethod.bind(this);
    this.proceedWithContrastMethod = this.proceedWithContrastMethod.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.onPressSlider = this.onPressSlider.bind(this);

    this.state = {
      cameraPermission: false,
      photoAsBase64: {
        content: '',
        isPhotoPreview: false,
        photoPath: '',
      },
      currentPhotoAsBase64: {
        content: '',
        isPhotoPreview: false,
        photoPath: '',
      },
      modalState: 'none',
      sliderType: 'none',
      onChangeValue: 0,
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
    const {content, photoPath} = this.state.photoAsBase64;

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
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      /* console.log('[DATA]', data);*/
      this.setState({
        ...this.state,
        photoAsBase64: {
          content: data.base64,
          isPhotoPreview: false,
          photoPath: data.uri,
        },
        currentPhotoAsBase64: {
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
    const {content, photoPath} = this.state.currentPhotoAsBase64;

    this.meanBlur(content)
      .then(blurryPhoto => {
        this.setState({
          currentPhotoAsBase64: {
            ...this.state.currentPhotoAsBase64,
            content: blurryPhoto,
          },
        });
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  addContrastMethod = (content, onChangeValue) => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        OpenCV.addContrastMethod(
          content,
          onChangeValue,
          error => {
            // error handling
            console.log('[MEAN BLUR FUNC ERR!]', error);
          },
          s => {
            resolve(s);
          },
        );
      } else {
        OpenCV.addContrastMethod(content, onChangeValue, (error, dataArray) => {
          resolve(dataArray[0]);
        });
      }
    });
  };

  //onclick js method for adding contrast
  proceedWithContrastMethod() {
    const {content} = this.state.photoAsBase64;
    this.setState({
      ...this.state,
      modalState: 'flex',
    });
    console.log(this.state.modalState);

    this.addContrastMethod(content, this.onChangeValue)
      .then(blurryPhoto => {
        this.setState({
          currentPhotoAsBase64: {
            ...this.state.currentPhotoAsBase64,
            content: blurryPhoto,
          },
        });
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  onSliderChange = value => {
    this.setState({
      ...this.state,
      onChangeValue: value,
    });
    this.onChangeValue = value;
    this.proceedWithContrastMethod();
  };

  onPressSlider = () => {
    if (this.state.modalState === 'flex') {
      this.setState({
        ...this.state,
        modalState: 'none',
      });
    } else {
      this.setState({
        ...this.state,
        modalState: 'flex',
      });
    }
  };

  render() {
    if (this.state.photoAsBase64.isPhotoPreview) {
      return (
        <View style={styles.container}>
          <Toast ref="toast" position="center" />
          {/** PREVIEW */}
          <Image
            source={{
              uri: `data:image/png;base64,${this.state.currentPhotoAsBase64.content}`,
            }}
            style={styles.imagePreview}
          />
          <View style={styles.usePhotoContainer}>
            <View style={{display: this.state.modalState}}>
              <CustomSlider
                onChangeValue={this.state.onChangeValue}
                onSliderChange={this.onSliderChange}
              />
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
                <TouchableOpacity onPress={this.onPressSlider}>
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
