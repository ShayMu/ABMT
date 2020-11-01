const functions = require('firebase-functions');
const sessionsService = require('./services/sessions.service');
const cors = require('cors')({origin: true});

exports.healthCheck = functions.https.onRequest((req, res) => {
  return res.send("I'm here to serve");
});

exports.saveSessionInfo = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    let { email, session } = req.body;

    await sessionsService.addSession({email, session});

    return res.send(JSON.stringify({email}));
  });
});

exports.getSessions = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    let { email } = req.body;

    let result = await sessionsService.getSessions(email);
    res.send(sessionsService.convertSessionsToCSV(result));
  });
});

exports.updateSessionNum = functions.https.onRequest(async (req, res) => {
  res.send(await sessionsService.updateSessionNum());
});
