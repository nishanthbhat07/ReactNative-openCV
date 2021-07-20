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
  Dimensions,
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
    this.onBriVal = 0;
    this.onBlur = 0;

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
    this.proceedWithBrightnessMethod =
      this.proceedWithBrightnessMethod.bind(this);
    this.addBrightnessMethod = this.addBrightnessMethod.bind(this);

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
      modalBrightness: 'none',
      modalBlur: 'none',
      onChangeValue: 0,
      screenHeight: Dimensions.get('window').height,
      screenWidth: Dimensions.get('window').width,
      bri_val: 0,
      blur_val: 0,
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
      console.log('[DATA]', data);

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

  meanBlur = (imageAsBase64, blur_val, height, width) => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        console.log('HEIGHT & WIDTH', height, ' ', width);
        OpenCV.meanBlurMethod(
          imageAsBase64,
          blur_val,
          height,
          width,
          error => {
            // error handling
            console.log('[MEAN BLUR FUNC ERR!]', error);
          },
          s => {
            resolve(s);
          },
        );
      } else {
        OpenCV.meanBlurMethod(
          imageAsBase64,
          height,
          width,
          (error, dataArray) => {
            resolve(dataArray[0]);
          },
        );
      }
    });
  };
  //proceedWithMeanBlurMethod
  doSomethingWithBlur() {
    const {content} = this.state.photoAsBase64;
    const height = this.state.screenHeight;
    const width = this.state.screenWidth;
    this.meanBlur(content, this.onBlur, height, width)
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

  addBrightnessMethod = (content, onBrival, height, width) => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        OpenCV.addBrightnessMethod(
          content,
          onBrival,
          height,
          width,
          error => {
            // error handling
            console.log('[contrast BLUR FUNC ERR!]', error);
          },
          s => {
            resolve(s);
          },
        );
      } else {
        OpenCV.addBrightnessMethod(
          content,
          onBrival,
          height,
          width,
          (error, dataArray) => {
            resolve(dataArray[0]);
          },
        );
      }
    });
  };
  proceedWithBrightnessMethod() {
    const {content} = this.state.photoAsBase64;
    const height = this.state.screenHeight;
    const width = this.state.screenWidth;
    // this.setState({
    //   ...this.state,
    //   modalBrightness: 'flex',
    // });
    console.log('Brightness', this.state.modalBrightness);

    this.addBrightnessMethod(content, this.onBriVal, height, width)
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

  addContrastMethod = (content, onChangeValue, height, width) => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        console.log('HEIGHT & WIDTH', height, ' ', width);
        OpenCV.addContrastMethod(
          content,
          onChangeValue,
          height,
          width,
          error => {
            // error handling
            console.log('[contrast BLUR FUNC ERR!]', error);
          },
          s => {
            resolve(s);
          },
        );
      } else {
        OpenCV.addContrastMethod(
          content,
          onChangeValue,
          height,
          width,
          (error, dataArray) => {
            resolve(dataArray[0]);
          },
        );
      }
    });
  };

  //onclick js method for adding contrast
  proceedWithContrastMethod() {
    const {content} = this.state.photoAsBase64;
    const height = this.state.screenHeight;
    const width = this.state.screenWidth;
    this.setState({
      ...this.state,
      modalState: 'flex',
    });
    console.log(this.state.modalState);

    this.addContrastMethod(content, this.onChangeValue, height, width)
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

  onSliderChange = (value, type) => {
    switch (type) {
      case 'contrast':
        this.setState({
          ...this.state,
          onChangeValue: value,
        });
        this.onChangeValue = value;
        this.proceedWithContrastMethod();
        break;
      case 'brightness':
        this.setState({
          ...this.state,
          bri_val: value,
        });
        this.onBriVal = value;
        this.proceedWithBrightnessMethod();
        break;
      case 'blur':
        this.setState({
          ...this.state,
          blur_val: value,
        });
        this.onBlur = value;
        this.doSomethingWithBlur();
        break;
    }
  };

  onPressSlider = type => {
    switch (type) {
      case 'brightness':
        if (this.state.modalBrightness === 'flex') {
          this.setState({
            ...this.state,
            modalBrightness: 'none',
          });
        } else {
          this.setState({
            ...this.state,
            modalBrightness: 'flex',
          });
        }
        break;
      case 'contrast':
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
        break;
      case 'blur':
        if (this.state.modalBlur === 'flex') {
          this.setState({
            ...this.state,
            modalBlur: 'none',
          });
        } else {
          this.setState({
            ...this.state,
            modalBlur: 'flex',
          });
        }
        break;
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
                type={`contrast`}
                onChangeValue={this.state.onChangeValue}
                onSliderChange={this.onSliderChange}
              />
            </View>
            <View style={{display: this.state.modalBrightness}}>
              <CustomSlider
                type={`brightness`}
                onChangeValue={this.state.bri_val}
                onSliderChange={this.onSliderChange}
              />
            </View>
            <View style={{display: this.state.modalBlur}}>
              <CustomSlider
                type={`blur`}
                onChangeValue={this.state.blur_val}
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
                <TouchableOpacity onPress={() => this.onPressSlider('blur')}>
                  <Text style={styles.photoPreviewUsePhotoText}>Blur</Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => this.onPressSlider('contrast')}>
                  <Text style={styles.photoPreviewUsePhotoText}>Contrast</Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => this.onPressSlider('brightness')}>
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
