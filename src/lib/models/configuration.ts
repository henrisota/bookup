export enum ConfigurationKey {
  ROOT_DIRECTORY = 'rootDirectory'
}

export interface Configuration {
  [ConfigurationKey.ROOT_DIRECTORY]: string;
}
