export default class BookUpService {
  constructor(bookUpRepository, bookmarkRepository) {
    this.bookUpRepository = bookUpRepository;
    this.bookmarkRepository = bookmarkRepository;
  }

  async initialize() {
    if (!this.BookUpMapper) {
      this.BookUpMapper = (await import("./bookup-mapper.js")).default;
    }
  }

  async bookUp(type) {
    await this.initialize();

    console.debug(`Triggered ${this.constructor.name} with type ${type}`);

    this.bookUpRepository.clean(type);

    const bookmark = await this.bookmarkRepository.get();
    if (!bookmark) {
      return;
    }

    const bookUp = this.BookUpMapper.fromBookmark(bookmark);

    this.bookUpRepository.create(type, bookUp);
  }
}
