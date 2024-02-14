import { BreakpointModel } from '../model/BreakpointModel'
import { HStack, Tappable, TappableProps, ThemeTokens, Title } from "@znui/react";
import { secondsToTime } from '../utils/time'

export interface BreakpointProps extends TappableProps {
  breakpoint: BreakpointModel
}

export const Breakpoint = (props: BreakpointProps) => {
  const { breakpoint, ...rest } = props

  return (
    <HStack as={Tappable} ph={12} pv={8} gap={12} align="center" {...rest}>
      <Title
        size="small"
        ph={6}
        pv={4}
        lineHeight={1}
        w="min-content"
        shapeScale="md"
        bg={ThemeTokens.secondaryContainer}
      >
        {secondsToTime(breakpoint.time)}
      </Title>

      <Title>{breakpoint.title}</Title>
    </HStack>
  )
}
