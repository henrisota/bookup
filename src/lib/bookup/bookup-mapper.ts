import { BookUp, BookUpType, Bookmark, Download } from "@bookup";

export class BookUpMapper {
  static fromBookmark(bookmark: Bookmark, type: BookUpType): BookUp {
    return {
      type,
      time: bookmark.time,
      digest: bookmark.digest,
      size: bookmark.content.length,
      content: bookmark.content
    };
  }

  static fromDownload(download: Download, type: BookUpType): BookUp {
    const nameSeparatorIndex = download.name.lastIndexOf('/');
    return {
      ...BookUpMapper.fromDownloadName(download.name.substring(nameSeparatorIndex + 1)),
      type,
      size: download.size
    };
  }

  static toDownloadName(bookUp: BookUp): string {
    const time = new Date(bookUp.time).toISOString().replaceAll(':', '_').slice(0, -5);
    return `${time}-${bookUp.digest}.json`;
  }

  static fromDownloadName(name: string): Pick<BookUp, 'time' | 'digest'> {
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
