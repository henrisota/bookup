export default class DownloadRepository {
  constructor() { }

  async initialize() {
    if (!this.DownloadMapper) {
      this.DownloadMapper = (await import("./download-mapper.js")).default;
    }
  }

  async getByPath(path) {
    await this.initialize();

    console.debug(`Triggered ${this.constructor.name} getBypath with path`, path);

    const items = await browser.downloads.search({
      query: [path]
    });

    return items
      .filter(item => item.filename.endsWith('.json'))
      .filter(item => item.state === 'complete')
      .map(item => this.DownloadMapper.fromDownloadItem(item));
  }

  async create(file) {
    await this.initialize();

    console.debug(`Triggered ${this.constructor.name} create with file`, file);

    const { path, content } = file;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    try {
      const item = await browser.downloads.download({
        url,
        filename: path,
        conflictAction: 'overwrite',
        saveAs: false
      });

      return this.DownloadMapper.fromDownloadItem(item);
    } catch (error) {
      console.warn('Failed to create download', error);
    }
  }

  async delete(download) {
    console.debug(`Triggered ${this.constructor.name} delete with download`, download);

    try {
      await browser.downloads.removeFile(download.id);
    } catch (error) {
      const message = error.message;
      if (!message.includes('file doesn\'t exist') &&
        !message.includes('remove incomplete download')) {
        console.warn(`Failed to delete download file ${download.name}`, error);
      }
    }

    try {
      console.info(`Deleting download ${download.name}`);
      await browser.downloads.erase({ id: download.id });
    } catch (error) {
      console.warn(`Failed to delete download ${download.name}`, error);
    }
  }
}
