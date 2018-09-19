require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const driver = new Builder().forBrowser('chrome').build();

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
		let domain, facebook, twitter;

       	await driver.get('https://www.namecheckr.com/');
       	await driver.findElement(By.id('name')).sendKeys(req.query['brand'], Key.RETURN);
       	await timeout(3000);

       	domain   = await driver.findElement(By.id('com')).getAttribute("href");
       	facebook = await driver.findElement(By.id('facebook')).getAttribute("href");
       	twitter  = await driver.findElement(By.id('twitter')).getAttribute("href");

        //await driver.quit();

        return res.status(200).json({
        	success  : true,
        	message  : "Data has been successfully retrieved",
        	result : [
        		{ domain   : checkIfExist(domain) },
        		{ facebook : checkIfExist(facebook) },
        		{ twitter  : checkIfExist(twitter) },
        	]
        });
    }
    catch (err) {
    	this.driver.switchTo().alert().then((alert) => alert.dismiss());
    	return res.status(500).json(
    		{
    			error_message:'Exception occurred while processing, details are: ',
    			error: err
    		});
        //await driver.quit()
    }
}

const checkIfExist = data => {
	return data.split('/')[5] === 'view' ? true : false;
}


module.exports.googleSignin = async (req, res) => {
  try {
    let url = 'https://accounts.google.com/signin';

    await driver.get(url);
    await driver.findElement(By.xpath(".//*[@id='identifierId']")).sendKeys('testing.in.slnm@gmail.com', Key.RETURN);
    await timeout(2000);
    await driver.findElement(By.xpath(".//*[@name='password']")).sendKeys('thisismypassword', Key.RETURN);

    return res.status(200).json({
      success  : true,
      message  : "You successfully logged in to google",
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error_message:'Exception occurred while processing, details are: ',
      error: err
    });
  }
}