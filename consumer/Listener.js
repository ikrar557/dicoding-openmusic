const autoBind = require('auto-bind');

class Listener {
  constructor(playlistsService, songsService, mailSender) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const messageContent = message.content.toString();
      const { playlist, targetEmail } = JSON.parse(messageContent);
      const { id: playlistId } = playlist;

      const fetchedPlaylist = await this._playlistsService.getPlaylistById(playlistId);
      const songs = await this._songsService.getSongsByPlaylist(playlistId);

      const playlistSongs = {
        playlist: {
          ...fetchedPlaylist,
          songs,
        },
      };

      const prettyJson = JSON.stringify(playlistSongs, null, 2);

      const result = await this._mailSender.sendEmail(targetEmail, prettyJson);
      console.log('Email sent result:', result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
