const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeInnerTextFromTable() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the Wikipedia page
  await page.goto('https://en.wikipedia.org/wiki/2023_in_video_games');

  // Wait for the table to be visible on the page
  await page.waitForSelector('#mw-content-text table.wikitable');

  // Retrieve the innerText of the table
  const innerText = await page.evaluate(() => {
    const tableArr = Array.from(document.querySelectorAll('.wikitable'))
    return tableArr[6].innerText;
  });

  const lines = innerText.split('\n');
const headers = lines[0].split('\t');

const games = [];
for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split('\t');
  const game = {};
  for (let j = 0; j < headers.length; j++) {
    game[headers[j]] = values[j];
  }
  games.push(game);
}

  const jsonData = { games };
  
  // Convert the array to JSON
  const jsonDataFinal = JSON.stringify(jsonData, null, 2);
  
  // Save the JSON to a file
  fs.writeFileSync('games.json', jsonDataFinal);

  await browser.close();
}

scrapeInnerTextFromTable();

