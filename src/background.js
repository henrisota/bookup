async function main() {
  const BookmarkRepository = (await import("./bookmark-repository.js")).default;
  const DownloadRepository = (await import("./download-repository.js")).default;
  const BookUpRepository = (await import("./bookup-repository.js")).default;
  const BookUpService = (await import("./bookup-service.js")).default;
  const OnDemandBookUpService = (await import("./on-demand-bookup-service.js")).default;
  const PeriodicBookUpService = (await import("./periodic-bookup-service.js")).default;

  const bookmarkRepository = new BookmarkRepository();
  const downloadRepository = new DownloadRepository();
  const bookUpRepository = new BookUpRepository(downloadRepository);
  const bookUpService = new BookUpService(bookUpRepository, bookmarkRepository);
  const onDemandBookUpService = new OnDemandBookUpService(bookUpService);
  const periodicBookUpService = new PeriodicBookUpService(bookUpService);

  onDemandBookUpService.initialize();
  periodicBookUpService.initialize();
}

main();
