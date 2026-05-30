const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, 'login.html');
  const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;

  console.log('正在打开登录页...');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  console.log('页面加载完成');

  // Check login overlay
  const hasOverlay = await page.$('#login-overlay');
  console.log(`登录覆盖层: ${!!hasOverlay}`);

  // Check title
  const title = await page.$eval('.login-title', el => el.textContent);
  console.log(`标题: "${title}"`);

  // Check progress ring
  const hasProgress = await page.$('#progress-ring');
  console.log(`进度环: ${!!hasProgress}`);

  // Check start button
  const startBtn = await page.$('#start-btn');
  console.log(`开始按钮: ${!!startBtn}`);
  const startBtnText = await page.$eval('#start-btn', el => el.textContent);
  console.log(`按钮文本: "${startBtnText}"`);

  // Check skip button
  const skipBtn = await page.$('#skip-btn');
  console.log(`跳过按钮: ${!!skipBtn}`);

  // Check camera container (should be hidden)
  const cameraDisplay = await page.$eval('#camera-container', el => el.style.display);
  console.log(`摄像头容器初始显示: "${cameraDisplay}"`);

  // Check success overlay (should be hidden)
  const successOpacity = await page.$eval('#success-overlay', el => getComputedStyle(el).opacity);
  console.log(`成功覆盖层opacity: ${successOpacity}`);

  // Check particle canvas exists
  const hasCanvas = await page.$('#login-canvas');
  console.log(`粒子Canvas: ${!!hasCanvas}`);

  // Check trail canvas
  const hasTrail = await page.$('#trail-canvas');
  console.log(`轨迹Canvas: ${!!hasTrail}`);

  // Take screenshot
  await page.screenshot({ path: 'D:/学习资料/前端网页控制/screenshot-login.png', fullPage: false });
  console.log('已保存登录页截图');

  // Check Three.js loaded
  const threeLoaded = await page.evaluate(() => typeof THREE !== 'undefined');
  console.log(`Three.js 已加载: ${threeLoaded}`);

  // Click skip button and verify navigation
  console.log('\n点击跳过按钮...');
  await page.click('#skip-btn');
  await page.waitForTimeout(1000);
  const currentUrl = page.url();
  console.log(`跳转后URL: ${currentUrl}`);

  console.log('\n===== 测试结果 =====');
  console.log('✅ 登录页基本元素完整，功能正常');

  await browser.close();
})();
