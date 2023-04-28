import { time } from 'console';
import { Builder, By, Capabilities } from 'selenium-webdriver';
import dotenv from 'dotenv'
dotenv.config()

const script = "document.querySelectorAll('#page-wrapper > div > div > div > form > div > div > div > table > tbody > tr > td:nth-child(5) > input').forEach( ele => ele.click()); document.querySelectorAll('iframe').forEach(i => i.contentWindow.document.querySelector('#tinymce > p:nth-child(1)').innerText = 'none'); document.querySelectorAll('#page-wrapper > div > div > div > form > div > input')[0].click();";




const LDAP = process.env.LDAP
const LDAP_PASSWORD = process.env.LDAP_PASSWORD


async function openWebsite(url: string) {
    const chromeCapabilities = Capabilities.chrome();
    const chromeOptions = {
        args: ['--start-maximized']
    };
    chromeCapabilities.set('chromeOptions', chromeOptions);

    const driver = await new Builder()
        .withCapabilities(chromeCapabilities)
        .build();

    try {
        await driver.get(url);
    } finally {
        console.log("this is working")
    }


    // filling the details in the login form
    const inputBox = await driver.findElement(By.name('userid'))
    const password = await driver.findElement(By.name('password'));
    await password.sendKeys(LDAP_PASSWORD!)
    await inputBox.sendKeys(LDAP!)

    setTimeout(()=>null, 3000);

    const loginButton = await driver.findElement(By.css("input[type='submit']"))
    await loginButton.click()

    setTimeout(()=>null, 3000);
    driver.get('http://172.16.100.160:8080/ERP_IITJ/courseFeedback.do')

    const children = await driver.findElements(By.css("input[type='submit']"))
    if(children.length == 0){
        console.log("Array is empty"        )
    }
    for(let i = 0; i < children.length; i++){
        const children = await driver.findElements(By.css("input[type='submit']"))
        await children[0].click()   
        await driver.executeScript(script);
    }

    driver.quit()

}

// Usage
openWebsite('http://172.16.100.160:8080/ERP_IITJ/');

