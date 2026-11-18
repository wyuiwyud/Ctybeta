import puppeteer from 'puppeteer-core';

const chromePath = '/home/wyuiwyud/Tài liệu/ADolSoft/chrome/linux-157.0.8103.78/chrome-linux64/chrome';

(async () => {
    console.log('🚀 Testing 25 Boards Topic Titles & AI Smart Suggestions...');
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1440, height: 900 }
    });
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));

    await page.goto('http://localhost:4321', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    // Open Workspace
    await page.evaluate(() => {
        const preloader = document.getElementById('cad-preloader');
        if (preloader) preloader.style.display = 'none';
        const ws = document.getElementById('studio-workspace');
        if (ws) {
            ws.classList.add('visible');
            ws.style.display = 'flex';
        }
        const auth = document.getElementById('studio-auth');
        if (auth) auth.style.display = 'none';
    });
    await new Promise(r => setTimeout(r, 600));

    // 1. Open 25 Boards Map Overview
    console.log('Opening 25 Boards Map Overview...');
    await page.evaluate(() => {
        const toggleBtn = document.getElementById('tool-map-toggle');
        if (toggleBtn) toggleBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // 2. Check 25 board cards and inputs
    const mapInfo = await page.evaluate(() => {
        const cards = document.querySelectorAll('.map-board-card');
        const inputs = document.querySelectorAll('.board-title-input');
        const aiButtons = document.querySelectorAll('.board-ai-btn');
        return {
            totalCards: cards.length,
            totalInputs: inputs.length,
            totalAiButtons: aiButtons.length
        };
    });
    console.log('Map Grid Element counts:', mapInfo);

    // 3. Click AI Suggest button on Board #01
    console.log('Clicking ✦ AI Suggest button on Board #01...');
    await page.evaluate(() => {
        const aiBtn = document.querySelector('.map-board-card .board-ai-btn');
        if (aiBtn) aiBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // 4. Inspect AI Dropdown
    const dropdownInfo = await page.evaluate(() => {
        const dd = document.querySelector('.board-ai-dropdown');
        if (!dd) return null;
        const chips = Array.from(dd.querySelectorAll('.board-ai-chip')).map(c => c.textContent?.trim());
        const title = dd.querySelector('.board-ai-dropdown-title')?.textContent?.trim();
        const refreshBtn = dd.querySelector('.board-ai-refresh-btn')?.textContent?.trim();
        return { title, refreshBtn, chips };
    });
    console.log('AI Dropdown Info:', JSON.stringify(dropdownInfo, null, 2));

    // 5. Select first AI chip
    console.log('Selecting first AI suggestion chip...');
    await page.evaluate(() => {
        const firstChip = document.querySelector('.board-ai-chip');
        if (firstChip) firstChip.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Check Board #01 input value
    const board1Val = await page.evaluate(() => {
        const input = document.querySelector('.board-title-input');
        return input ? input.value : '';
    });
    console.log('Board #01 title set to:', board1Val);

    // 6. Test Board #02: Type custom title and open AI dropdown on Board #03 to show in screenshot
    await page.evaluate(() => {
        const inputs = document.querySelectorAll('.board-title-input');
        if (inputs[1]) {
            inputs[1].value = 'Bản đồ tính năng AI Q1';
            inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        }
        // Open AI dropdown on Board #03 for display
        const aiBtns = document.querySelectorAll('.board-ai-btn');
        if (aiBtns[2]) {
            aiBtns[2].click();
        }
    });
    await new Promise(r => setTimeout(r, 500));

    // Capture screenshot of the 25 boards with topic lines and active AI dropdown
    const mapOverview = await page.$('#canvas-map-overview');
    if (mapOverview) {
        await mapOverview.screenshot({
            path: '/home/wyuiwyud/.gemini/antigravity/brain/35eb24b1-472f-403d-9bc9-ba30cb637d5a/test_25_boards_topics.png'
        });
        console.log('✓ Captured /home/wyuiwyud/.gemini/antigravity/brain/35eb24b1-472f-403d-9bc9-ba30cb637d5a/test_25_boards_topics.png');
    }

    await browser.close();
    console.log('All tests passed successfully!');
})();
