const puppetter = require("puppeteer");

const storeNames = async (page, url) => {
  await page.goto(url);
  await page.waitForSelector("li.second-li");
  const demo = await page.evaluate((url) => {
    console.log("start");
    let offers = Array.from(document.querySelectorAll("li.second-li"));
    console.log(offers);
    let response = [];
    for (let ind = 0; ind < offers.length - 1; ind++) {
      openPromoModal(ind);
      let offerModal = document.querySelector("#promo-d > p");
      response.push({
        offer: offerModal.textContent,
        promo: offers[ind].lastChild.textContent?.replace("Use Code", ""),
        url: url,
      });
    }
    return response;
  }, url);

  return demo;
};

const main = async () => {
  const browser = await puppetter.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppetter.executablePath(),
  });
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
  await page.goto("https://lapinozpizza.in/online-order");

  const cities = await page.evaluate(() => {
    return city;
  });

  let offersData = [];
  let counter = 1;
  let totalOutlets = 0;
  for (let city in cities) totalOutlets += Object.keys(cities[city]).length;
  // let counter = 0;
  for (let city in cities) {
    let outlets = cities[city];
    let cityData = { city: city, outlets: [] };
    for (let ind in outlets) {
      try {
        // if (counter++ >= 5) {
        //   break;
        // }
        let outlet = outlets[ind];
        console.log(
          outlet?.web_slug,
          Math.fround((counter++ / totalOutlets) * 100),
          "%"
        );
        let outletUrl = "https://lapinozpizza.in/order/" + outlet?.web_slug;
        let offers = await storeNames(page, outletUrl);
        cityData.outlets.push({
          offers: offers,
          outletName: outlet?.locality,
          ...outlet,
        });
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    offersData.push(cityData);
  }
  return {
    data: offersData,
    storeName: "La Pino'z Pizza",
    image: "https://www.uengage.in/images/addo/logos/logo-5-1600769708.png",
  };
};

module.exports = main;
