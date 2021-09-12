const { Expo } = require('expo-server-sdk');
const { FirebaseToken } = require('../models');
const logger = require('../logger');
const { databaseError, notFound } = require('../errors/builders');
const { moment } = require('../utils/moment');

const expo = new Expo();

exports.deleteFirebaseToken = ({ user, firebaseToken }, options = {}) =>
  FirebaseToken.destroy({ where: { token: firebaseToken, userId: user.id }, ...options })
    .catch(error => {
      logger.error('Error deleting certification, reason:', error);
      throw databaseError(error.message);
    })
    .then(tokensDestroyed => {
      if (!tokensDestroyed) throw notFound('The provided firebase token does not exist');
    });

exports.createFirebaseToken = ({ user, firebaseToken }, options = {}) =>
  FirebaseToken.create({ userId: user.id, token: firebaseToken }, options).catch(error => {
    logger.error('Error creating a firebase token, reason:', error);
    throw databaseError(error.message);
  });

exports.sendReservationCreatedNotification = async ({ user, reservation, range }) => {
  const messages = [];
  const reservationDateFormatted = moment(reservation.date, 'YYYYMMDD').format('L');
  const defaultMessage = {
    title: 'Nueva reserva disponible',
    body:
      `${user.firstName} ${user.lastName} quiere concretar un paseo contigo el día ${reservationDateFormatted} ` +
      `en la franja horaria ${range.startAt} - ${range.endAt} hs`,
    data: { reservationId: reservation.id },
  };
  user.firebaseTokens.forEach(ft => {
    const token = ft.token;
    if (Expo.isExpoPushToken(token)) {
      messages.push({
        ...defaultMessage,
        to: token,
      });
    }
  });
  const messagesChunk = expo.chunkPushNotifications(messages);
  const sendPushNotificationPromises = await Promise.map(
    messagesChunk,
    async messageChunk => {
      return expo.sendPushNotificationsAsync(messageChunk).catch(error => {
        console.log('There was an error sending push notification');
        console.log(error);
      });
    },
    { concurrency: 5 },
  );
  await Promise.all(sendPushNotificationPromises);
};
