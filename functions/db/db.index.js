class DB {
    constructor() {
        const admin = require('firebase-admin');
        admin.initializeApp();

        this.dbConn = admin.firestore();
        this.sessions = new (require('./sessions.collection'))(this.dbConn);
    }
}

module.exports = new DB();