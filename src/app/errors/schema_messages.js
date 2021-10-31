const { USER_TYPES, DAYS_OF_WEEK, CENTER_TYPES, RESERVATION_STATUS } = require('../utils/constants');

const stringMessage = field => `${field} must be a string`;
const booleanMessage = field => `${field} must be boolean`;
const numberMessage = field => `${field} must be a number`;
const floatMessage = field => `${field} must be a float number`;
const arrayMessage = field => `${field} must be an array`;
const dateMessage = field => `${field} must be a valid date`;
const hourMessage = field => `${field} must be a valid hour`;

const oneOfMessage = (field, values) => `${field} must be one of ${values.join(',')}`;
const containedMessage = location => `and be contained in ${location}`;
const atLeastOneElementMessage = `with at least one element`;

const jwtMessage = (field, location = 'headers') => `${field} must be a jwt token and must be contained in ${location}`;

exports.authorization = jwtMessage('Authorization');
exports.firstName = `${stringMessage('first_name')} ${containedMessage('body')}`;
exports.password = `${stringMessage('password')} ${containedMessage('body')}`;
exports.email = `${stringMessage('email')} ${containedMessage('body')}`;
exports.lastName = `${stringMessage('last_name')} ${containedMessage('body')}`;
exports.userType = `${oneOfMessage('type', Object.values(USER_TYPES))} ${containedMessage('body')}`;
exports.refreshToken = jwtMessage('refresh_token', 'body');
exports.idParam = `${numberMessage('id')} ${containedMessage('the url')}`;
exports.petIdParam = `${numberMessage('petId')} ${containedMessage('the url')}`;

// Onboarding
exports.pricePerHour = `${numberMessage('price_per_hour')} ${containedMessage('body')}`;
exports.phone = `${stringMessage('phone')} ${containedMessage('body')}`;
exports.coverLetter = `${stringMessage('cover_letter')}`;
exports.profilePhotoUri = `${stringMessage('profile_photo_uri')} ${containedMessage('body')}`;
exports.descriptionAddress = `${stringMessage('description')} ${containedMessage('body.address')}`;
exports.latitudeAddress = `${stringMessage('latitude')} ${containedMessage('body.address')}`;
exports.longitudeAddress = `${stringMessage('longitude')} ${containedMessage('body.address')}`;
exports.ranges = `${arrayMessage('ranges')} ${atLeastOneElementMessage} ${containedMessage('body')}`;
exports.dayOfWeek = `${oneOfMessage('day_of_week', Object.values(DAYS_OF_WEEK))} ${containedMessage('body.ranges.*')}`;
exports.startAt = `${hourMessage('start_at')} ${containedMessage('body.ranges.*')}`;
exports.endAt = `${hourMessage('end_at')} ${containedMessage('body.ranges.*')}`;
exports.pets = `${arrayMessage('pets')} ${atLeastOneElementMessage} ${containedMessage('body')}`;
exports.namePet = `${stringMessage('name')} ${containedMessage('body')}`;
exports.breedPet = `${stringMessage('breed')} ${containedMessage('body')}`;
exports.birthYearPet = `${numberMessage('birth_year')} ${containedMessage('body')}`;
exports.genderPet = `${stringMessage('gender')} ${containedMessage('body')}`;
exports.weightPet = `${numberMessage('weight')} ${containedMessage('body')}`;
exports.photoUriPet = `${stringMessage('photo_uri')} ${containedMessage('body')}`;
exports.descriptionPet = `${stringMessage('description')} ${containedMessage('body')}`;

exports.certificationDescription = `${stringMessage('Every description for certifications')} ${containedMessage(
  'body',
)}`;
exports.certificationFileUri = `${stringMessage('Every file_uri for certifications')} ${containedMessage('body')}`;
exports.certifications = `${arrayMessage('certifications')} ${containedMessage('body')}`;
exports.firebaseTokenBody = `${stringMessage('firebase_token')} ${containedMessage('body')}`;
exports.firebaseTokenPath = `${stringMessage('firebase_token')} ${containedMessage('the url')}`;
exports.centerTypeError = `${oneOfMessage('type', Object.values(CENTER_TYPES))} ${containedMessage('query')}`;

exports.walkDate = `${dateMessage('walk_date')} ${containedMessage('body')}`;
exports.rangeId = `${numberMessage('range_id')} ${containedMessage('body')}`;
exports.duration = `${numberMessage('duration')} ${containedMessage('body')}`;
exports.petId = `${numberMessage('pet_id')} ${containedMessage('body')}`;
exports.addressStartDescription = `${stringMessage('address_start -> description')} ${containedMessage('body')}`;
exports.addressStartLatitude = `${stringMessage('address_start -> latitude')} ${containedMessage('body')}`;
exports.addressStartLongitude = `${stringMessage('address_start -> longitude')} ${containedMessage('body')}`;
exports.addressEndDescription = `${stringMessage('address_end -> description')} ${containedMessage('body')}`;
exports.addressEndLatitude = `${stringMessage('address_end -> latitude')} ${containedMessage('body')}`;
exports.addressEndLongitude = `${stringMessage('address_end -> longitude')} ${containedMessage('body')}`;

exports.queryReservationDate = `${dateMessage('date')} ${containedMessage('query')}`;
exports.queryReservationStatus = `${oneOfMessage('status', Object.values(RESERVATION_STATUS))} ${containedMessage(
  'query',
)}`;

exports.completeNameQuery = `${stringMessage('complete_name')} ${containedMessage('query')}`;
exports.scoreQuery = `${floatMessage('score')} ${containedMessage('query')}`;
exports.petWalksAmountQuery = `${numberMessage('pet_walks_amount')} ${containedMessage('query')}`;

exports.complaintDescription = `${stringMessage('description')} ${containedMessage('body')}`;
exports.complaintFileUris = `${arrayMessage('file_uris')} ${containedMessage('body')}`;
exports.complaintFileUrisDescription = `${stringMessage('file_uris -> description')} ${containedMessage('body')}`;

exports.petWalkStartDate = `${dateMessage('start_date')} ${containedMessage('body')}`;
exports.reservationIds = `${arrayMessage('reservation_ids')} ${containedMessage('body')}`;
exports.petWalkReservationId = `${numberMessage('every reservation_id in reservation_ids array')} ${containedMessage(
  'body',
)}`;

exports.bodyReservationStatus = `${oneOfMessage('status', [
  RESERVATION_STATUS.ACCEPTED_BY_OWNER,
  RESERVATION_STATUS.REJECTED_BY_OWNER,
])} ${containedMessage('body')}`;

exports.reservationIdParam = `${numberMessage('reservation_id')} ${containedMessage('the url')}`;
exports.allowsTracking = `${booleanMessage('allows_tracking')} ${containedMessage('body')}`;
exports.latitude = `${stringMessage('latitude')} ${containedMessage('body')}`;
exports.longitude = `${stringMessage('longitude')} ${containedMessage('body')}`;
