const functions = require('firebase-functions');

exports.healthCheck = functions.https.onRequest((req, res) => {
  res.send("I'm here to serve");
});
