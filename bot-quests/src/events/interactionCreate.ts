import BotApplication from 'drz-ts-botapplication';
module.exports = {
  name: 'interactionCreate',
  async execute(app: BotApplication, interaction) {
    //log interaction
    const type = interaction.isCommand() ? 'a command' : 'an autocomplete';
    app.logger.debug(
      `${interaction.user.tag} in #${interaction.channel.name} triggered ${type} interaction.`
    );

    //commands
    if (interaction.isCommand()) {
      //client.logger.debug('command: ' + interaction.commandName);
      //await interaction.deferReply({ephemeral: false}).catch(()=>{});
      const command = app.commands.get(interaction.commandName);
      if (!command) return;
      if (!command.execute) return;
      try {
        await command.execute(app, interaction);
      } catch (error: any) {
        app.logger.error(error);
        app.logger.debug(error.stack);
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
    //command's autocomplete
    else if (interaction.isAutocomplete()) {
      //client.logger.debug('autocomplete: ' + interaction.commandName);
      const command = app.commands.get(interaction.commandName);
      if (!command) return;
      if (!command.autocomplete) return;
      try {
        await command.autocomplete(app, interaction);
      } catch (error: any) {
        app.logger.error(error);
        app.logger.debug(error.stack);
        //await interaction.reply({ content: 'There was an error while executing autocomplete for this command!', ephemeral: true });
      }
    }
    return;
  },
};
