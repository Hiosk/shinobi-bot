const {GuildMember} = require('discord.js');

module.exports = {
  name: 'remove',
  description: 'remover uma música da fila!',
  options: [
    {
      name: 'number',
      type: 4, // 'INTEGER' Type
      description: 'O número da fila que você deseja remover',
      required: true,
    },
  ],
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: 'Você não está em um canal de voz!',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        content: 'Você não está no meu canal de voz!',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return void interaction.followUp({content: '❌ | Nenhuma música está sendo tocada!'});
    const number = interaction.options.get('number').value - 1;
    if (number > queue.tracks.length)
      return void interaction.followUp({content: '❌ | Número de faixa maior que a profundidade da fila!'});
    const removedTrack = queue.remove(number);
    return void interaction.followUp({
      content: removedTrack ? `✅ | Removido **${removedTrack}**!` : '❌ | Algo deu errado!',
    });
  },
};
