const mapDBToModel = ({
  id,
  name,
  songs,
  year,
  createdAt,
  updateAt,
}) => ({
  id,
  name,
  songs,
  year,
  createdAt,
  updateAt,
});

module.exports = { mapDBToModel };
