const { petSerializer } = require('./pets');

exports.petWalkSerializer = petWalk => ({
  id: petWalk.id,
  address_start: {
    id: petWalk.addressStart.id,
    latitude: petWalk.addressStart.latitude,
    longitude: petWalk.addressStart.longitude,
    description: petWalk.addressStart.description,
  },
  walker: {
    id: petWalk.petWalker.id,
    first_name: petWalk.petWalker.firstName,
    last_name: petWalk.petWalker.lastName,
    email: petWalk.petWalker.email,
    phone: petWalk.petWalker.phone,
  },
  status: petWalk.status,
  start_date: petWalk.startDate,
});

exports.petWalkListSerializer = petWalks => petWalks.map(exports.petWalkSerializer);

exports.completePetWalkSerializer = petWalk => ({
  ...exports.petWalkSerializer(petWalk),
  instructions: petWalk.petWalkInstructions.map(petWalkInstruction => ({
    id: petWalkInstruction.id,
    instruction: petWalkInstruction.instruction,
    address_latitude: petWalkInstruction.addressLatitude,
    address_longitude: petWalkInstruction.addressLongitude,
    address_description: petWalkInstruction.addressDescription,
    position: petWalkInstruction.position,
    done: petWalkInstruction.done,
    pet: petWalkInstruction.petId ? petSerializer(petWalkInstruction.petWalkInstructionPet) : {},
  })),
});
