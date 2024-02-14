import { BreakpointModel } from "./BreakpointModel";

export type ProjectModel = {
  meta: {
    title: string
    author?: string
  }

  audio: Blob
  breaks: BreakpointModel[]
}
