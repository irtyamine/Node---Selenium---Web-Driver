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

       	await driver.get('https://www.namecheckr.com/')
       	await driver.findElement(By.id('name')).sendKeys(req.query['brand'], Key.RETURN);

       	await timeout(3000)

       	domain   = await driver.findElement(By.id('com')).getAttribute("href");
       	facebook = await driver.findElement(By.id('facebook')).getAttribute("href");
       	twitter  = await driver.findElement(By.id('twitter')).getAttribute("href");

        await driver.quit()

        return res.status(200).json({
        	message  : "Successfully retrieved",
        	domain   : domain,
        	facebook : facebook,
        	twitter  : twitter,
        	success  : true
        })
    }
    catch (err) {
    	this.driver.switchTo().alert().then((alert) => alert.dismiss());
    	return res.status(500).json(
    		{
    			error_message:'Exception occurred while processing, details are: ',
    			error: err
    		});
        await driver.quit()
    }
}