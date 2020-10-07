const fbAdmin = require('firebase-admin');
const { logger } = require('firebase-functions');
const utils = require('../utils');

class Sessions {
    constructor(conn) {
        this.collection = conn.collection('sessions');
    }

    async addSession({email, session}) {
        let timestamp = utils.toDBTimestamp(new Date());
        return this.collection.doc().set({timestamp, email, session});
    }

    async getSessions(email) {
        let query = this.collection.where('email', '==', email);

        let dbData = await query.get();

        return dbData.docs.map(doc => {
            let data = doc.data();
            data.date = utils.fromDBTimestamp(data.timestamp);
            delete data.timestamp;
            return data;
        });
    }
}


module.exports = Sessions;