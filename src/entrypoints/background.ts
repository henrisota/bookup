import { BookUpRepository } from "@bookup/bookup/bookup-repository";
import { BookUpService } from "@bookup/bookup/bookup-service";
import { BookmarkRepository } from "@bookup/bookmark/bookmark-repository";
import { DownloadRepository } from "@bookup/download/download-repository";
import { OnDemandBookUpService } from "@bookup/bookup/on-demand-bookup-service";
import { PeriodicBookUpService } from "@bookup/bookup/periodic-bookup-service";

export default defineBackground({
  type: 'module',
  main() {
    const bookmarkRepository = new BookmarkRepository();
    const downloadRepository = new DownloadRepository();
    const bookUpRepository = new BookUpRepository(downloadRepository);
    const bookUpService = new BookUpService(bookUpRepository, bookmarkRepository);
    const onDemandBookUpService = new OnDemandBookUpService(bookUpService);
    const periodicBookUpService = new PeriodicBookUpService(bookUpService);

    onDemandBookUpService.initialize();
    periodicBookUpService.initialize();
  }
});
