export default class OnDemandBookUpService {
  constructor(bookUpService) {
    this.bookUpService = bookUpService;
  }

  initialize() {
    const trigger = () => {
      console.debug(`Triggered ${this.constructor.name}`);
      this.bookUp();
    }

    browser.bookmarks.onCreated.addListener(trigger);
    browser.bookmarks.onRemoved.addListener(trigger);
    browser.bookmarks.onChanged.addListener(trigger);
    browser.bookmarks.onMoved.addListener(trigger);
    browser.runtime.onInstalled.addListener(trigger);
    browser.runtime.onStartup.addListener(trigger);
  }

  async bookUp() {
    await this.bookUpService.bookUp('ON_DEMAND');
  }
}
