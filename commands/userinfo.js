module.exports = {
  name: 'userinfo',
  description: 'Obter informações sobre um usuário.',
  options: [
    {
      name: 'user',
      type: 6, //USER TYPE
      description: 'O usuário sobre o qual você deseja obter informações',
      required: true,
    },
  ],
  execute(interaction, client) {
    const member = interaction.options.get('user').value;
    const user = client.users.cache.get(member);

    interaction.reply({
      content: `Nome: ${user.username}, ID: ${user.id}, Avatar: ${user.displayAvatarURL({dynamic: true})}`,
      ephemeral: true,
    });
  },
};
