const fetch = require('node-fetch');
const striptags = require('striptags');
const fetchb64 = require('fetch-base64');
const he = require('he');


module.exports = {


  getUnpostedScreenshotID: async _ => {

    const data = await fetch(`${process.env.API_URL}/wp-json/twitter-bot/screenshot/random?key=${ process.env.API_KEY }`)

    if (!data.ok) throw new Error(`Can't fetch a random screenshot`);

    const json = await data.json();

    if (typeof json === "undefined") throw new Error(`The random screenshot ID request didn't return any data`);

    return json;


  },



  setScreenshotAsPosted: async id => {


    const data = await fetch(`${process.env.API_URL}/wp-json/twitter-bot/screenshot/posted?id=${id}&key=${ process.env.API_KEY }`);

    if (!data.ok) throw new Error(`Couldn't set the screenshot ${id} as posted`);

    const json = await data.json();

    if (typeof json === "undefined") throw new Error(`Couldn't set the screenshot ${id} as posted, We expected JSON we got undefined`);

    return json;

  },



  getScreenshot: async id => {

    const data = await fetch(`${process.env.API_URL}/wp-json/wp/v2/media?include=${ id }`)

    if (!data.ok) throw new Error(`Can't fetch the screenshot with id : ${id} `);

    const json = await data.json();

    const res = json[0];


    if (typeof res === "undefined") throw new Error(`Can't fetch the screenshot with id : ${id} the ID doesn't exist `);

    if (res.caption.rendered === "") throw new Error(` The caption is empty `);

    if (res.source_url === "") throw new Error(` The URL is empty `);

    if (res.link === "") throw new Error(` There's not post link `);

    res.link = res.link.replace("https://ui.antoinebrossault.com/", "https://thegoodmobileui.com/#/screenshot/");

    return {
      caption: he.decode(striptags(res.caption.rendered).trim()),
      url: res.source_url,
      link: res.link
    }



  },



  imageToB64: async imgURL => {


    const img = await fetchb64.remote(imgURL);

    if (typeof img[0] === "undefined") throw new Error(`Can't fetch the screenshot `);

    return img[0];


  }



}