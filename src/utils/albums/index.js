const mapDBToModel = ({
  id,
  name,
  songs,
  year,
  coverUrl,
  createdAt,
  updateAt,
}) => ({
  id,
  name,
  songs,
  year,
  coverUrl,
  createdAt,
  updateAt,
});

module.exports = { mapDBToModel };
