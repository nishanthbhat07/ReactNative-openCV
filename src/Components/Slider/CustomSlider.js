/*eslint-disable*/
import React from "react"
import {
  Slider,
  Stack,
  Text,
  Box,
} from "native-base"
 const CustomSlider = (props) => {
  const {onChangeValue, onSliderChange} = props
//   const [onChangeEndValue, setOnChangeEndValue] = React.useState(70)
  return (
    <Stack mx={5} space={4} alignItems="center" w="100%">

      <Box mx={5} w="250">
        <Slider
          defaultValue={onChangeValue}
          colorScheme="cyan"
          onChange={(v) => {
            console.log(v, 'Line 21')
            onSliderChange(v/30 + 1)
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
  )
}

export default CustomSlider;

