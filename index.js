const puppeteer = require('puppeteer-core');
const { exec } = require('node:child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execPromise = promisify(exec);

async function loadCookies(page, cookiePath) {
  if (fs.existsSync(cookiePath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
    
    const cleanedCookies = cookies.map(cookie => {
      const { partitionKey, storeId, firstPartyDomain, ...cleanCookie } = cookie;
      return cleanCookie;
    });
    
    await page.setCookie(...cleanedCookies);
    console.log('✅ Cookies loaded');
  } else {
    console.warn('⚠️ No cookies file found');
  }
}

async function main() {
  const { stdout: chromiumPath } = await execPromise('which chromium');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromiumPath.trim(),
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--ignore-certificate-errors',
      '--disable-extensions',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
  );

  await loadCookies(page, path.resolve(__dirname, 'appstate.json'));

  await page.goto('https://panel.sillydev.co.uk/store/credits', {
    waitUntil: 'networkidle2',
  });

  console.log('🟢 Page loaded and running AFK loop... Saksepoli Sir Wildan Suldyir 🫡🫡🫡');

  while (true) {
    // just hang here forever — pure AFK
  }
}

main();9
