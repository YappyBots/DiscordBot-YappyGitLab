const Command = require('../Command');

class InviteCommand extends Command {
  constructor(bot) {
    super(bot);

    this.props.help = {
      name: 'invite',
      description: 'get invite link',
      usage: 'invite',
    };
  }

  run(msg) {
    const botInviteLink = `https://discordapp.com/oauth2/authorize?permissions=67193856&scope=bot&client_id=${this.bot.user.id}`;
    const serverInviteLink = 'http://discord.gg/HHqndMG';

    return msg.author
      .send({
        embed: {
          title: 'Yappy, the GitLab Monitor',
          description: [
            '__Invite Link__:',
            `**<${botInviteLink}>**`,
            '',
            '__Official Server__:',
            `**<${serverInviteLink}>**`,
          ].join('\n'),
          color: 0x84f139,
          thumbnail: {
            url: this.bot.user.avatarURL(),
          },
        },
      })
      .then(() =>
        msg.channel.send({
          embed: {
            title: 'Yappy, the GitLab Monitor',
            description: '📬 Sent invite link!',
          },
        })
      );
  }
}

module.exports = InviteCommand;
