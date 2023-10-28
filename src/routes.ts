import { Dataset, createCheerioRouter } from "crawlee";

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  log.info(`enqueueing new URLs`);
  await enqueueLinks({
    globs: ["https://www.usatf.org/events/2024/**/*"],
    label: "detail",
  });
});

router.addHandler("detail", async ({ $, log }) => {
  const columns: string[] = [];
  const final: Record<string, any>[] = [];
  const title = $("title")
    .text()
    .split("|")[0]
    .trim()
    .replace(/'/g, "")
    .replace(/(\s+|\.|_)/g, "-")
    .toLowerCase();

  if (!title.toLowerCase().includes("performances")) {
    log.info(`SKIPPING: ${title}`);
    return;
  }

  log.info(title);
  const dataset = await Dataset.open(title);

  $("tr").each((index, row) => {
    const childText = $(row)
      .children()
      .map((_, c) => $(c).text())
      .get();
    if (index === 0) {
      columns.push(...childText);
      return;
    }
    const data = {
      ...Object.fromEntries(childText.map((text, i) => [columns[i], text])),
      rank: index,
    };
    final.push(data);
  });
  await dataset.pushData(final);
  await dataset.exportToJSON(title);
});
