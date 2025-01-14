import { ConfigurationKey, ConfigurationService, CreateDownloadCommand, DeleteDownloadCommand, Download, DownloadMapper, GetByPathQuery, SEPARATOR } from "@bookup";

export class DownloadRepository {
  constructor(private readonly configuration: ConfigurationService) { }

  async getByPath(query: GetByPathQuery): Promise<Download[]> {
    console.debug(`Triggered ${this.constructor.name} getByPath with query`, query);

    return this.search(query.path);
  }

  async create(command: CreateDownloadCommand): Promise<Download | null> {
    console.debug(`Triggered ${this.constructor.name} create with command`, command);

    const { path: subPath, content } = command;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const rootDirectory = await this.configuration.getKey(ConfigurationKey.ROOT_DIRECTORY);
    const path = rootDirectory ? [rootDirectory, subPath].join(SEPARATOR) : subPath;

    try {
      await browser.downloads.download({
        url,
        filename: path,
        conflictAction: 'overwrite',
        saveAs: false
      });

      let download;
      let attempts = 10;

      do {
        const downloads = await this.search(path, true);
        download = downloads.at(0);
        attempts -= 1;
      } while (download && download.state === 'in_progress' && attempts >= 0);

      return download ?? null;
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
        console.warn(`Failed to delete download file ${download.path}`, error);
      }
    }

    try {
      console.info(`Deleting download ${download.path}`);
      await browser.downloads.erase({ id: download.id });
    } catch (error: any) {
      console.warn(`Failed to delete download ${download.path}`, error);
    }
  }

  private async search(path: string, inProgress: boolean = false): Promise<Download[]> {
    const items = await browser.downloads.search({
      query: [path]
    });

    return items
      .filter(item => item.filename.endsWith('.json'))
      .filter(item => item.state === 'complete' || (inProgress ? item.state == 'in_progress' : false))
      .map(item => DownloadMapper.fromDownloadItem(item));
  }
}
