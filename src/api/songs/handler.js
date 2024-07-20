const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._validator = validator;
    this._service = service;
    autoBind(this);

    this.getSongs = this.getSongs.bind(this);
    this.getSongId = this.getSongId.bind(this);
    this.postNewSong = this.postNewSong.bind(this);
    this.putSongId = this.putSongId.bind(this);
    this.deleteSongId = this.deleteSongId.bind(this);
  }

  async getSongs(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs({ title, performer });

    const response = h.response({
      status: 'success',
      message: 'Semua data lagu berhasil diambil',
      data: {
        songs,
      },
    });

    response.code(200);
    return response;
  }

  async getSongId(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      message: 'Data lagu sesuai ID berhasil diambil',
      data: {
        song,
      },
    };
  }

  async postNewSong(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async putSongId(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    await this._service.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return {
      status: 'success',
      message: 'Data lagu berhasil diperbarui',
    };
  }

  async deleteSongId(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Data lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
