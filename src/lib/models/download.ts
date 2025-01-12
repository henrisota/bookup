export type State = 'in_progress' | 'interrupted' | 'complete';

export interface Download {
  id: number
  name: string
  path: string
  size: number
  startTime: string
  state: State
}

export interface CreateDownloadCommand {
  path: string
  content: string
}

export interface DeleteDownloadCommand {
  download: Download
}

export interface GetByPathQuery {
  path: string
}
