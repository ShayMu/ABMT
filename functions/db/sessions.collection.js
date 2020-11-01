const fbAdmin = require('firebase-admin');
const { logger } = require('firebase-functions');
const utils = require('../utils');

class Sessions {
    constructor(conn) {
        this.collection = conn.collection('sessions');
    }

    async countUserSessions(email) {
        let dbData = await this.collection.where('email', '==', email).get();
        return dbData.docs.length;
    }

    async addSession({email, session, timestamp}) {
        let userSessionsCount = await this.countUserSessions(email);
        return this.collection.doc().set({timestamp, email, session, sessionNum: userSessionsCount + 1});
    }

    async updateSessionNum() {
        let sessionNum = {};
        let dbData = await this.collection.orderBy('timestamp', 'asc').get();
        
        let promises = [];

        for (let d of dbData.docs) {
            let data = d.data();
            if (!sessionNum[data.email]) sessionNum[data.email] = 1;

            let mySessionNum = sessionNum[data.email];
            sessionNum[data.email]++;
            promises.push(this.collection.doc(d.id).update({sessionNum: mySessionNum})); 
        }

        await Promise.all(promises);
    }

    async getSessions(email) {
        let query = this.collection;
        if (email) query = query.where('email', '==', email);

        let dbData = await query.orderBy('timestamp', 'desc').get();
        let convertedData = dbData.docs.map(doc => {
            let data = doc.data();
            data.date = utils.fromDBTimestamp(data.timestamp);
            delete data.timestamp;
            return data;
        });

        return convertedData;
    }
}


module.exports = Sessions;