module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    //log interaction
    const type = interaction.isCommand() ? 'a command' : 'an autocomplete';
    client.logger.debug(
      `${interaction.user.tag} in #${interaction.channel.name} triggered ${type} interaction.`
    );

    //commands
    if (interaction.isCommand()) {
      //client.logger.debug('command: ' + interaction.commandName);
      //await interaction.deferReply({ephemeral: false}).catch(()=>{});
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      if (!command.execute) return;
      try {
        await command.execute(client, interaction);
      } catch (error) {
        client.logger.error(error);
        client.logger.debug(error.stack);
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
    //command's autocomplete
    else if (interaction.isAutocomplete()) {
      //client.logger.debug('autocomplete: ' + interaction.commandName);
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      if (!command.autocomplete) return;
      try {
        await command.autocomplete(client, interaction);
      } catch (error) {
        client.logger.error(error);
        client.logger.debug(error.stack);
        //await interaction.reply({ content: 'There was an error while executing autocomplete for this command!', ephemeral: true });
      }
    }
    return;
  },
};
