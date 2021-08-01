
// server.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
let browser;
(async() => {
       browser = await puppeteer.launch({
       headless: true,
       executablePath: '/usr/bin/chromium',
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
    let html;
    if (!url || url.length === 0) {
        //return res.json({error: 'url query parameter is reqrequired'
        html = '<head> <meta http-equiv="content-type" content="text/html; charset=utf-8"/><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Courgette&display=swap" rel="stylesheet"> <title></title> </head><div class="container"> <img width="100%" src="https://source.unsplash.com/750x450/?morning%20sky"/> <div class="text"> <div class="text-background"> Good Morning! 🌇 </div></div><style type="text/css" media="all"> body{margin: auto 0; height: 450px; width: 750px;}.container{width: auto; position: relative; text-align: center; padding-top: 60%;}.text{width: 30rem; position: absolute; top: 70%; left: 50%; font-size: 3.4rem; font-family: "Courgette", cursive; transform: translate(-50%, -50%); background: rgba(0,0,0,0.135); color: #fff; display: inline; padding: 0.5rem 1rem; -webkit-box-decoration-break: clone; box-decoration-break: clone; backdrop-filter: blur(3px);}img{position: absolute; top: 0; left: 0; bottom: 0; right: 0;}</style>'
    }

    const imageData = await Screenshot(url, html);

    res.set('Content-Type', 'image/jpeg');
    res.set('Content-Length', imageData.length);
    res.send(imageData);
});

app.listen(process.env.PORT || 4000);




async function Screenshot(url, html) {
   

    const page = await browser.newPage();
    
    if (html) {
      await page.setContent(html);
  const content = await page.$("body");
  const screenData = await content.screenshot({ encoding: 'binary', type: 'jpeg', quality: 70, omitBackground: true });
  
    await page.close();
    // Binary data of an image
    return screenData;
    
 }else {
   
    await page.goto("https://" + url, /*{
      timeout: 10000,
      waitUntil: 'networkidle0',
    }*/);
    const screenData = await page.screenshot({encoding: 'binary', type: 'jpeg', quality: 70});

    await page.close();
    

    // Binary data of an image
    return screenData;
};
}
