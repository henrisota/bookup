import { Bookmark } from "@bookup";
import { Bookmarks } from "wxt/browser";

export class BookmarkRepository {
  constructor() { }

  async get(): Promise<Bookmark | null> {
    let bookmarks: Bookmarks.BookmarkTreeNode[] | null = null;
    try {
      bookmarks = await browser.bookmarks.getTree();
    } catch (error) {
      console.warn('Failed to fetch bookmarks', error);
      return null;
    }

    let content: string | null = null;
    try {
      content = JSON.stringify(bookmarks, null, 2);
    } catch (error) {
      console.warn('Failed to convert bookmarks into JSON format', error);
      return null;
    }

    const digest = await this.digest(content);

    return {
      time: Date.now(),
      content,
      digest
    };
  }

  async digest(content: string): Promise<string> {
    const data = new TextEncoder().encode(content);
    const hash = await window.crypto.subtle.digest('SHA-1', data);
    return Array
      .from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 8);
  }
}
