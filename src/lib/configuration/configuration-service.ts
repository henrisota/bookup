import { Configuration, ConfigurationKey } from '@bookup';
import { StorageItemKey, WxtStorageItem, storage } from '@wxt-dev/storage';

export class ConfigurationService {
  private rootDirectory: WxtStorageItem<string, {}>;

  constructor() {
    const rootDirectoryDefault = import.meta.env.DEV ? 'bookups_development' : 'bookups';
    this.rootDirectory = storage.defineItem(`local:${ConfigurationKey.ROOT_DIRECTORY}`, {
      fallback: rootDirectoryDefault,
      init: () => rootDirectoryDefault
    });
  }

  async get(): Promise<Configuration> {
    const items = await storage.getItems(Object.values(ConfigurationKey).map(key => `local:${key}` as StorageItemKey));
    const configuration: Partial<Configuration> = {};

    items.forEach(item => {
      const key = item.key.replace('local:', '') as ConfigurationKey;
      if (Object.values(ConfigurationKey).includes(key)) {
        configuration[key] = item.value;
      }
    });

    return configuration as Configuration;
  }

  async getKey<K extends keyof Configuration>(key: K): Promise<Configuration[K] | null> {
    const storageKey = `local:${key}` as StorageItemKey;
    return storage.getItem<Configuration[K]>(storageKey);
  }

  async setKey<K extends keyof Configuration>(key: K, value: Configuration[K]): Promise<void> {
    const storageKey = `local:${key}` as StorageItemKey;
    return storage.setItem<Configuration[K]>(storageKey, value);
  }
}
