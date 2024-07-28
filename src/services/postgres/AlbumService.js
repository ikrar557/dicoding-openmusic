const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils/albums');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(cacheService) {
    this.pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, year, createdAt],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album baru gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal ditemukan');
    }

    const album = result.rows[0];

    const querySong = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [album.id],
    };

    const songs = await this.pool.query(querySong);

    if (songs.rowCount) {
      album.songs = songs.rows;
    } else {
      album.songs = [];
    }

    return mapDBToModel(album);
  }

  async editAlbumId(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. ID tidak ditemukan');
    }
  }

  async deleteAlbumId(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. ID tidak ditemukan');
    }
  }

  async editAlbumCoverById(id, path) {
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2',
      values: [path, id],
    };
    const result = await this.pool.query(query);

    try {
      if (result.rowCount === 0) {
        throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
      }
    } catch (error) {
      console.error('Error during query execution:', error);
      throw error;
    }
  }

  async addLikeAlbum(albumId, credentialId) {
    const albumLikes = {
      text: 'SELECT * FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, credentialId],
    };

    const like = await this.pool.query(albumLikes);

    if (like.rowCount) {
      throw new InvariantError('Album sudah disukai');
    }

    const id = `albumLikes-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, credentialId],
    };

    await this.pool.query(query);

    await this._cacheService.delete(`album_likes:${id}`);
  }

  async deleteLikeAlbum(albumId, credentialId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, credentialId],
    };
    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus Like, Album belum disukai');
    }

    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async getLikesAlbum(id) {
    try {
      const result = await this._cacheService.get(`album_likes:${id}`);
      return {
        isCache: true,
        result: JSON.parse(result),
      };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM album_likes WHERE album_id = $1',
        values: [id],
      };
      const result = await this.pool.query(query);
      await this._cacheService.set(`album_likes:${id}`, JSON.stringify(result.rowCount), 1800);

      return {
        isCache: false,
        result: result.rowCount,
      };
    }
  }
}

module.exports = AlbumsService;
