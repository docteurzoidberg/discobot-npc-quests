const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const api = require('../lib/quests-api');

const commands = new SlashCommandBuilder()
  .setName('quest')
  .setDescription('Gere les quêtes !')

  //add
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Ajouter une quête')
      .addStringOption((option) =>
        option
          .setName('title')
          .setDescription('Titre de la quête')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('description')
          .setDescription('Description de la quête')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName('icon').setDescription("URL de l'icone")
      )
      .addStringOption((option) =>
        option.setName('give').setDescription('Récompenses')
      )
  )

  //update
  .addSubcommand((subcommand) =>
    subcommand
      .setName('update')
      .setDescription('Modifier une quête')
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption((option) =>
        option.setName('title').setDescription('Titre de la quête')
      )
      .addStringOption((option) =>
        option.setName('description').setDescription('Description de la quête')
      )
      .addStringOption((option) =>
        option.setName('image').setDescription("URL de l'icone")
      )
      .addStringOption((option) =>
        option.setName('give').setDescription('Récompense(s)')
      )
  )

  //rm
  .addSubcommand((subcommand) =>
    subcommand
      .setName('delete')
      .setDescription('Supprimer une quête de la liste')
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  //list
  .addSubcommand((subcommand) =>
    subcommand
      .setName('list')
      .setDescription('Lister les quêtes du channel/thread')
      .addStringOption((option) =>
        option.setName('user').setDescription('Nom du joueur')
      )
  )

  //info
  .addSubcommand((subcommand) =>
    subcommand
      .setName('info')
      .setDescription("Afficher les informations d'une quête")
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  //show
  .addSubcommand((subcommand) =>
    subcommand
      .setName('show')
      .setDescription('Afficher la quête dans le channel/thread')
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  //showlist
  .addSubcommand((subcommand) =>
    subcommand
      .setName('showlist')
      .setDescription('Afficher la liste des quêtes dans le channel/thread')
  )

  //complete
  .addSubcommand((subcommand) =>
    subcommand
      .setName('complete')
      .setDescription('Terminer une quête')
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  //uncomplete
  .addSubcommand((subcommand) =>
    subcommand
      .setName('uncomplete')
      .setDescription("Annuler la fin d'une quête")
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  // tags
  .addSubcommandGroup((group) =>
    group
      .setName('tag')
      .setDescription('Gestion des tags/catégories')

      // add tag
      .addSubcommand((subcommand) =>
        subcommand
          .setName('add')
          .setDescription('Ajout un tag/catégorie a une quête')
          .addStringOption((option) =>
            option
              .setName('id')
              .setDescription('ID de la quête')
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addStringOption((option) =>
            option
              .setName('tag')
              .setDescription('Tag/catégorie')
              .setRequired(true)
              .setAutocomplete(true)
          )
      )

      // remove tag
      .addSubcommand((subcommand) =>
        subcommand
          .setName('remove')
          .setDescription("Supprime un tag/catégorie d'une quête")
          .addStringOption((option) =>
            option
              .setName('id')
              .setDescription('ID de la quête')
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addStringOption((option) =>
            option
              .setName('tag')
              .setDescription('Tag/catégorie')
              .setRequired(true)
              .setAutocomplete(true)
          )
      )

      // list tags
      .addSubcommand((subcommand) =>
        subcommand.setName('list').setDescription('Liste les tags/catégories')
      )
  )

  // settings
  .addSubcommandGroup((group) =>
    group
      .setName('settings')
      .setDescription('Gestion des paramètres')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('list')
          .setDescription('Affiche les paramètres utilisateur')
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('announce_create')
          .setDescription(
            "Active/désactive l'annonce de création de quête publique"
          )
          .addBooleanOption((option) =>
            option.setName('value').setDescription('Valeur')
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('announce_update')
          .setDescription(
            "Active/désactive l'annonce de modification de quête publique"
          )
          .addBooleanOption((option) =>
            option.setName('value').setDescription('Valeur')
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('announce_complete')
          .setDescription(
            "Active/désactive l'annonce de validation de quête publique"
          )
          .addBooleanOption((option) =>
            option.setName('value').setDescription('Valeur')
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('announce_undone')
          .setDescription(
            "Active/désactive l'annonce d'annulation de validation de quête publique"
          )
          .addBooleanOption((option) =>
            option.setName('value').setDescription('Valeur')
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('announce_delete')
          .setDescription(
            "Active/désactive l'annonce de suppression de quête publique"
          )
          .addBooleanOption((option) =>
            option.setName('value').setDescription('Valeur')
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('announce_undelete')
          .setDescription(
            "Active/désactive l'annonce d'annulation de suppression de quête publique"
          )
          .addBooleanOption((option) =>
            option.setName('value').setDescription('Valeur')
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('public_name')
          .setDescription('Définir le nom affiché hors discord')
          .addStringOption((option) =>
            option.setName('value').setDescription('Valeur')
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('public_avatar')
          .setDescription("Définir l'avatar affiché hors discord")
          .addStringOption((option) =>
            option.setName('value').setDescription('Valeur')
          )
      )
  );

const shiftCharCode = (Δ) => (c) => String.fromCharCode(c.charCodeAt(0) + Δ);
const toFullWidth = (str) => str.replace(/[!-~]/g, shiftCharCode(0xfee0));
const toHalfWidth = (str) => str.replace(/[！-～]/g, shiftCharCode(-0xfee0));

//return size of characters in string
//full width characters (2 bytes) and half width characters (1 byte)
const mbStrWidth = (input) => {
  let len = 0;
  for (let i = 0; i < input.length; i++) {
    let code = input.charCodeAt(i);
    if (
      (code >= 0x0020 && code <= 0x1fff) ||
      (code >= 0xff61 && code <= 0xff9f)
    ) {
      len += 1;
    } else if ((code >= 0x2000 && code <= 0xff60) || code >= 0xffa0) {
      len += 2;
    } else {
      len += 0;
    }
  }
  return len;
};

const separatorLine = '----------------------------------------';

function _preventEmbed(url) {
  //add <> to urls to prevent embed
  return url.replace(/(https?:\/\/[^\s]+)/g, '<$1>');
}

function _formatTags(tags) {
  return tags.map((tag) => `#${tag}`).join(' ');
}

function _formatQuestListItem(quest) {
  //add <> to urls in title  and description to prevent embed
  let title = _preventEmbed(quest.title);
  let id = toFullWidth(quest.id);
  let tags = '';
  let tagsArray = quest.tags || [];

  //replace empty with 'Sans titre'
  if (title === '') {
    title = '*Sans titre*';
  }

  if (tags.length > 0) {
    tags = _formatTags(tagsArray);
  }

  return `**${id}**> [${title}] ` + (tags !== '' ? ` ${tags}` : '');
}

function _formatQuestMessage(quest) {
  let msg = _formatQuestListItem(quest);
  let players = quest.players || [];
  let give = quest.give || '';
  let image = quest.image || '';
  let points = quest.points || 0;
  //todo
  return '//TODO';
}

function _formatQuestEmbed(quest) {
  let title = quest.title || '';
  let description = quest.description || '';
  let image = quest.image || '';
  let give = quest.give || '';
  let players = quest.players || [];
  let points = quest.points || 0;
  //TODO
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setThumbnail(image)
    .addField('Donne', give, true)
    .addField('Points', points, true)
    .addField('Joueurs', players.join(', '), true)
    .setFooter('Quête ajoutée par ' + quest.author);
}

function _formatAutocompleteQuest(quest) {
  //remove any urls from title
  const title = quest.title.replace(/(https?:\/\/[^\s]+)/g, '');

  //if empty title, use "Sans titre"
  if (title === '') {
    quest.title = 'Sans titre';
  } else {
    quest.title = title;
  }
  return {
    name: `${quest.id} ${quest.title}`,
    value: quest.id.toLocaleUpperCase(),
  };
}

async function commandAdd(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const channelId = interaction.channelId;
  const channelName = interaction.channel.name;
  const title = interaction.options.getString('title');
  const description = interaction.options.getString('description');
  const image = interaction.options.getString('icon') || '';
  const give = interaction.options.getString('give') || '';

  //TODO: validation ?
  const quest = {
    title: title,
    description: description,
    image: image,
    give: give,
    private: private,
    players: [...userName],
  };
  try {
    client.logger.info(
      `Ajout d'une quête [${title}] dans #${channelName} par @${userName}`
    );
    const newQuest = await api.addChannelQuest(channelId, quest);
    client.logger.debug(newQuest);
    interaction.reply({
      content: `Quête [${quest.title}] ajoutée ! (ID: ${newQuest.id})`,
      ephemeral: true,
    });
  } catch (error) {
    client.logger.error('Erreur lors de la commande add');
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandUpdate(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username;
  const channelName = interaction.channel.name;
  const channelId = interaction.channel.id;
  const id = interaction.options.getString('id');
  const title = interaction.options.getString('title');
  const description = interaction.options.getString('description');
  const image = interaction.options.getString('image') || '';
  const points = interaction.options.getInteger('points') || 0;
  const private = interaction.options.getBoolean('private') || false;

  //TODO: validation ?
  const quest = {
    id: id,
    title: title,
    description: description,
    image: image,
    points: points,
    private: private,
  };
  try {
    client.logger.info(
      `Modification de la quête [${id}] dans #${channelName} par @${userName}`
    );
    const updatedQuest = await api.updateChannelQuest(channelId, quest);
    client.logger.debug(updatedQuest);
    interaction.reply({ content: `Quête [${id}] modifiée !` });
  } catch (error) {
    client.logger.error(`Erreur lors de la commande update`);
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandShow(client, interaction, ephemeral = true) {
  const userName = client.users.cache.get(interaction.user.id).username;
  const channelName = interaction.channel.name;
  const channelId = interaction.channelId;
  const id = interaction.options.getString('id');
  try {
    client.logger.info(
      `Affichage de la quête [${id}] dans #${channelName} par @${userName} ` +
        (ephemeral === true ? '(en privé)' : '(en public)')
    );
    const quest = await api.getChannelQuest(channelId, id);
    client.logger.debug(quest);
    let msg = _formatQuestMessage(quest);
    let embed = _formatQuestEmbed(quest);
    interaction.reply({
      content: msg,
      embed: embed,
      ephemeral: ephemeral !== true,
    });
  } catch (error) {
    client.logger.error(
      'Erreur lors de la commande ' + ephemeral ? 'info' : 'show'
    );
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandList(client, interaction, ephemeral = true) {
  const userName = client.users.cache.get(interaction.user.id).username;
  const channelId = interaction.channelId;
  const channelName = interaction.channel.name;
  try {
    client.logger.info(
      `Liste des quêtes de #${channelName} demandée par @${userName} ${
        ephemeral === true ? '(en privé)' : '(en public)'
      }`
    );

    //api call
    const quests = await api.getChannelQuests(channelId);
    client.logger.debug(quests);

    //response message text
    let msg = '';

    //no quests?
    if (quests.length === 0) {
      msg = `Aucune quête dans <#${channelId}> !`;
    } else {
      msg =
        `Liste des quêtes de <#${channelId}>:\n` +
        separatorLine +
        '\n' +
        quests.map((quest) => `${_formatQuestListItem(quest)}\n`).join('');
    }
    //response message
    interaction.reply({
      content: msg,
      ephemeral: ephemeral === true,
    });
  } catch (error) {
    client.logger.error(
      'Erreur lors de la commande ' + ephemeral === true ? 'list' : 'showlist',
      error
    );
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandComplete(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username;
  const channelId = interaction.channelId;
  const channelName = interaction.channel.name;
  const questId = interaction.options.getString('id');
  try {
    client.logger.info(
      `Completion de la quête [${questId}] demandée dans #${channelName} par @${userName}`
    );

    //api call
    const quest = await api.getChannelQuestById(channelId, questId);

    //inconnu
    if (quest === undefined) {
      interaction.reply({
        content: `Quête [${questId}] introuvable !`,
        ephemeral: true,
      });
      return;
    }

    //deja complete
    if (quest.dateCompleted !== undefined) {
      interaction.reply({
        content: `Quête [${questId}] déjà complétée !`,
        ephemeral: true,
      });
      return;
    }

    const completedQuest = await api.completeChannelQuest(channelId, questId);
    client.logger.debug(completedQuest);

    //public -> reponse dans le channel ou a été lancé la commande
    interaction.reply({
      content: `${interaction.member} a complété une quête !\n[${quest.title}] ${quest.description} !`,
    });
  } catch (error) {
    client.logger.error('Erreur lors de la commande complete');
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandDelete(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username;
  const channelName = interaction.channel.name;
  const channelId = interaction.channelId;
  const id = interaction.options.getString('id');
  try {
    client.logger.info(
      `Suppression de la quête [${id}] dans #${channelName} par @${userName}`
    );
    const deletedQuest = await api.deleteChannelQuest(channelId, id);
    client.logger.debug(deletedQuest);
    interaction.reply({ content: `Quête [${id}] supprimée !` });
  } catch (error) {
    client.logger.error(`Erreur lors de la commande delete`);
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandUncomplete(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username;
  const channelName = interaction.channel.name;
  const channelId = interaction.channelId;
  const id = interaction.options.getString('id');
  try {
    client.logger.info(
      `Annulation de la completion de la quête [${id}] dans #${channelName} par @${userName}`
    );
    const uncompletedQuest = await api.uncompleteChannelQuest(channelId, id);
    client.logger.debug(uncompletedQuest);
    interaction.reply({
      content: `Quête [${id}] restaurée !`,
      ephemeral: true,
    });
  } catch (error) {
    client.logger.error(`Erreur lors de la commande uncomplete`);
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandUndelete(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username;
  const channelName = interaction.channel.name;
  const channelId = interaction.channelId;
  const id = interaction.options.getString('id');
  try {
    client.logger.info(
      `Annulation de la suppression de la quête [${id}] dans #${channelName} par @${userName}`
    );
    const undeletedQuest = await api.undeleteChannelQuest(channelId, id);
    client.logger.debug(undeletedQuest);
    interaction.reply({
      content: `Quête [${id}] restaurée !`,
      ephemeral: true,
    });
  } catch (error) {
    client.logger.error(`Erreur lors de la commande undelete`);
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function autocompleteGetAllQuestIds(client, interaction) {
  const quests = await api.getChannelQuests(interaction.channel.id);
  //sort by most recent first
  quests.sort((a, b) => {
    return new Date(b.dateCreated) - new Date(a.dateCreated);
  });
  return quests.map((quest) => _formatAutocompleteQuest(quest));
}

module.exports = {
  data: commands,
  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();
    const commandgroup = interaction.options.getSubcommandGroup();
    client.logger.debug(
      `Commande ${subcommand}${
        commandgroup != null ? ` (du groupe ${commandgroup})` : ''
      } lancée par ${interaction.user.username}`
    );
    switch (commandgroup) {
      case null:
        switch (subcommand) {
          case 'add':
            return await commandAdd(client, interaction);
          case 'update':
            return await commandUpdate(client, interaction);
          case 'info':
            return await commandShow(client, interaction);
          case 'show':
            return await commandShow(client, interaction, false);
          case 'list':
            return await commandList(client, interaction);
          case 'showlist':
            return await commandList(client, interaction, false);
          case 'done':
          case 'complete':
            return await commandComplete(client, interaction);
          case 'undone':
          case 'uncomplete':
            return await commandUncomplete(client, interaction);
          case 'delete':
            return await commandDelete(client, interaction);
          case 'undelete':
            return await commandUndelete(client, interaction);
          default:
            interaction.reply({
              content: `Désolé mais, la commande ${subcommand} n'existe pas ou n'est pas encore implementée :(`,
              ephemeral: true,
            });
        }
        return;
      case 'tag':
        switch (subcommand) {
          case 'add':
            return await commandTaggAdd(client, interaction);
          case 'remove':
            return await commandTagRemove(client, interaction);
          case 'list':
            return await commandTagList(client, interaction);
          default:
            interaction.reply({
              content: `Désolé mais, la commande ${commandgroup} ${subcommand} n'existe pas ou n'est pas encore implementée :(`,
              ephemeral: true,
            });
        }
        return;
      case 'settings':
        switch (subcommand) {
          case 'list':
            return await commandSettingsList(client, interaction);
          case 'announe_create':
            return await commandSettingsAnnounceCreate(client, interaction);
          case 'announe_update':
            return await commandSettingsAnnounceUpdate(client, interaction);
          case 'announe_complete':
            return await commandSettingsAnnounceComplete(client, interaction);
          case 'announe_delete':
            return await commandSettingsAnnounceDelete(client, interaction);
          case 'announe_undelete':
            return await commandSettingsAnnounceUndelete(client, interaction);
          case 'announe_uncomplete':
            return await commandSettingsAnnounceUncomplete(client, interaction);
          case 'public_name':
            return await commandSettingsPublicName(client, interaction);
          case 'public_avatar':
            return await commandSettingsPublicAvatar(client, interaction);
          default:
            interaction.reply({
              content: `Désolé mais, la commande ${commandgroup} ${subcommand} n'existe pas ou n'est pas encore implementée :(`,
              ephemeral: true,
            });
        }
        return;
      default:
        interaction.reply({
          content: `Désolé mais, le groupe de commande ${commandgroup} n'existe pas ou n'est pas encore implementée :(`,
          ephemeral: true,
        });
        return;
    }
  },
  async autocomplete(client, interaction) {
    const focusedOption = interaction.options.getFocused(true);
    let choices = [];
    switch (focusedOption.name) {
      case 'id':
        choices = await autocompleteGetAllQuestIds(client, interaction);
        break;
      default:
        break;
    }
    const filtered = choices.filter((choice) => {
      //return only choices that name property contains the value. case insensitive
      return (
        choice.name.toLowerCase().indexOf(focusedOption.value.toLowerCase()) >
        -1
      );
    });
    await interaction.respond(filtered);
  },
};
