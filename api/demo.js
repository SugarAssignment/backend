const puppetter = require("puppeteer");

const main = async () => {
  const browser = await puppetter.launch({ headless: false });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  url = "https://lapinozpizza.in/order/civil-lines-agra";


  await page.goto(url);
  await page.waitForSelector("li.second-li");
  const demo = await page.evaluate((url) => {
    console.log("start");
    let offers = Array.from(document.querySelectorAll("li.second-li"));
    console.log(offers);
  let response = [];
  for (let ind = 0; ind < offers.length-1; ind++) {
    openPromoModal(ind);
    let offerModal = document.querySelector("#promo-d > p");
    response.push({
      offer: offerModal.textContent,
      promo: offers[ind].lastChild.textContent?.replace("Use Code", ""),
      url: url
    });
  }
  return response
  }, url);
};

main();
