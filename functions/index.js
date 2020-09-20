const functions = require('firebase-functions');


exports.healthCheck = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("I'm here to serve");
});
