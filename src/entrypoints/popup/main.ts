import { ConfigurationKey, ConfigurationService } from '@bookup';

import logo from '@/assets/logo.svg';

async function main() {
  const configurationService = new ConfigurationService();
  const configuration = await configurationService.get();

  const rootDirectory = document.querySelector<HTMLInputElement>('#rootDirectory');
  const setRootDirectoryButton = document.getElementById('setRootDirectoryButton');

  document.querySelector<HTMLImageElement>('#logo')!.src = logo;

  rootDirectory!.value = configuration[ConfigurationKey.ROOT_DIRECTORY];
  setRootDirectoryButton?.addEventListener('click', async (_event: HTMLElementEventMap['click']) => {
    const newRootDirectory = rootDirectory!.value.trim();
    const currentRootDirectory = await configurationService.getKey(ConfigurationKey.ROOT_DIRECTORY);

    if (newRootDirectory === currentRootDirectory) {
      console.debug('Skipping on setting new root directory as it matches current configuration root directory');
      return;
    }

    await configurationService.setKey(ConfigurationKey.ROOT_DIRECTORY, newRootDirectory);

    console.debug(`Set configuration root directory to ${newRootDirectory}`);
  });

  document.getElementById('bookUp')?.addEventListener('click', () => {
    browser.runtime.sendMessage({command: 'bookUp'});
  });

  document.documentElement.classList.toggle(
    'dark',
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

main();
