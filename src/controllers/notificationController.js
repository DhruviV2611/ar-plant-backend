// src/controllers/notificationController.js
const path = require('path');
const admin = require('firebase-admin');
const User = require('../models/user');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;


if (!serviceAccountPath) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set in .env");
}

const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// New function to save the FCM token
exports.saveFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id; // Get user ID from the authenticated request

    if (!fcmToken) {
      return res.status(400).json({ message: 'FCM token is required.' });
    }

    await User.findByIdAndUpdate(userId, { fcmToken });

    res.status(200).json({ message: 'FCM token saved successfully.' });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    res.status(500).json({ message: 'Failed to save FCM token.', error: error.message });
  }
};

exports.sendTestNotification = async (req, res) => {
  try {
    const userFromDb = await User.findById(req.user.id);
    const fcmToken = userFromDb?.fcmToken;

    if (!fcmToken) {
      return res.status(400).json({ message: 'FCM token not found for user.' });
    }
    const message = {
      notification: {
        title: 'Test Notification',
        body: 'This is a test notification from AR Plant App!',
      },
      data: {
        title: 'Test Notification',
        body: 'This is a test notification from AR Plant App!',
      },
      token: fcmToken,
    };
    await admin.messaging().send(message);

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    if (error.code) {
      res.status(500).json({
        message: `Failed to send notification: ${error.message}`,
        firebaseErrorCode: error.code
      });
    } else {
      res.status(500).json({ message: 'Failed to send notification', error: error.message });
    }
  }
};