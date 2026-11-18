import puppeteer from 'puppeteer-core';

const chromePath = '/home/wyuiwyud/Tài liệu/ADolSoft/chrome/linux-157.0.8103.78/chrome-linux64/chrome';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1440, height: 900 }
    });
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE_ERROR:', err.message));

    await page.goto('http://localhost:4321', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    // Show workspace
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

    // Trigger AI Agent to generate diagram
    console.log('Sending AI command: "Vẽ quy trình 3 bước"...');
    await page.evaluate(() => {
        const input = document.getElementById('ai-prompt-input');
        const sendBtn = document.getElementById('ai-send-btn');
        if (input && sendBtn) {
            input.value = 'Vẽ quy trình 3 bước';
            sendBtn.click();
        }
    });

    console.log('Waiting for AI response and DOM render...');
    await page.waitForSelector('.ai-dom-node', { timeout: 12000 });

    const nodesInfo = await page.evaluate(() => {
        const nodes = Array.from(document.querySelectorAll('.ai-dom-node')).map(n => ({
            id: n.id,
            badge: n.querySelector('.ai-dom-node-badge')?.textContent,
            text: n.querySelector('.ai-dom-node-text')?.textContent,
            left: n.style.left,
            top: n.style.top
        }));
        const svgLines = document.querySelectorAll('#ai-edges-svg line').length;
        return { nodes, svgLines };
    });
    console.log('Rendered nodes info:', JSON.stringify(nodesInfo, null, 2));

    // Test dragging the first node
    const firstNode = await page.$('.ai-dom-node');
    if (firstNode) {
        const box1 = await firstNode.boundingBox();
        console.log(`Initial position: x=${Math.round(box1.x)}, y=${Math.round(box1.y)}`);

        await page.mouse.move(box1.x + 40, box1.y + 20);
        await page.mouse.down();
        await page.mouse.move(box1.x + 120, box1.y + 60, { steps: 8 });
        await page.mouse.up();

        const box2 = await firstNode.boundingBox();
        console.log(`After drag position: x=${Math.round(box2.x)}, y=${Math.round(box2.y)}`);
        const deltaX = Math.round(box2.x - box1.x);
        const deltaY = Math.round(box2.y - box1.y);
        console.log(`Drag displacement: deltaX=${deltaX}, deltaY=${deltaY} (SUCCESS: ${deltaX > 50})`);
    }

    // Capture screenshot of the center canvas stage with interactive AI elements
    const centerStage = await page.$('#osom-center-stage');
    if (centerStage) {
        await centerStage.screenshot({ path: '/home/wyuiwyud/.gemini/antigravity/brain/35eb24b1-472f-403d-9bc9-ba30cb637d5a/test_canvas_interactive.png' });
        console.log('✓ Captured /home/wyuiwyud/.gemini/antigravity/brain/35eb24b1-472f-403d-9bc9-ba30cb637d5a/test_canvas_interactive.png');
    }

    await browser.close();
    console.log('Test completed successfully!');
})();

