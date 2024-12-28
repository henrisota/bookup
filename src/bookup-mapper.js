export default class BookUpMapper {
  static fromBookmark(bookmark) {
    return {
      time: bookmark.time,
      digest: bookmark.digest,
      size: bookmark.content.length,
      content: bookmark.content
    };
  }

  static fromDownload(download) {
    const nameSeparatorIndex = download.name.lastIndexOf('/');
    return {
      ...BookUpMapper.fromDownloadName(download.name.substring(nameSeparatorIndex + 1)),
      size: download.size
    };
  }

  static toDownloadName(bookUp) {
    const time = new Date(bookUp.time).toISOString().replaceAll(':', '_').slice(0, -5);
    return `${time}-${bookUp.digest}.json`;
  }

  static fromDownloadName(name) {
    const nameWithoutSuffix = name.replace('.json', '');
    const timeDigestSeparatorIndex = nameWithoutSuffix.lastIndexOf('-');
    const dateTime = new Date(
      nameWithoutSuffix
        .substring(0, timeDigestSeparatorIndex)
        .replaceAll('_', ':')
      + 'Z'
    );
    const digest = nameWithoutSuffix.substring(timeDigestSeparatorIndex + 1);

    return {
      time: dateTime.getTime(),
      digest
    };
  }
}
