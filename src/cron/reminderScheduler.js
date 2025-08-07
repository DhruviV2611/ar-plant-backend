// cron/reminderScheduler.js

const cron = require('node-cron');
const { sendNotification } = require('../services/fcmService');
const User = require('../models/user');
const Plant = require('../models/plant');

const sendReminderNotifications = async () => {
  const now = new Date();

  const plants = await Plant.find({
    'reminders.date': { $lte: now },
    'reminders.isCompleted': false,
  }).populate('userId');

  for (const plant of plants) {
    const user = plant.userId;
    if (user.fcmToken) {
      const dueReminders = plant.reminders.filter(
        (r) => !r.isCompleted && new Date(r.date) <= now
      );

      for (const reminder of dueReminders) {
        await sendNotification(
          user.fcmToken,
          `Reminder: ${reminder.type} your plant ${plant.name}`,
          `Don't forget to ${reminder.type} your ${plant.name} today!`
        );
      }
    }
  }
};

// Schedule to run every hour (or adjust as needed)
const startReminderScheduler = () => {
  cron.schedule('0 * * * *', () => {
    console.log('🔔 Running reminder notification scheduler...');
    sendReminderNotifications();
  });
};

module.exports = { startReminderScheduler };
