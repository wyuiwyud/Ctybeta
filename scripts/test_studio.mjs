import puppeteer from 'puppeteer-core';

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--headless=new'],
            defaultViewport: { width: 1440, height: 900 }
        });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
        page.on('pageerror', err => console.log('BROWSER_ERR:', err.message));

        await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
        console.log('Page loaded successfully');

        // Check if studio-workspace is visible or open it
        await page.evaluate(() => {
            const studio = document.getElementById('studio-workspace');
            if (studio) {
                studio.classList.add('visible');
                studio.style.display = 'flex';
            }
        });

        await new Promise(r => setTimeout(r, 1000));

        // Take screenshot of current studio workspace
        await page.screenshot({ path: '/home/wyuiwyud/.gemini/antigravity/brain/35eb24b1-472f-403d-9bc9-ba30cb637d5a/test_studio_full.png' });
        console.log('Full studio screenshot saved');

        // Take a crop of osom-floating-nav (T A C O)
        const navEl = await page.$('.osom-floating-nav');
        if (navEl) {
            await navEl.screenshot({ path: '/home/wyuiwyud/.gemini/antigravity/brain/35eb24b1-472f-403d-9bc9-ba30cb637d5a/test_taco_nav.png' });
            console.log('T A C O nav screenshot saved');
        } else {
            console.log('Could not find .osom-floating-nav');
        }

        await browser.close();
    } catch (e) {
        console.error('Puppeteer error:', e);
        process.exit(1);
    }
})();
