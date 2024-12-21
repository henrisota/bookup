document.getElementById('bookUp').addEventListener('click', () => {
  browser.runtime.sendMessage({command: 'bookUp'});
});
