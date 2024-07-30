const { Pool } = require('pg');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT playlist_id, name FROM playlists WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = SongsService;
