/*eslint-disable*/
import React from 'react';
import {Slider, Stack, Text, Box} from 'native-base';
const CustomSlider = props => {
  //   const [onChangeEndValue, setOnChangeEndValue] = React.useState(70)
  const {onSliderChange, onChangeValue, type} = props;
  switch (type) {
    case 'contrast':
      return (
        <Stack mx={5} space={4} alignItems="center" w="100%">
          <Box mx={5} w="250">
            <Slider
              defaultValue={onChangeValue}
              colorScheme="cyan"
              onChange={v => {
                console.log(v, 'Line 21');
                onSliderChange(v / 30 + 1, 'contrast');
              }}
              //   onChangeEnd={(v) => {
              //     v && setOnChangeEndValue(Math.floor(v))
              //     console.log(onChangeEndValue)
              //   }}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </Box>
        </Stack>
      );
    case 'brightness':
      return (
        <Stack mx={5} space={4} alignItems="center" w="100%">
          <Box mx={5} w="250">
            <Slider
              defaultValue={onChangeValue}
              colorScheme="rose"
              onChange={v => {
                console.log(v, 'Line 42');
                onSliderChange(v, 'brightness');
              }}
              //   onChangeEnd={(v) => {
              //     v && setOnChangeEndValue(Math.floor(v))
              //     console.log(onChangeEndValue)
              //   }}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </Box>
        </Stack>
      );
    case 'blur':
      return (
        <Stack mx={5} space={4} alignItems="center" w="100%">
          <Box mx={5} w="250">
            <Slider
              defaultValue={onChangeValue}
              colorScheme="emerald"
              onChange={v => {
                console.log(v, 'Line 65');

                onSliderChange(v, 'blur');
              }}
              //   onChangeEnd={(v) => {
              //     v && setOnChangeEndValue(Math.floor(v))
              //     console.log(onChangeEndValue)
              //   }}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </Box>
        </Stack>
      );
  }
};

export default CustomSlider;
