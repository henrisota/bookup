async function bookUp(type) {
  let bookmarks;
  try {
    bookmarks = await browser.bookmarks.getTree();
  } catch (error) {
    console.error('Failed to fetch bookmarks')
    return;
  }

  let bookmarksJson;
  try {
    bookmarksJson = JSON.stringify(bookmarks, null, 2);
  } catch (error) {
    console.error('Failed to convert bookmarks into json format')
    return;
  }

  const directory = type === 'periodic' ? 'periodic' : 'on_demand';

  let blob = new Blob([bookmarksJson], {type: 'application/json'});
  let url = URL.createObjectURL(blob);

  try {
    browser.downloads.download({
      url,
      filename: [
        getRootDirectory(),
        directory.toString(),
        new Date().toISOString().replaceAll(':', '-').slice(0, -5)
      ].join('/'),
      conflictAction: 'overwrite',
      saveAs: false
    });
  } catch (error) {
    console.error('Failed to bookup into downloads directory')
  }
}

function getRootDirectory() {
  return 'bookups';
}

browser.bookmarks.onCreated.addListener(bookUp);
browser.bookmarks.onRemoved.addListener(bookUp);
browser.bookmarks.onChanged.addListener(bookUp);
browser.bookmarks.onMoved.addListener(bookUp);
browser.runtime.onInstalled.addListener(bookUp);
browser.runtime.onStartup.addListener(bookUp);

browser.runtime.onMessage.addListener((message) => {
  if (message.command === 'bookUp') {
    console.info('Performing on-demand bookup');
    bookUp();
  }
});

browser.alarms.create('periodicBookUp', { periodInMinutes: 1 });
browser.alarms.onAlarm.addListener((message) => {
  if (message.name === 'periodicBookUp') {
    console.info('Performing periodic bookup');
    bookUp('periodic');
  }
})
