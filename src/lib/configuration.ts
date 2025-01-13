import { StorageItemKey, WxtStorageItem, storage } from '@wxt-dev/storage';

export enum ConfigurationKey {
  ROOT_DIRECTORY = 'rootDirectory'
}

export interface ExtensionConfiguration {
  [ConfigurationKey.ROOT_DIRECTORY]: string;
}

export class Configuration {
  private rootDirectory: WxtStorageItem<string, {}>;

  constructor() {
    const rootDirectoryDefault = import.meta.env.DEV ? 'bookups_development' : 'bookups';
    this.rootDirectory = storage.defineItem(`local:${ConfigurationKey.ROOT_DIRECTORY}`, {
      fallback: rootDirectoryDefault,
      init: () => rootDirectoryDefault
    });
  }

  async get(): Promise<ExtensionConfiguration> {
    const items = await storage.getItems(Object.values(ConfigurationKey).map(key => `local:${key}` as StorageItemKey));
    const configuration: Partial<ExtensionConfiguration> = {};

    items.forEach(item => {
      const key = item.key.replace('local:', '') as ConfigurationKey;
      if (Object.values(ConfigurationKey).includes(key)) {
        configuration[key] = item.value;
      }
    });

    return configuration as ExtensionConfiguration;
  }

  async getKey<K extends keyof ExtensionConfiguration>(key: K): Promise<ExtensionConfiguration[K] | null> {
    const storageKey = `local:${key}` as StorageItemKey;
    return storage.getItem<ExtensionConfiguration[K]>(storageKey);
  }

  async setKey<K extends keyof ExtensionConfiguration>(key: K, value: ExtensionConfiguration[K]): Promise<void> {
    const storageKey = `local:${key}` as StorageItemKey;
    return storage.setItem<ExtensionConfiguration[K]>(storageKey, value);
  }
}
