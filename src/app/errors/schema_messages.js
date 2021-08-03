const { USER_TYPES, DAYS_OF_WEEK } = require('../utils/constants');

const stringMessage = field => `${field} must be a string`;
const numberMessage = field => `${field} must be a number`;
const arrayMessage = field => `${field} must be an array`;
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
