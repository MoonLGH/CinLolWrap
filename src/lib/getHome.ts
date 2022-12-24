import {load} from "cheerio";
import {endpoints} from "../utils/api";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import {Page} from "puppeteer";
import { executablePath } from "puppeteer";

export async function getHome() {
  const pup = await puppeteer.launch({executablePath:executablePath()});
  const res = await bypass((await pup.newPage()), endpoints.baseUrl);
  const $ = load(((await res?.text()) as string));
  const results: Result[] = [];
  $("#top-page > div.flex.flex-col > div > div > div > div").each((i, el) => {
    const type = $(el).find("div.styles_container__4elzA > span").text();
    const books: Book[] = [];
    $(el)
        .find("div > div > .absolute")
        .each((i, el) => {
          const code = $(el)
              .parent()
              .find("a")
              .attr("href")
              ?.split("/v/")[1] as string;
          const detail = $(el).parent().find("div[class*=\"detail\"]");
          const page = $(el)
              .parent()
              .find("div[class*=\"image\"]")
              .find("span > span")
              .text();
          const title = detail.find("div").text();
          const lang = detail
              .find("span > span")
              .text()
              .replace(/[^a-zA-Z]/gm, "");
          books.push({code, title, lang, page});
        });
    console.log(type);
    if (type) {
      results.push({type, books});
    }
  });
  return results;
}


export async function bypass(page:Page, url:string) {
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 OPR/87.0.4390.58");
  const response = await page.goto(url, {timeout: 30000, waitUntil: "domcontentloaded"});
  if (response && response.status() === 503) return page.waitForNavigation();
  return response;
}

interface Result {
  type: string;
  books: Book[];
}

interface Book {
  code: string;
  title: string;
  lang: string;
  page: string;
}
