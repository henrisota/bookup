export interface Download {
  id: number
  name: string
  size: number
  startTime: string
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
