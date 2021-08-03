
// server.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
let browser;
(async() => {
       browser = await puppeteer.launch({
       headless: true,
       executablePath: '/usr/bin/chromium-browser',
       args: [
       "--no-sandbox",
       "--disable-gpu",
       ]
   });
 console.log("browser launched!")
})();

// /?url=https://google.com
app.get('/', async function(req, res) {
    const {url} = req.query;
    let {text} = req.query;
    let {img} = req.query;
    console.log(url)
    console.log(text)
    console.log(img)
    if ((!url || url.length === 0) && (!text || text.length === 0)) {
      
           text = "No Content";
           img =  "landscape";
    }
    


    const imageData = await Screenshot(url, text, img);

    res.set('Content-Type', 'image/jpeg');
    res.set('Content-Length', imageData.length);
    res.send(imageData);
});

app.listen(process.env.PORT || 4000);




async function Screenshot(url, text, img) {
   
const html = '<head> <meta http-equiv="content-type" content="text/html; charset=utf-8"/><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Courgette&display=swap" rel="stylesheet"> <title></title> </head><div class="container"> <img width="100%" src="https://source.unsplash.com/750x450/?' + img + '"/> <div class="text"> <div class="textContent">' + text + '</div></div><style type="text/css" media="all"> body{margin: auto 0; height: 400px; width: 750px;}.container{width: auto; position: relative; text-align: center; padding-top: 60%;}.text{position: absolute; top: 70%; left: 50%; width: 75%; transform: translate(-50%, -70%);}.textContent{font-size: 3rem; font-family: Cursive; background: rgb(120,141,233);background: linear-gradient(60deg, rgba(120,141,233,0.4) 0%, rgba(78,129,212,0.4) 49%, rgba(71,187,210,0.4) 100%); color: #fff; margin: 0 0; line-height: 4.1rem; padding: .5rem 1rem; backdrop-filter: blur(3px); display: inline; -webkit-box-decoration-break: clone; box-decoration-break: clone;}img{position: absolute; top: 0; left: 0; bottom: 0; right: 0;}</style>'


    const page = await browser.newPage();
    
    if (text) {
      await page.setContent(html);
  const content = await page.$("body");
  const screenData = await content.screenshot({ encoding: 'binary', type: 'jpeg', quality: 70, omitBackground: true });
  
    await page.close();
    // Binary data of an image
    return screenData;
    
 }else {
   
    await page.goto("https://" + url, {
      timeout: 100000,
      waitUntil: 'networkidle0',
    });
    const screenData = await page.screenshot({encoding: 'binary', type: 'jpeg', quality: 70});

    await page.close();
    

    // Binary data of an image
    return screenData;
};
}
