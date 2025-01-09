import { BookUp, BookUpDownloadTransformer, BookUpType, DownloadRepository } from "@bookup";

export class BookUpRepository {
  constructor(
    private readonly bookupDownloadTransformer: BookUpDownloadTransformer,
    private readonly downloadRepository: DownloadRepository
  ) {}

  async create(bookUp: BookUp): Promise<void> {
    console.debug(`Triggered ${this.constructor.name} create with type ${bookUp.type}`);

    const bookUpExists = await this.contains(bookUp);

    if (bookUpExists) {
      console.debug(`Skipping on performing bookup as it already exists`);
      return;
    }

    await this.downloadRepository.create(this.bookupDownloadTransformer.toCreateDownloadCommand(bookUp));
  }

  async contains(bookUp: BookUp): Promise<boolean> {
    console.debug(`Triggered ${this.constructor.name} contains with type ${bookUp.type}`);

    const downloads = await this.downloadRepository.getByPath(this.bookupDownloadTransformer.fromTypetoGetByPathQuery(bookUp.type));

    const existingBookUps = downloads.map(download => this.bookupDownloadTransformer.fromDownload(download, bookUp.type));

    return Boolean(existingBookUps
      .find(existingBookUp =>
        bookUp.size === existingBookUp.size && bookUp.digest === existingBookUp.digest
      )
    );
  }

  async clean(type: BookUpType): Promise<void> {
    console.debug(`Triggered ${this.constructor.name} clean with type ${type}`);

    const downloads = await this.downloadRepository.getByPath(this.bookupDownloadTransformer.fromTypetoGetByPathQuery(type));

    downloads.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    if (downloads.length > this.max) {
      const downloadsToDelete = downloads.slice(this.max);

      for (const download of downloadsToDelete) {
        await this.downloadRepository.delete({ download });
      }
    }
  }

  get max(): number {
    return 10;
  }
}
