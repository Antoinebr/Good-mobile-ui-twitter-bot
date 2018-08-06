require('dotenv').config();

const api = require('./api.js'),
  express = require('express'),
  app = express(),
  Twit = require('twit'),
  config = {

    twitter: {
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET
    }
  },
  T = new Twit(config.twitter);



//
// post a tweet with media
//

app.all("/" + process.env.BOT_ENDPOINT, function (req, res) {


  sendPost()
    .then(r => {

      console.log('Success 👌 ', r);

      res.status(200).send(r);

    })
    .catch(e => {

      console.log('Error 🔥', e);

      res.status(500).send(e.toString());

    });

});



const sendPost = async () => {

  try {


    const screenshot = await api.getScreenshot(90);

    const imgB64 = await api.imageToB64(screenshot.url);

    const tweet = await postMedia(imgB64, `The Mobile web UI Best practice of the day : ${screenshot.caption} : ${screenshot.link}`);

    return tweet;


  } catch (e) {


    console.error('Error', e)

    throw new Error(e);

  };

};



const listener = app.listen(process.env.PORT, function () {

  console.log('The bot is running on port ' + listener.address().port);

});




function postMedia(b64content, caption) {


  return new Promise((resolve, reject) => {  


    // first we must post the media to Twitter
    T.post('media/upload', {

      media_data: b64content

    }, (err, data, response) => {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters

      const mediaIdStr = data.media_id_string

      const meta_params = {
        media_id: mediaIdStr,
        alt_text: {
          text: caption
        }
      }


      T.post('media/metadata/create', meta_params, (err, data, response) => {

        if (err) return reject(err);

        // now we can reference the media and post a tweet (media will attach to the tweet)
        const params = {
          status: caption,
          media_ids: [mediaIdStr]
        }

        T.post('statuses/update', params, (err, data, response) => resolve(data));


      });

    })



  });



}