// services/fcmService.js
const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (fcmToken, title, body) => {
  const message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log(' Successfully sent notification:', response);
  } catch (error) {
    console.error(' Error sending notification:', error);
  }
};

module.exports = { sendNotification };
