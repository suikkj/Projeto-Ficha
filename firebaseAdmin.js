const admin = require('firebase-admin');
const serviceAccount = require('./historiaarquipelagosite-firebase-adminsdk-ssrcb-14641a712f.json');
const { model } = require('mongoose');


if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'historiaarquipelagosite.firebasestorage.app'
    });
}

const bucket = admin.storage().bucket();

module.exports = {admin, bucket};