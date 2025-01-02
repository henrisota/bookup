import { BookUpMessage, BookUpService, BookUpType } from "@bookup";

export class PeriodicBookUpService {
  private bookUpService: BookUpService;

  constructor(bookUpService: BookUpService) {
    this.bookUpService = bookUpService;
  }

  async initialize() {
    const alarmName = BookUpMessage.PERIODIC;
    const alarm = await browser.alarms.get(alarmName);
    if (!alarm) {
      browser.alarms.create(alarmName, { periodInMinutes: 1 });
    }

    browser.alarms.onAlarm.addListener((message) => {
      if (message.name === alarmName) {
        console.debug(`Triggered ${this.constructor.name}`);
        this.bookUp();
      }
    })
  }

  async bookUp() {
    await this.bookUpService.bookUp(BookUpType.PERIODIC);
  }
}
