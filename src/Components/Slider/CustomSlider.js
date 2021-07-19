/*eslint-disable*/
import React from "react"
import {
  Slider,
  Stack,
  Text,
  Box,
} from "native-base"
 const CustomSlider = () => {
  const [onChangeValue, setOnChangeValue] = React.useState(70)
  const [onChangeEndValue, setOnChangeEndValue] = React.useState(70)
  return (
    <Stack mx={5} space={4} alignItems="center" w="100%">

      <Box mx={5} w="250">
        <Slider
          defaultValue={70}
          colorScheme="cyan"
          onChange={(v) => {
            setOnChangeValue(Math.floor(v))
            console.log(v)
          }}
          onChangeEnd={(v) => {
            v && setOnChangeEndValue(Math.floor(v))
          }}
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

