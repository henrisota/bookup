import { Configuration, ConfigurationKey, CreateDownloadCommand, DeleteDownloadCommand, Download, DownloadMapper, GetByPathQuery } from "@bookup";

import { Downloads } from "webextension-polyfill";

export class DownloadRepository {
  constructor(private readonly configuration: Configuration) { }

  async getByPath(query: GetByPathQuery) {
    console.debug(`Triggered ${this.constructor.name} getByPath with query`, query);

    const { path } = query;
    const items = await browser.downloads.search({
      query: [path]
    });

    return items
      .filter(item => item.filename.endsWith('.json'))
      .filter(item => item.state === 'complete')
      .map(item => DownloadMapper.fromDownloadItem(item));
  }

  async create(command: CreateDownloadCommand): Promise<Download | null> {
    console.debug(`Triggered ${this.constructor.name} create with command`, command);

    const { path, content } = command;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const rootDirectory = await this.configuration.getKey(ConfigurationKey.ROOT_DIRECTORY);
    const filename = rootDirectory ? [rootDirectory, path].join('/') : path;

    try {
      const item = await browser.downloads.download({
        url,
        filename,
        conflictAction: 'overwrite',
        saveAs: false
      });

      return DownloadMapper.fromDownloadItem(item as unknown as Downloads.DownloadItem);
    } catch (error) {
      console.warn('Failed to create download', error);

      return null;
    }
  }

  async delete(command: DeleteDownloadCommand): Promise<void> {
    console.debug(`Triggered ${this.constructor.name} delete with command`, command);

    const { download } = command;
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
