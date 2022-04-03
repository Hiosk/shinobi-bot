const {
  GuildMember
} = require('discord.js');

module.exports = {
  name: 'mover',
  description: 'mover a posição da música na fila!',
  options: [{
      name: 'musica',
      type: 4, // 'INTEGER' Type
      description: 'O número da musica que você deseja mover',
      required: true,
    },
    {
      name: 'posicao',
      type: 4, // 'INTEGER' Type
      description: 'A posição para movê-lo para',
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
    if (!queue || !queue.playing) return void interaction.followUp({
      content: '❌ | Nenhuma música está sendo tocada!'
    });
    const queueNumbers = [interaction.options.get('musica').value - 1, interaction.options.get('posicao').value - 1];
    if (queueNumbers[0] > queue.tracks.length || queueNumbers[1] > queue.tracks.length)
      return void interaction.followUp({
        content: '❌ | Número de faixa maior que a profundidade da fila!'
      });

    try {
      const track = queue.remove(queueNumbers[0]);
      queue.insert(track, queueNumbers[1]);
      return void interaction.followUp({
        content: `✅ | **${track}** movida!`,
      });
    } catch (error) {
      console.log(error);
      return void interaction.followUp({
        content: '❌ | Algo deu errado!',
      });
    }
  },
};