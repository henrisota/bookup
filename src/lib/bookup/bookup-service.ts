import { BookUpMapper, BookUpRepository, BookUpType, BookmarkRepository } from "@bookup";

export class BookUpService {
  private bookUpRepository: BookUpRepository;
  private bookmarkRepository: BookmarkRepository;

  constructor(bookUpRepository: BookUpRepository, bookmarkRepository: BookmarkRepository) {
    this.bookUpRepository = bookUpRepository;
    this.bookmarkRepository = bookmarkRepository;
  }

  async bookUp(type: BookUpType) {
    console.debug(`Triggered ${this.constructor.name} with type ${type}`);

    await this.bookUpRepository.clean(type);

    const bookmark = await this.bookmarkRepository.get();
    if (!bookmark) {
      return;
    }

    const bookUp = BookUpMapper.fromBookmark(bookmark, type);

    await this.bookUpRepository.create(bookUp);
  }
}
