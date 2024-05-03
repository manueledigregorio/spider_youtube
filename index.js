const { Builder, By, Key, until, } = require('selenium-webdriver');
async function scrapeYoutubeComments() {
  try {

    await driver.get('https://www.youtube.com');
    //I take the click of the initial modal on cookies
    const selector = `[aria-label="Accetta l'utilizzo dei cookie e di altri dati per le finalità descritte"]`

    await driver.wait(until.elementLocated(By.css(selector)));
    const button = await driver.findElement(By.css(selector));
    await button.click();

    //I'm waiting for the page to load
    await driver.sleep(2000);
    // I write in input search
    const Button = await driver.findElement(By.name('search_query'));
    await Button.sendKeys('Javascript');
    await driver.sleep(2000);
    //I Click on the button 
    await driver.wait(until.elementLocated(By.id('search-icon-legacy')));
    const searchButton = await driver.findElement(By.id('search-icon-legacy'));
    await searchButton.click();

    await driver.sleep(3000);

    const hrefAttributes = [];
    const links = await driver.findElements(By.css('a#thumbnail[href]'));


    for (const link of links) {
      const hrefAttributeValue = await link.getAttribute('href');
      hrefAttributes.push(hrefAttributeValue);
    }
    console.log(hrefAttributes);


    for (const detailUrl of hrefAttributes) {
      await scrapeYoutubePageDetails(detailUrl)
    };

  }catch(error){
    console.log(error);
  }

};

async function scrapeYoutubePageDetails(detailUrl) {
  try {

    await driver.get(detailUrl);
    await driver.sleep(5000);
    const spans = await driver.findElements(By.css('#content-text span'));
    await driver.sleep(5000);
     
    const videoInfo = {
      url: detailUrl,
      comments: []
    };

    for (const span of spans) {
      // Ottieni il testo all'interno di ciascuno <span>
      const text = await span.getText();
     videoInfo.comments.push(text);
    }

    console.log(videoInfo);



  } catch (error) {
    console.log(error )
  }
}

async function main(){
   driver = await new Builder().forBrowser('chrome').build();
  scrapeYoutubeComments();
}

let driver;
main();