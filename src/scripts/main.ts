import puppeteer, { Page } from "puppeteer";
import fs, { cp } from "fs";


async function handlerContent({ page }: { page: Page }): Promise<boolean> {
    console.log("Waiting for modal to load...");
    const wModal = await page.waitForSelector('.modal-content');
    if (wModal) {
        console.log("Modal found");
        const wBtn = await page.waitForSelector('.btn.btn-secondary');
        if (wBtn) {
            await wBtn.click();

        } else {
            console.log("Button not found");
        }
    } else {
        console.log("Modal not found");
    }

    await page.screenshot({ path: "after-click.png" });
    return true;
}


async function search({ page, input }: { page: Page, input: string }) {
    const wInput = await page.waitForSelector('#key-word', { visible: true });
    if (!wInput) {
        console.log("Input not found");
        return false;
    }
    await wInput.type(input, { delay: 100 });
    await wInput.press("Enter", { delay: 100 });
    return true;
}


async function getCompany({ page }: { page: Page }) {
    const wContent = await page.waitForSelector('.page-content');
    if (wContent) {
        let data = [];
        let rows = await page.$$('.row.g-2');
        for (let row of rows) {
            const cols = await row.$$('.col-6');
            for (let i = 0; i < cols.length; i += 2) {
                const labelCol = cols[i];
                const valueCol = cols[i + 1];
                const labelText = await page.evaluate(el => el.textContent ? el.textContent.trim() : '', labelCol);
                const valueText = await page.evaluate(el => el.textContent ? el.textContent.trim() : '', valueCol);
                if (labelText && valueText) {
                    data.push({
                        label: cleanString(labelText),
                        value: cleanString(valueText)
                    });
                }
            }
        }
        const companyName = await page.$eval('.cac-certified h3', el => el.textContent ? el.textContent.trim() : '');
        const companyRegistrationNumber = await page.$eval('.cac-certified h4', el => el.textContent ? el.textContent.trim() : '');
        const mergedData = {
            companyName: companyName.replace("ชื่อนิติบุคคล : ", "").trim(),
            companyRegistrationNumber: companyRegistrationNumber.replace("เลขทะเบียนนิติบุคคล: ", "").trim(),
            data
        }
        return mergedData;
    } else {
        console.log("Content not found");
    }
    return null;
}

async function main() {
    const companyIds = [
        "0105517005925",
        "0105565084899"
    ]
    let data: ({ companyName: string; companyRegistrationNumber: string; data: { label: string; value: string; }[]; } | null)[] = [];
    await Promise.all(
        companyIds.map(async (companyId) => {
            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null,
                args: ["--start-maximized"],
            });
            const page = await browser.newPage();
            await page.goto("https://datawarehouse.dbd.go.th/index");
            await page.screenshot({ path: "dbd.png" });

            const content = await handlerContent({ page });
            if (!content) {
                console.log("Error");
            }
            const wInput = await page.waitForSelector('#key-word', { visible: true });
            if (!wInput) {
                console.log("Input not found");
            }
            if (wInput) {
                const stateSearch = await search({ page, input: companyId });
                if (stateSearch) {
                    const company = await getCompany({ page });
                    data.push(company);
                    browser.close();
                }
            }
        })
    );
    console.log(data);
}

function cleanString(inputString: string): string {
    return inputString
        .replace(/\n/g, '')
        .replace(/\t/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}



main();



