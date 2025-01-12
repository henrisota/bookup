import { Download, getLastPathSegment } from "@bookup";

import { Downloads } from "wxt/browser";

export class DownloadMapper {
  static fromDownloadItem(item: Downloads.DownloadItem): Download {
    return {
      id: item.id,
      name: getLastPathSegment(item.filename),
      path: item.filename,
      size: item.fileSize,
      startTime: item.startTime,
      state: item.state,
    };
  }
}
