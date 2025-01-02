import { BookUpService, BookUpType } from "@bookup";

export class OnDemandBookUpService {
  private bookUpService: BookUpService;

  constructor(bookUpService: BookUpService) {
    this.bookUpService = bookUpService;
  }

  initialize() {
    const trigger = (source: string, id: string) => {
      console.debug(`Triggered ${this.constructor.name} from source ${source} with id ${id}`);
      this.bookUp();
    }

    browser.bookmarks.onCreated.addListener((id: string) => trigger('onCreated', id));
    browser.bookmarks.onRemoved.addListener((id: string) => trigger('onRemoved', id));
    browser.bookmarks.onChanged.addListener((id: string) => trigger('onChanged', id));
    browser.bookmarks.onMoved.addListener((id: string) => trigger('onMoved', id));
    browser.runtime.onInstalled.addListener(() => trigger('onInstalled', 'OnInstall'));
    browser.runtime.onStartup.addListener(() => trigger('onStartup', 'OnStartUp'));
  }

  async bookUp() {
    await this.bookUpService.bookUp(BookUpType.ON_DEMAND);
  }
}
