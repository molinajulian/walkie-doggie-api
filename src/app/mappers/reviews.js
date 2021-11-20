exports.createReviewMapper = req => ({
  score: req.body.score,
  description: req.body.description,
  petWalkId: req.params.pet_walk_id,
});

exports.getReviewsMapper = req => ({
  user: req.user,
  walkerId: req.params.id,
});
