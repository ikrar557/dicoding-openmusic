const routs = (handler) => [
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.getAlbumId(request, h),
  },
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbum(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handler.putAlbumId(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request, h) => handler.deleteAlbumId(request, h),
  },
];

module.exports = routs;
