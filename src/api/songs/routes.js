const routes = (handler) => [
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handler.getSongs(request, h),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request, h) => handler.getSongId(request, h),
  },
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.postNewSong(request, h),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handler.putSongId(request, h),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handler.deleteSongId(request, h),
  },
];

module.exports = routes;
