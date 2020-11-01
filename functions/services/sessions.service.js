const db = require('../db/db.index');
const utils = require('../utils');

class SessionsService {
    constructor() {
    }

    async addSession({email, session}) {
        let timestamp = utils.toDBTimestamp(new Date());
        return db.sessions.addSession({timestamp, email, session});
    }

    async updateSessionNum() {
        return db.sessions.updateSessionNum();
    }

    async getSessions(email) {
        return db.sessions.getSessions(email);
    }

    convertSessionsToCSV(sessions) {
        const headline = 'Email,Date,Session Number,Round,Is Correct,Response Time,Picture Id,Probe Behind,Probe Position,Probe Direction';

        let csvContent = '';
        for (let s of sessions) {
            csvContent += '\r\n';  
            for (let r of s.session) {
                csvContent += `${s.email},${s.date.toISOString()},${s.sessionNum},${r.roundNum},${r.isCorrect},${r.responseTime},${r.pictureId},${r.probeBehind},${r.probePos},${r.probeDir}\r\n`;
            }
            csvContent = csvContent.substr(0, csvContent.length - 2);
        }

        return headline + csvContent;
    }
}

module.exports = new SessionsService();