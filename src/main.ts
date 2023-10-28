import { Actor } from "apify";
import { CheerioCrawler, ProxyConfiguration } from "crawlee";

await Actor.init();

import { router } from "./routes.js";

const startUrls = [
  "https://www.usatf.org/events/2024/2024-u-s-olympic-team-trials-%E2%80%94-marathon/2024-u-s-olympic-team-trials-marathon-qualificatio",
];

const crawler = new CheerioCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  maxRequestsPerCrawl: 20,
  requestHandler: router,
});

await crawler.run(startUrls);

await Actor.exit();
