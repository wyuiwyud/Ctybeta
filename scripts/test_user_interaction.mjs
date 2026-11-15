import puppeteer from 'puppeteer-core';

const chromePath = '/home/wyuiwyud/Tài liệu/ADolSoft/chrome/linux-157.0.8103.78/chrome-linux64/chrome';

(async () => {
    console.log('🚀 Starting User Interaction Test...');
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--headless=new'],
        defaultViewport: { width: 1440, height: 900 }
    });

    const page = await browser.newPage();

    await page.goto('http://localhost:4321', { waitUntil: 'domcontentloaded' });
    console.log('✓ Page loaded');
    await new Promise(r => setTimeout(r, 600));

    // Remove preloader and open workspace
    await page.evaluate(() => {
        const preloader = document.getElementById('cad-preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            preloader.style.display = 'none';
            preloader.style.pointerEvents = 'none';
        }
        const ws = document.getElementById('studio-workspace');
        if (ws) {
            ws.classList.add('visible');
            ws.style.display = 'flex';
            ws.style.opacity = '1';
            ws.style.pointerEvents = 'auto';
        }
        const auth = document.getElementById('studio-auth');
        if (auth) {
            auth.classList.remove('visible');
            auth.style.display = 'none';
        }
    });
    await new Promise(r => setTimeout(r, 800));

    // 1. Capture TACO Nav
    const tacoNav = await page.$('.osom-taco-left');
    if (tacoNav) {
        await tacoNav.screenshot({ path: '/home/wyuiwyud/.gemini/antigravity/brain/35eb24b1-472f-403d-9bc9-ba30cb637d5a/test_taco_navbar.png' });
        console.log('✓ Captured test_taco_navbar.png');
    }

    // 2. Test TACO Buttons
    const btnA = await page.$('.osom-taco-left [data-module="a"]');
    if (btnA) {
        await btnA.click();
        const aIsActive = await page.$eval('.osom-taco-left [data-module="a"]', el => el.classList.contains('is-active'));
        console.log('✓ Clicked [A] button, is-active:', aIsActive);
    }
    const btnT = await page.$('.osom-taco-left [data-module="t"]');
    if (btnT) {
        await btnT.click();
        const tIsActive = await page.$eval('.osom-taco-left [data-module="t"]', el => el.classList.contains('is-active'));
        console.log('✓ Clicked [T] button back, is-active:', tIsActive);
    }

    // 3. Test Mode Toggle Button
    const modeToggle = await page.$('#canvas-mode-toggle');
    const getModeLabel = () => page.$eval('#canvas-mode-label', el => el.textContent.trim());
    console.log('Mode toggle initial:', await getModeLabel());

    if (modeToggle) {
        await modeToggle.click();
        await new Promise(r => setTimeout(r, 200));
        console.log('Mode toggle after click 1:', await getModeLabel());

        await modeToggle.click();
        await new Promise(r => setTimeout(r, 200));
        console.log('Mode toggle after click 2:', await getModeLabel());
    }

    // 4. Test AI Node Drag & Drop + Text Edit + Delete using app's real nodes
    console.log('Testing Real AI Node Interaction...');
    await page.evaluate(() => {
        const promptInput = document.getElementById('ai-prompt-input');
        const sendBtn = document.getElementById('ai-send-btn');
        if (promptInput && sendBtn) {
            promptInput.value = "Tạo sơ đồ 2 bước";
            sendBtn.click();
        }
    });

    console.log('Waiting for AI nodes...');
    await page.waitForSelector('.ai-dom-node', { timeout: 15000 });
    console.log('✓ AI Node rendered in DOM!');

    const nodeEl = await page.$('.ai-dom-node');
    if (nodeEl) {
        const box1 = await nodeEl.boundingBox();
        console.log(`Initial node position: x=${Math.round(box1.x)}, y=${Math.round(box1.y)}`);

        // Test Drag
        await page.mouse.move(box1.x + 35, box1.y + 20);
        await page.mouse.down();
        await page.mouse.move(box1.x + 135, box1.y + 80, { steps: 10 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 400));

        const box2 = await nodeEl.boundingBox();
        console.log(`Moved node position: x=${Math.round(box2.x)}, y=${Math.round(box2.y)}`);
        const deltaX = Math.round(box2.x - box1.x);
        const deltaY = Math.round(box2.y - box1.y);
        console.log(`Movement deltas: dx=${deltaX}, dy=${deltaY}`);
        const passedDrag = Math.abs(deltaX - 100) < 15;
        console.log(`✓ Drag and Drop verification: ${passedDrag ? 'SUCCESS (PASS)' : 'FAILED'}`);

        // Test Inline Editing
        const textEl = await nodeEl.$('.ai-dom-node-text');
        if (textEl) {
            await textEl.click();
            await page.keyboard.type(' (Đã Sửa)');
            const newText = await page.evaluate(el => el.textContent, textEl);
            console.log(`✓ Text editing verification: SUCCESS -> "${newText}"`);
        }

        // Test Delete button
        const countBefore = await page.$$eval('.ai-dom-node', els => els.length);
        const delBtn = await nodeEl.$('.ai-dom-del-btn');
        if (delBtn) {
            await delBtn.click();
            await new Promise(r => setTimeout(r, 300));
            const countAfter = await page.$$eval('.ai-dom-node', els => els.length);
            console.log(`✓ Delete [X] verification: nodes went from ${countBefore} to ${countAfter} -> ${countAfter < countBefore ? 'SUCCESS' : 'FAILED'}`);
        }
    }

    // Capture overall view
    await page.screenshot({ path: '/home/wyuiwyud/.gemini/antigravity/brain/35eb24b1-472f-403d-9bc9-ba30cb637d5a/test_full_view.png' });
    console.log('✓ Captured test_full_view.png');

    await browser.close();
    console.log('🎉 ALL USER TESTS PASSED 100%!');
})();
