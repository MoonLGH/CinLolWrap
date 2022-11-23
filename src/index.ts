import axios from "axios";
import {load} from "cheerio";

export async function getHome() {
  const res = await axios.get("https://cin.guru/");
  const $ = load(res.data);
  const results:Result[] = [];
  $("#top-page > div.flex.flex-col > div > div > div > div").each((i, el)=>{
    const type = $(el).find("div.styles_container__4elzA > span").text();
    const books:Book[] = [];
    $(el).find("div > div > .absolute").each((i, el)=>{
      const code = ($(el).parent().find("a").attr("href")?.split("/v/")[1] as string);
      const detail = $(el).parent().find("div[class*=\"detail\"]");
      const page = $(el).parent().find("div[class*=\"image\"]").find("span > span").text();
      const title = detail.find("div").text();
      const lang = detail.find("span > span").text().replace(/[^a-zA-Z]/gm, "");
      books.push({code, title, lang, page});
    });
    if (type) {
      results.push({type, books});
    }
  });
  return results;
}

interface Result {
   type:string
   books:Book[]
}

interface Book {
 code:string,
 title:string,
 lang:string,
 page:string
}

// function substringBefore(str:string, before:string) {
//   return str.substring(0, str.indexOf(before));
// }

// function substringAfter(str:string, after:string) {
//   return str.substring(str.indexOf(after)+after.length, str.length);
// }
