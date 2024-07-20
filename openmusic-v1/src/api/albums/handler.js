const autoBind = require('auto-bind');

class musicAlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);

    this.getAlbumId = this.getAlbumId.bind(this);
    this.postAlbum = this.postAlbum.bind(this);
    this.putAlbumId = this.putAlbumId.bind(this);
    this.deleteAlbumId = this.deleteAlbumId.bind(this);
  }

  async getAlbumId(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      message: 'Data album sukses diambil',
      data: {
        album,
      },
    };
  }

  async postAlbum(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Data album sukses ditambahkan',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async putAlbumId(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const { id } = request.params;

    await this._service.editAlbumId(id, { name, year });

    return {
      status: 'success',
      message: 'Data album sukes diperbarui',
    };
  }

  async deleteAlbumId(request) {
    const { id } = request.params;
    await this._service.deleteAlbumId(id);

    return {
      status: 'success',
      message: 'Data album sukses dihapus',
    };
  }
}

module.exports = musicAlbumsHandler;
