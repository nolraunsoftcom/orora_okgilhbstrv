const {JWT} = require('google-auth-library');
const axios = require('axios');
function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const key = require('../files/dcshndi-firebase-adminsdk-fbsvc-63cb3f42a2.json');
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/cloud-platform'],
      null,
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

getAccessToken().then(res => {
  console.log(res); // accessToken

  axios.post(
    'https://fcm.googleapis.com/v1/projects/dcshndi/messages:send',

    {
      message: {
        token:
          'f8pS3dUUQeamew75nfxWu_:APA91bEDK2FMIXjgpusIuCuiKXsS8ZDLiCsoSwDfYXLzF8h1YjVqRTnU0aFc2xkdyFkmYcTonJFYyEWIcKWNJIt1k9ZFAMzIm3ZH1l_KQDSBkNGhYMW5TUQ',
        notification: {
          title: 'test',
          body: 'test',
        },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${res}`,
      },
    },
  );
});
