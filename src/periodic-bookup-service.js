export default class PeriodicBookUpService {
  constructor(bookUpService) {
    this.bookUpService = bookUpService;
  }

  initialize() {
    browser.alarms.create('periodicBookUp', { periodInMinutes: 1 });
    browser.alarms.onAlarm.addListener((message) => {
      if (message.name === 'periodicBookUp') {
        console.debug(`Triggered ${this.constructor.name}`);
        this.bookUp();
      }
    })
  }

  async bookUp() {
    await this.bookUpService.bookUp('PERIODIC');
  }
}
