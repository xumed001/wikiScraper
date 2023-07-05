
const puppeteer = require('puppeteer');
const fs = require('fs-extra');


const scrapeTable = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://en.wikipedia.org/wiki/2023_in_video_games#Series_with_new_entries');
    // await page.waitForSelector('DOMContentLoaded');

    const tableData = await page.evaluate(() => {
      const table = document.querySelector('table.wikitable')[6];
      const rows = table.querySelectorAll('tr');
      const data = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const columns = row.querySelectorAll('td');
        const rowData = [];

        for (let j = 0; j < columns.length; j++) {
          const cell = columns[j];
          rowData.push(cell.innerText.trim());
        }

        data.push(rowData);
      }

      return data;
    });

    await browser.close();
    return tableData;
  } catch (error) {
    console.error('An error occurred while scraping the table:', error);
    return null;
  }
};

scrapeTable().then((tableData) => {
  if (tableData) {
    const jsonData = JSON.stringify(tableData, null, 2);
    fs.writeFile('tableDataFirst.json', jsonData, (err) => {
      if (err) {
        console.error('Error saving the JSON file:', err);
      } else {
        console.log('Table data saved as tableData.json');
      }
    });
  }
});


