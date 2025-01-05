import logo from '@/assets/logo.svg';

document.querySelector<HTMLImageElement>('#logo')!.src = logo;

document.getElementById('bookUp')?.addEventListener('click', () => {
  browser.runtime.sendMessage({command: 'bookUp'});
});
