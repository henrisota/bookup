import { BookUpDownloadTransformer, BookUpRepository, BookUpService, BookmarkRepository, ConfigurationService, DownloadRepository, OnDemandBookUpService, PeriodicBookUpService } from "@bookup";

export default defineBackground({
  type: 'module',
  main() {
    const configurationService = new ConfigurationService();
    const bookupDownloadTransformer = new BookUpDownloadTransformer();
    const bookmarkRepository = new BookmarkRepository();
    const downloadRepository = new DownloadRepository(configurationService);
    const bookUpRepository = new BookUpRepository(bookupDownloadTransformer, downloadRepository);
    const bookUpService = new BookUpService(bookUpRepository, bookmarkRepository);
    const onDemandBookUpService = new OnDemandBookUpService(bookUpService);
    const periodicBookUpService = new PeriodicBookUpService(bookUpService);

    onDemandBookUpService.initialize();
    periodicBookUpService.initialize();
  }
});
