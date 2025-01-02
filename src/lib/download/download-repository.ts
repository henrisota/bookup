import { Download, DownloadMapper, File } from "@bookup";

import { Downloads } from "webextension-polyfill";

export class DownloadRepository {
  constructor() { }

  async getByPath(path: string) {
    console.debug(`Triggered ${this.constructor.name} getByPath with path`, path);

    const items = await browser.downloads.search({
      query: [path]
    });

    return items
      .filter(item => item.filename.endsWith('.json'))
      .filter(item => item.state === 'complete')
      .map(item => DownloadMapper.fromDownloadItem(item));
  }

  async create(file: File): Promise<Download | null> {
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

      return DownloadMapper.fromDownloadItem(item as unknown as Downloads.DownloadItem);
    } catch (error) {
      console.warn('Failed to create download', error);

      return null;
    }
  }

  async delete(download: Download): Promise<void> {
    console.debug(`Triggered ${this.constructor.name} delete with download`, download);

    try {
      await browser.downloads.removeFile(download.id);
    } catch (error: any) {
      const message = error.message;
      if (!message.includes('file doesn\'t exist') &&
        !message.includes('remove incomplete download')) {
        console.warn(`Failed to delete download file ${download.name}`, error);
      }
    }

    try {
      console.info(`Deleting download ${download.name}`);
      await browser.downloads.erase({ id: download.id });
    } catch (error: any) {
      console.warn(`Failed to delete download ${download.name}`, error);
    }
  }
}
