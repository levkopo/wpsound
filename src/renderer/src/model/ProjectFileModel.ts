import { BreakpointModel } from './BreakpointModel'

export type ProjectFileModel = {
  meta: {
    title: string
    author?: string
  }

  audio: {
    arrayBuffer: ArrayBuffer
    type: string
  }
  breaks: BreakpointModel[]
}
