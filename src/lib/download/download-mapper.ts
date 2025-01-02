import { Download } from "@bookup";
import { Downloads } from "wxt/browser";

export class DownloadMapper {
  static fromDownloadItem(item: Downloads.DownloadItem): Download {
    return {
      id: item.id,
      name: item.filename,
      size: item.fileSize,
      startTime: item.startTime
    };
  }
}
