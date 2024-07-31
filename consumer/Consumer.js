require('dotenv').config();

const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const SongService = require('./SongService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');
const config = require('../src/utils/config');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const songsService = new SongService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, songsService, mailSender);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  channel.consume('export:playlist', listener.listen, { noAck: true });
};

init();
