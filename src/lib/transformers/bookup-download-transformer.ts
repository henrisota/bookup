import { BookUp, BookUpType, CreateDownloadCommand, Download, GetByPathQuery } from "@bookup";

export class BookUpDownloadTransformer {
  fromDownload(download: Download, type: BookUpType): BookUp {
    const nameSeparatorIndex = download.name.lastIndexOf('/');
    return {
      ...this.fromDownloadName(download.name.substring(nameSeparatorIndex + 1)),
      type,
      size: download.size
    };
  }

  toCreateDownloadCommand(bookUp: BookUp): CreateDownloadCommand {
    const path = [this.fromTypeToDirectory(bookUp.type), this.toDownloadName(bookUp)].join('/');

    return { path, content: bookUp.content ?? '' };
  }

  fromTypetoGetByPathQuery(type: BookUpType): GetByPathQuery {
    return { path: this.fromTypeToDirectory(type) };
  }

  private fromTypeToDirectory(type: BookUpType): string {
    return type === BookUpType.PERIODIC ? 'periodic' : 'on_demand';
  }

  private toDownloadName(bookUp: BookUp): string {
    const time = new Date(bookUp.time).toISOString().replaceAll(':', '_').slice(0, -5);
    return `${time}-${bookUp.digest}.json`;
  }

  private fromDownloadName(name: string): Pick<BookUp, 'time' | 'digest'> {
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
