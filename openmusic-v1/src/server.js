require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumService');
const AlbumsValidation = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongService');
const SongsValidation = require('./validator/songs');

const init = async () => {
  const albumService = new AlbumsService();
  const songService = new SongsService();
  const app = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await app.register(
    [
      {
        plugin: albums,
        options: {
          service: albumService,
          validator: AlbumsValidation,
        },
      },
      {
        plugin: songs,
        options: {
          service: songService,
          validator: SongsValidation,
        },
      },
    ],
  );

  app.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await app.start();
  console.log(`Open music application run at ${app.info.uri}`);
};

init();
