import { BookUp, BookUpMapper, BookUpType, DownloadRepository } from "@bookup";

export class BookUpRepository {
  private downloadRepository: DownloadRepository;

  constructor(downloadRepository: DownloadRepository) {
    this.downloadRepository = downloadRepository;
  }

  async create(bookUp: BookUp): Promise<void> {
    console.debug(`Triggered ${this.constructor.name} create with type ${bookUp.type}`);

    const bookUpExists = await this.contains(bookUp);

    if (bookUpExists) {
      console.debug(`Skipping on performing bookup as it already exists`);
      return;
    }

    const name = BookUpMapper.toDownloadName(bookUp);
    const path = [this.typeToDirectory(bookUp.type), name].join('/');

    await this.downloadRepository.create({ path, content: bookUp.content ?? '' });
  }

  async contains(bookUp: BookUp): Promise<boolean> {
    console.debug(`Triggered ${this.constructor.name} contains with type ${bookUp.type}`);

    const downloads = await this.downloadRepository.getByPath(this.typeToDirectory(bookUp.type));

    const existingBookUps = downloads.map(download => BookUpMapper.fromDownload(download, bookUp.type));

    return Boolean(existingBookUps
      .find(existingBookUp =>
        bookUp.size === existingBookUp.size && bookUp.digest === existingBookUp.digest
      )
    );
  }

  async clean(type: BookUpType): Promise<void> {
    console.debug(`Triggered ${this.constructor.name} clean with type ${type}`);

    const downloads = await this.downloadRepository.getByPath(this.typeToDirectory(type));

    downloads.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    if (downloads.length > this.max) {
      const downloadsToDelete = downloads.slice(this.max);

      for (const download of downloadsToDelete) {
        await this.downloadRepository.delete(download);
      }
    }
  }

  typeToDirectory(type: BookUpType): string {
    return type === BookUpType.PERIODIC ? 'periodic' : 'on_demand';
  }

  get max(): number {
    return 10;
  }
}
