const functions = require('firebase-functions');
const db = require('./db/db.index');
const cors = require('cors')({origin: true});

exports.healthCheck = functions.https.onRequest((req, res) => {
  return res.send("I'm here to serve");
});

exports.saveSessionInfo = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    let { email, session } = req.body;

    await db.sessions.addSession({email, session});

    return res.send(JSON.stringify({email}));
  });
});
