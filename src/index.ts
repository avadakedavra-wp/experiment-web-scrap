// const puppeteer = require('puppeteer')
// let extId

// async function main() {
//     const metamaskPath = path.join(__dirname, '/metamask-chrome-10.0.2')
//     const browser = await puppeteer.launch({
//         headless: false,
//         args: [
//             `--disable-extensions-except=${metamaskPath}`,
//             `--load-extension=${metamaskPath}`,
//             `--enable-automation`,
//             `--window-size=1280,720`
//         ]
//     }) 
//     const seed = 'filter shadow option...' // your wallet seed
//     //await initMetaMask(browser, seed, password)
//     await initMetaMask(browser, seed)

//     await loginOpensea(browser)
//     // do whatever u want
//     await browser.close()
// }

// main()

// async function getMetaMaskPage(browser, page = 'notification') {
//     return new Promise((resolve, reject) => {
//         browser.on('targetcreated', async target => {
//             if (target.url().startsWith(`chrome-extension://${extId}/${page}.html`)) {
//                 try {
//                     const page = await target.page()
//                     resolve(page)
//                 } catch (e) {
//                     reject(e)
//                 }
//             } else if (!extId && target.url().startsWith(`chrome-extension://`)) {
//                 try {
//                     const metaMaskExtID = target.url().split('/')[2]
//                     extId = metaMaskExtID

//                     console.log(`Extension ID: ${extId}`)
//                     const page = await target.page()
//                     resolve(page)
//                 } catch (e) {
//                     reject(e)
//                 }
//             }
//         })
//     })
// }
// async function initMetaMask(
//     browser,
//     seed,
//     password = 'password1234'
// ) {
//     const metamaskpage = await getMetaMaskPage(browser, 'home')

//     await metamaskpage.goto(`chrome-extension://${extId}/home.html#initialize/create-password/import-with-seed-phrase`)

//     const seedInput = await metamaskpage.waitForXPath('//*[@id="app-content"]/div/div[3]/div/div/form/div[4]/div[1]/div/input')
//     await seedInput.type(seed)

//     const passwordInput = await metamaskpage.waitForXPath('//*[@id="password"]')
//     await passwordInput.type(password)

//     const confirmPasswordInput = await metamaskpage.waitForXPath('//*[@id="confirm-password"]')
//     await confirmPasswordInput.type(password)

//     const acceptTerms = await metamaskpage.waitForXPath('//*[@id="app-content"]/div/div[3]/div/div/form/div[7]/div')
//     await acceptTerms.click()

//     const importBtn = await metamaskpage.waitForXPath('//*[@id="app-content"]/div/div[3]/div/div/form/button')
//     await importBtn.click()

//     const doneBtn = await metamaskpage.waitForXPath('//*[@id="app-content"]/div/div[3]/div/div/button')
//     await doneBtn.click()

//     const whatsNewClose = await metamaskpage.waitForXPath('//*[@id="popover-content"]/div/div/section/header/div/button')
//     await whatsNewClose.click()

//     await metamaskpage.close()

//     console.log(`Successfully imported account.`)
// }

// async function loginOpensea(browser) {
//     let page = await browser.newPage()
//     await page.goto('https://opensea.io/wallet/locked')
//     let signinBtn = await page.waitForXPath('//*[@id="__next"]/div[1]/main/div/div/div/div[1]/div[2]/button')
//     await signinBtn.click()

//     let notifPage = await getMetaMaskPage(browser, 'notification')
//     let nextBtn = await notifPage.waitForXPath('//*[@id="app-content"]/div/div[3]/div/div[2]/div[4]/div[2]/button[2]')
//     await nextBtn.click()
//     let connBtn = await notifPage.waitForXPath('//*[@id="app-content"]/div/div[3]/div/div[2]/div[2]/div[2]/footer/button[2]')
//     await connBtn.click()

//     await page.close()
//     console.log(`Successfully connected to Opensea.`)
// }

// async function signMessage(browser) {
//     let notifPage = await getMetaMaskPage(browser, 'notification')

//     let signBtn = await notifPage.waitForSelector('[data-testid="request-signature__sign"]')
//     await signBtn.click()
// }
