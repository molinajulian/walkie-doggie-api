const Bluebird = require('bluebird');
const { Expo } = require('expo-server-sdk');
const { FirebaseToken } = require('../models');
const logger = require('../logger');
const { databaseError, notFound } = require('../errors/builders');
const { moment } = require('../utils/moment');

const expo = new Expo();

const sendPushNotifications = async messages => {
  const messagesChunk = expo.chunkPushNotifications(messages);
  const sendPushNotificationPromises = await Bluebird.Promise.map(
    messagesChunk,
    async messageChunk => {
      return expo.sendPushNotificationsAsync(messageChunk).catch(error => {
        console.log('There was an error sending push notification');
        console.log(error);
      });
    },
    { concurrency: 5 },
  );
  const tickets = await Promise.all(sendPushNotificationPromises);
  console.log(tickets);
};

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
  FirebaseToken.findOrCreate({
    where: { userId: user.id, token: firebaseToken },
    defaults: { userId: user.id, token: firebaseToken },
    ...options,
  }).catch(error => {
    logger.error('Error creating a firebase token, reason:', error);
    throw databaseError(error.message);
  });

exports.sendReservationCreatedNotification = async ({ walker, owner, reservation, range }) => {
  const messages = [];
  const reservationDateFormatted = moment(reservation.reservationDate).format('DD/MM/YYYY');
  const rangeStartAt = moment(range.startAt, 'HH:mm:ss').format('HH:mm');
  const rangeEndAt = moment(range.endAt, 'HH:mm:ss').format('HH:mm');
  const defaultMessage = {
    title: 'Nueva reserva disponible',
    body:
      `${owner.firstName} ${owner.lastName} quiere concretar un paseo contigo el día ${reservationDateFormatted} ` +
      `en la franja horaria ${rangeStartAt} - ${rangeEndAt} hs`,
    data: { reservationId: reservation.id },
  };
  walker.firebaseTokens.forEach(ft => {
    const token = ft.token;
    if (Expo.isExpoPushToken(token)) {
      messages.push({
        ...defaultMessage,
        to: token,
      });
    }
  });
  await sendPushNotifications(messages);
};

exports.sendNewPetWalkNotification = async ({ user, reservations }) => {
  const getNewPetWalkNotificationByReservation = ({ reservationDate, startHour, endHour, id }) => {
    const startAt = moment(startHour, 'HH:mm:ss').format('HH:mm');
    const endAt = moment(endHour, 'HH:mm:ss').format('HH:mm');
    return {
      title: 'Nuevo paseo programado',
      body: `${user.firstName} ${user.lastName} ha programado un paseo contigo el día ${moment(reservationDate).format(
        'DD/MM/YYYY',
      )} en la franja horaria ${startAt} - ${endAt} hs. Por favor, póngase en contacto para últimar detalles y confirme su asistencia`,
      data: {
        reservationId: id,
      },
    };
  };
  const messages = [];
  console.log(messages);
  reservations.forEach(reservation => {
    reservation.reservationOwner.firebaseTokens.forEach(ft => {
      const message = getNewPetWalkNotificationByReservation(reservation);
      const token = ft.token;
      if (Expo.isExpoPushToken(token)) {
        messages.push({
          ...message,
          to: token,
        });
      }
    });
  });
  await sendPushNotifications(messages);
};
