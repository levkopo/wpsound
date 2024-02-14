import { Display, Tappable, ThemeTokens, VStack } from "@znui/react";

export type TimeSelectorProps = {
  currentTime: number
  duration: number
  append: (time: number) => void,
  show: 'seconds'|'minutes'|'hours'
}

export const TimeSelector = ({ currentTime, append, duration, show }: TimeSelectorProps) => {
  const coefficient = {
    seconds: 1,
    minutes: 60,
    hours: 3600
  }[show]

  return <VStack
    bg={ThemeTokens.surfaceContainer}
    shapeScale="md"
    ph={10}
    cursor='ns-resize'
    onWheel={(e) => {
      if(e.deltaY < -1) {
        if(currentTime + coefficient <= duration) {
          append(coefficient)
        }
      }else{
        if(currentTime - coefficient >= 0) {
          append(-coefficient)
        }
      }
    }}
  >
    <Tappable
      textAlign="center"
      pt={4}
      fontSize={14}
      pointerEvents={currentTime + coefficient > duration ? "none" : "all"}
      to={{ oc: currentTime + coefficient > duration ? 0 : 1 }}
      onClick={() => append(coefficient)}
    >+</Tappable>
    <Display>
      {
        show === 'hours'?  Math.floor(currentTime / 3600)
        .toString()
        .padStart(2, '0') : (
          show === 'minutes' ? Math.floor((currentTime % 3600) / 60)
            .toString()
            .padStart(2, '0'): Math.floor(currentTime % 60)
            .toString()
            .padStart(2, '0')
        )
      }
    </Display>
    <Tappable
      textAlign="center"
      pb={4}
      fontSize={14}
      pointerEvents={currentTime - coefficient < 0 ? "none" : "all"}
      to={{ oc: currentTime - coefficient < 0 ? 0 : 1 }}
      onClick={() => append(-coefficient)}
    >-</Tappable>
  </VStack>;
};
