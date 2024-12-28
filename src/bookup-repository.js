export default class BookUpRepository {
  constructor(downloadRepository) {
    this.downloadRepository = downloadRepository;
  }

  async initialize() {
    if (!this.BookUpMapper) {
      this.BookUpMapper = (await import("./bookup-mapper.js")).default;
    }
  }

  async create(type, bookUp) {
    await this.initialize();

    console.debug(`Triggered ${this.constructor.name} create with type ${type} and bookUp`, bookUp);

    const bookUpExists = await this.contains(type, bookUp);

    if (bookUpExists) {
      console.debug(`Skipping on performing bookup as it already exists`);
      return;
    }

    const name = this.BookUpMapper.toDownloadName(bookUp);
    const path = [this.path(type), name].join('/');

    await this.downloadRepository.create({ path, content: bookUp.content });
  }

  async contains(type, bookUp) {
    await this.initialize();

    console.debug(`Triggered ${this.constructor.name} contains with type ${type} and bookUp`, bookUp);

    const downloads = await this.downloadRepository.getByPath(this.path(type));

    const existingBookUps = downloads.map(download => this.BookUpMapper.fromDownload(download));

    return Boolean(existingBookUps
      .find(existingBookUp =>
        bookUp.size === existingBookUp.size && bookUp.digest === existingBookUp.digest
      )
    );
  }

  async clean(type) {
    console.debug(`Triggered ${this.constructor.name} clean with type ${type}`);

    const downloads = await this.downloadRepository.getByPath(this.path(type));

    downloads.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    if (downloads.length > this.max) {
      const downloadsToDelete = downloads.slice(this.max);

      for (const download of downloadsToDelete) {
        await this.downloadRepository.delete(download);
      }
    }
  }

  path(type) {
    const directory = this.typeToDirectory(type);
    return [this.rootDirectory, directory].join('/');
  }

  typeToDirectory(type) {
    return type === 'PERIODIC' ? 'periodic' : 'on_demand';
  }

  get rootDirectory() {
    return 'bookups';
  }

  get max() {
    return 10;
  }
}
