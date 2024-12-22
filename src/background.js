async function performBookUp(type) {
  let bookUp;
  try {
    bookUp = await browser.bookmarks.getTree();
  } catch (error) {
    console.error('Failed to fetch bookup', error)
    return;
  }

  let bookUpJson;
  try {
    bookUpJson = JSON.stringify(bookUp, null, 2);
  } catch (error) {
    console.error('Failed to convert bookup into json format', error)
    return;
  }

  const directory = type === 'periodic' ? 'periodic' : 'on_demand';

  try {
    manage(directory);
  } catch (error) {
    console.error('Failed to manage bookups', error);
  }

  let blob = new Blob([bookUpJson], {type: 'application/json'});
  let url = URL.createObjectURL(blob);

  try {
    browser.downloads.download({
      url,
      filename: [
        getRootDirectory(),
        directory.toString(),
        `${new Date().toISOString().replaceAll(':', '-').slice(0, -5)}.json`
      ].join('/'),
      conflictAction: 'overwrite',
      saveAs: false
    });
  } catch (error) {
    console.error('Failed to save bookup', error)
  }
}

async function manage(directory) {
  const path = [getRootDirectory(), directory].join('/');
  const maxBookUps = getMaxBookUps();

  let bookUps;
  bookUps = await browser.downloads.search({
    query: [path],
    orderBy: ['-startTime']
  });

  bookUps.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  if (bookUps.length > maxBookUps) {
    const bookUpsToDelete = bookUps.slice(maxBookUps);

    for (const bookUp of bookUpsToDelete) {
      try {
        console.info(`Deleting bookup file ${bookUp.filename}`);
        await browser.downloads.removeFile(bookUp.id);
      } catch (error) {
        if (!error.message.includes('file doesn\'t exist')) {
          console.error(`Failed to delete bookup file ${bookUp.filename}`, error);
        }
      }

      try {
        console.info(`Deleting bookup ${bookUp.filename}`);
        await browser.downloads.erase({id: bookUp.id});
      } catch (error) {
        console.error(`Failed to delete bookup ${bookUp.filename}`, error);
      }
    }
  }
}

function getRootDirectory() {
  return 'bookups';
}

function getMaxBookUps() {
  return 100;
}

browser.bookmarks.onCreated.addListener(performBookUp);
browser.bookmarks.onRemoved.addListener(performBookUp);
browser.bookmarks.onChanged.addListener(performBookUp);
browser.bookmarks.onMoved.addListener(performBookUp);
browser.runtime.onInstalled.addListener(performBookUp);
browser.runtime.onStartup.addListener(performBookUp);

browser.runtime.onMessage.addListener((message) => {
  if (message.command === 'bookUp') {
    console.info('Performing on-demand bookup');
    performBookUp();
  }
});

browser.alarms.create('periodicBookUp', { periodInMinutes: 1 });
browser.alarms.onAlarm.addListener((message) => {
  if (message.name === 'periodicBookUp') {
    console.info('Performing periodic bookup');
    performBookUp('periodic');
  }
})
