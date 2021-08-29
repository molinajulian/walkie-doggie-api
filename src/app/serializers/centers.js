exports.listCentersSerializer = ({ count, rows }) => ({
  count,
  centers: rows.map(center => ({
    id: center.id,
    name: center.name,
    description: center.description,
    email: center.email,
    phone: center.phone,
    address: {
      id: center.address.id,
      latitude: center.address.latitude,
      longitude: center.address.longitude,
      description: center.address.description,
    },
  })),
});
