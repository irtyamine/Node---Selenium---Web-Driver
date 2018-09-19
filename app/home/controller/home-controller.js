require('chromedriver');

const firefox = require('selenium-webdriver/firefox');
const chrome  = require('selenium-webdriver/chrome');
const { Builder, By, Key, until } = require('selenium-webdriver');

const screen = {
  width: 1200,
  height: 1100
};

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options()
  .headless()
  .windowSize(screen))
  .build();


module.exports.getHome = (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Successfully fetched the home page"
  });
};

// delay function
const timeout = ms => new Promise(res => setTimeout(res, ms));

module.exports.searchBrand = async (req, res) => {
  try {
    let domain, facebook, twitter, google, tumblr;

        await driver.get('https://www.namecheckr.com/');
        await driver.findElement(By.id('name')).sendKeys(req.params.brand, Key.RETURN);
        await timeout(3000);

        domain   = await driver.findElement(By.id('com')).getAttribute("href");
        facebook = await driver.findElement(By.id('facebook')).getAttribute("href");
        twitter  = await driver.findElement(By.id('twitter')).getAttribute("href");
        google   = await driver.findElement(By.id('googleplus')).getAttribute("href");
        tumblr   = await driver.findElement(By.id('tumblr')).getAttribute("href");

        return res.status(200).json({
          success  : true,
          message  : "Data has been successfully retrieved",
          result : [
            { domain   : checkIfExist(domain) },
            { facebook : checkIfExist(facebook) },
            { twitter  : checkIfExist(twitter) },
            { google   : checkIfExist(google) },
            { tumblr   : checkIfExist(tumblr) }
          ]
        });
    }
    catch (err) {
      return res.status(500).json(
        {
          error_message:'Exception occurred while processing, details are: ',
          error: err
        });
    }
}

const checkIfExist = data => {
  return data.split('/')[5] === 'view' ? 'Brand already exists' 
  : data.split('/')[5] === 'get' ? 'Brand is available' 
  : 'Brand is invalid';
}

// google signin
module.exports.googleSignin = async (req, res) => {
  try {
    let url = 'https://accounts.google.com/signin';
    let currentUrl;
    await driver.get(url);
    await driver.getCurrentUrl().then(result => currentUrl = result);
    await driver.getTitle().then(result => console.log(result));

    console.log(currentUrl.contains("https://accounts.google.com/signin/v2/identifier?"))

    if(!!currentUrl.contains("https://accounts.google.com/signin/v2/identifier?")){
      await driver.findElement(By.name("identifier"));
      await driver.findElement(By.id("identifierId"));
      await driver.findElement(By.xpath(".//*[@id='identifierId']")).sendKeys('testing.in.slnm@gmail.com', Key.RETURN);
      await timeout(2000);
      await driver.findElement(By.xpath(".//*[@name='password']")).sendKeys('thisismypassword', Key.RETURN);
      // get page title
      await timeout(2000);
      await driver.getTitle().then(result => console.log(result));
    } else {
      await driver.findElement(By.name("Email")).sendKeys("testing.in.slnm@gmail.com");
      await driver.findElement(By.id("next")).click();

      await driver.findElement(By.name("Passwd")).sendKeys("thisismypassword");
      await driver.findElement(By.name("signIn")).click();
      // get page title
      await timeout(2000);
      await driver.getTitle().then(result => console.log(result));
    }

    return res.status(200).json({
      success: true,
      message: "You successfully logged in to gmail using selenium"
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error_message:'Exception occurred while processing, details are: ',
      error: err
    });
  }
}

// google signup
module.exports.googleSignup = async (req, res) => {
  try {
    let url = 'https://accounts.google.com/signup';

    await driver.get(url);
    driver.getCurrentUrl().then(result => console.log(result))


    return res.status(200).json({
      success  : true,
      message  : "Data has been successfully retrieved",
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error_message:'Exception occurred while processing, details are: ',
      error: err
    });
  }
}

// contains function
if (!String.prototype.contains) {
    String.prototype.contains = function(s) {
        return this.indexOf(s) > -1
    }
}