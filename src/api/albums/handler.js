const autoBind = require('auto-bind');
const config = require('../../utils/config');

class musicAlbumsHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
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

  async postAlbumCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.validateAlbumCoverHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${config.app.host}:${config.app.port}/albums/file/images/${filename}`;
    await this._service.editAlbumCoverById(id, url);

    const response = h.response({
      status: 'success',
      message: 'sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.getAlbumById(id);
    await this._service.addLikeAlbum(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Album disukai',
    });
    response.code(201);
    return response;
  }

  async getLikesAlbumHandler(request, h) {
    const { id } = request.params;
    const { isCache, result } = await this._service.getLikesAlbum(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: result,
      },
    });
    if (isCache) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', 'not-cache');
    }
    return response;
  }

  async deleteLikeAlbumHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.deleteLikeAlbum(id, credentialId);

    return {
      status: 'success',
      message: 'Album batal disukai',
    };
  }
}

module.exports = musicAlbumsHandler;
