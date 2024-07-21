const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getActivitiesById(id) {
    const queryPlaylist = {
      text: `
      SELECT u.username, s.title, a.action, a.time
      FROM playlist_activities a
      LEFT JOIN users u ON a.user_id = u.user_id
      LEFT JOIN songs s ON a.song_id = s.id
      WHERE a.playlist_id = $1
    `,
      values: [id],
    };

    const result = await this._pool.query(queryPlaylist);
    return result.rows;
  }

  async verifyPlaylistAccess(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE playlist_id = $1',
      values: [id],
    };
    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini.');
    }
  }
}

module.exports = ActivitiesService;
