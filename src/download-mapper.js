export default class DownloadMapper {
  static fromDownloadItem(item) {
    return {
      id: item.id,
      name: item.filename,
      size: item.fileSize,
      startTime: item.startTime
    };
  }
}
