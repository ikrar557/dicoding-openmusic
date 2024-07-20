const mapDBToModel = ({
  id,
  title,
  albumId,
  year,
  genre,
  duration,
  performer,
  createdAt,
  updateAt,
}) => ({
  id,
  title,
  albumId,
  year,
  genre,
  duration,
  performer,
  createdAt,
  updateAt,
});

module.exports = { mapDBToModel };
