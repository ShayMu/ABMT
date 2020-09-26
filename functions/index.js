const functions = require('firebase-functions');

exports.healthCheck = functions.https.onRequest((req, res) => {
  return res.send("I'm here to serve");
});

exports.saveSessionInfo = functions.https.onRequest((req, res) => {
  let { email, session, date } = req.body;

  return res.send(JSON.stringify({email, session, date}));
});
