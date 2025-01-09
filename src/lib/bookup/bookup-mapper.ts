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
}
