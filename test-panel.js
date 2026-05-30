const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, 'index.html');
  const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;

  console.log('正在打开本地文件...');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log('页面加载完成');

  // Wait for panel
  await page.waitForSelector('#panel', { timeout: 10000 });
  console.log('面板元素已找到');

  // Check initial state
  const hasCollapsedInitially = await page.$eval('#panel', el => el.classList.contains('collapsed'));
  console.log(`初始状态 - 是否折叠: ${hasCollapsedInitially}`);

  // Check panel-header exists
  const hasHeader = await page.$('#panel-header');
  console.log(`panel-header 元素存在: ${!!hasHeader}`);

  // Check panel-toggle arrow
  const toggleText = await page.$eval('#panel-toggle', el => el.textContent);
  console.log(`折叠箭头文本: "${toggleText}"`);

  // Check panel-body exists
  const hasBody = await page.$('#panel-body');
  console.log(`panel-body 元素存在: ${!!hasBody}`);

  // Screenshot before collapse
  await page.screenshot({ path: 'D:/学习资料/前端网页控制/screenshot-expanded.png', fullPage: false });
  console.log('已保存展开状态截图');

  // Click to collapse
  console.log('\n点击面板标题栏进行折叠...');
  await page.click('#panel-header');
  await page.waitForTimeout(600);

  const hasCollapsedAfter = await page.$eval('#panel', el => el.classList.contains('collapsed'));
  console.log(`折叠后 - 是否有collapsed类: ${hasCollapsedAfter}`);

  const bodyOpacity = await page.$eval('#panel-body', el => getComputedStyle(el).opacity);
  console.log(`折叠后 panel-body opacity: ${bodyOpacity}`);

  // Screenshot after collapse
  await page.screenshot({ path: 'D:/学习资料/前端网页控制/screenshot-collapsed.png', fullPage: false });
  console.log('已保存折叠状态截图');

  // Click to expand again
  console.log('\n再次点击面板标题栏进行展开...');
  await page.click('#panel-header');
  await page.waitForTimeout(600);

  const hasExpandedAfter = await page.$eval('#panel', el => el.classList.contains('collapsed'));
  console.log(`展开后 - 是否仍有collapsed类: ${hasExpandedAfter}`);

  // Screenshot after re-expand
  await page.screenshot({ path: 'D:/学习资料/前端网页控制/screenshot-reexpanded.png', fullPage: false });
  console.log('已保存重新展开状态截图');

  // Final verdict
  console.log('\n===== 测试结果 =====');
  if (!hasCollapsedInitially && hasCollapsedAfter && !hasExpandedAfter) {
    console.log('✅ 折叠/展开功能正常工作！');
  } else {
    console.log('❌ 功能异常，需要检查');
  }

  await browser.close();
})();
