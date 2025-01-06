import { Configuration, ConfigurationKey } from '@bookup';

import logo from '@/assets/logo.svg';

async function main() {
  const configuration = new Configuration();
  const extensionConfiguration = await configuration.get();

  document.querySelector<HTMLImageElement>('#logo')!.src = logo;
  document.querySelector<HTMLParagraphElement>('#rootDirectory')!.textContent = extensionConfiguration[ConfigurationKey.ROOT_DIRECTORY];

  document.getElementById('bookUp')?.addEventListener('click', () => {
    browser.runtime.sendMessage({command: 'bookUp'});
  });

  document.documentElement.classList.toggle(
    'dark',
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

main();
