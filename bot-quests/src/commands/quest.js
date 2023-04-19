const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const api = require('../lib/quests-api');
const helpers = require('../lib/discobot-helpers');

const commands = new SlashCommandBuilder()
  .setName('quest')
  .setDescription('Gere les quêtes !')

  //add
  .addSubcommand((subcommand) =>
    subcommand
      .setName('create')
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

  //delete
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

  //undelete
  .addSubcommand((subcommand) =>
    subcommand
      .setName('undelete')
      .setDescription("Annuler la suppression d'une quête")
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
        option
          .setName('user')
          .setDescription('Filter par nom du joueur')
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addStringOption((option) =>
        option
          .setName('tag')
          .setDescription('Filtrer par tag/catégorie')
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addStringOption((option) =>
        option
          .setName('channel')
          .setDescription(
            'Choisir un autre channel/thread que celui de la commande'
          )
          .setRequired(false)
          .setAutocomplete(true)
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
          .setName('announce_uncomplete')
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

const separatorLine = '----------------------------------------';

const _formatTag = (tag) => `🏷*${tag.toLocaleUpperCase()}*`;

const _formatTags = (tags) => {
  return tags.map((tag) => _formatTag(tag)).join(' ');
};

const _formatQuestId = (questId) => {
  return `**${helpers.toFullWidthString(questId)}**`;
};

const _formatQuestListItem = (quest) => {
  //add <> to urls in title  and description to prevent embed
  let title = helpers.preventEmbed(quest.title);
  let tagsArray = quest.tags || [];

  //replace empty with 'Sans titre'
  if (title === '') {
    title = '*Sans titre*';
  }

  const showId = true; //todo
  const questId = showId ? `${_formatQuestId(quest.id)}>` : '';
  // complete or incomplete
  const questCompleted = quest.dateCompleted ? '☑' : '☐';
  // lock if private
  const questPrivate = quest.private ? ' 🔒' : '';

  // strike through if completed
  const striked = quest.dateCompleted ? '~~' : '';
  const tagsText = tagsArray.length > 0 ? ` ${_formatTags(tagsArray)}` : '';

  return `${questId}${questCompleted} ${striked}[${title}]${tagsText}${striked}`;
};

function _formatQuestMessage(quest) {
  let msg = _formatQuestListItem(quest);
  let players = quest.players || [];
  let give = quest.give || '';
  let image = quest.image || '';
  //todo
  return '';
}

function _formatQuestEmbed(quest) {
  let title = quest.title || '*Sans titre*';
  let description = quest.description || '*Aucune description*';
  let image = quest.image || '';
  let give = quest.give || '';
  let players = quest.players || [];

  const color = quest.dateCompleted ? 0x00ff00 : 0x0000ff;
  const footerStatus = quest.dateCompleted ? '✅ Accompli par' : '✎ Crée par';
  const footerPrivate = quest.private ? ' 🔒' : '';
  const footer = `${footerStatus} ${players
    .map((player) => player)
    .join(', ')}${footerPrivate}`;

  const timestamp =
    quest.dateCompleted != null
      ? helpers.parseDate(quest.dateCompleted)
      : helpers.parseDate(quest.dateCreated);

  //TODO

  //set thumbnail to image if image is set only
  let msgEmbed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    //.addField('Donne', give, true)
    //.addField('Points', points, true)
    //.addField('Joueurs', players.join(', '), true)
    .setColor(color)
    .setFooter({ text: footer })
    .setTimestamp(timestamp);

  if (quest.dateCompleted) {
    msgEmbed.addFields(
      {
        name: 'Créé',
        value: `${helpers.formatEmbedFieldDate(quest.dateCreated)}`,
        inline: true,
      },
      {
        name: 'Accomplie',
        value: `${helpers.formatEmbedFieldDate(quest.dateCompleted)}`,
        inline: true,
      }
    );
  }

  if (image !== '') {
    msgEmbed.setImage(image);
  }

  return msgEmbed;
}

function _formatQuestTitle(title) {
  let questTitle = title || '';
  //if empty title, use "Sans titre"
  if (questTitle === '') {
    questTitle = '*Sans titre*';
  }
  return `[${helpers.preventEmbed(questTitle)}]`;
}

function _formatAutocompleteQuest(quest) {
  let questTitle = quest.title || '';
  //if empty title, use "Sans titre"
  if (questTitle === '') {
    questTitle = '*Sans titre*';
  }
  const title = helpers.preventEmbed(questTitle);
  return {
    name: `${quest.id} ${title}`,
    value: quest.id.toLocaleUpperCase(),
  };
}

async function commandAdd(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const userId = interaction.user.id;
  const channelId = interaction.channelId;
  const channelName = interaction.channel.name;
  const title = interaction.options.getString('title');
  const description = interaction.options.getString('description');
  const image = interaction.options.getString('icon') || '';
  const give = interaction.options.getString('give') || '';
  const private = interaction.options.getBoolean('private') || false;

  //TODO: validation ?
  const quest = {
    createdBy: {
      id: userId,
      name: userName,
    },
    title: title,
    description: description,
    image: image,
    give: give,
    private: private,
    players: [userId],
  };

  try {
    client.logger.info(
      `Ajout d'une quête ${_formatQuestTitle(
        title
      )} dans ${helpers.formatChannelName(
        channelName
      )} par ${helpers.formatUsername(userName)}`
    );
    const newQuest = await api.createChannelQuest(channelId, quest);
    client.logger.debug(newQuest);
    interaction.reply({
      content: `Quête ${_formatQuestTitle(quest.title)} ajoutée ! (ID: ${
        newQuest.id
      })`,
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

  //required
  const id = interaction.options.getString('id');

  //optional
  const title = interaction.options.getString('title') || false;
  const description = interaction.options.getString('description') || false;
  const give = interaction.options.getString('give') || false;
  const image = interaction.options.getString('image') || false;
  const private = interaction.options.getBoolean('private') || false;

  try {
    client.logger.info(
      `Modification de la quête [${id}] dans ${helpers.formatChannelName(
        channelName
      )} par ${helpers.formatUsername(userName)}`
    );

    //only provide fields which are not false
    //const quest = {};
    const quest = await api.getChannelQuestById(channelId, id);
    if (title !== false) {
      quest.title = title;
    }
    if (description !== false) {
      quest.description = description;
    }
    if (give !== false) {
      quest.give = give;
    }
    if (image !== false) {
      quest.image = image;
    }
    if (private !== false) {
      quest.private = private;
    }

    const updatedQuest = await api.updateChannelQuest(channelId, id, quest);
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
      `Affichage de la quête [${id}] dans ${helpers.formatChannelName(
        channelName
      )} par ${helpers.formatUsername(userName)} ` +
        (ephemeral === true ? '(en privé)' : '(en public)')
    );
    const quest = await api.getChannelQuestById(channelId, id);
    client.logger.debug(quest);
    let msg = `${interaction.member} souhaite vous montrer cette quête:`;
    let embed = _formatQuestEmbed(quest);
    interaction.reply({
      content: msg,
      embeds: [embed],
      ephemeral: ephemeral === true,
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

  let channelId = interaction.channelId;
  let channelName = interaction.channel.name;

  //options
  const byuser = interaction.options.getString('user') || false;
  const bychannel = interaction.options.getString('channel') || false;
  const bytag = interaction.options.getString('tag') || false;

  if (bychannel !== false) {
    const channel = client.channels.cache.find(
      (channel) => channel.id === bychannel
    );
    if (channel.partial) await channel.fetch();

    channelId = bychannel;
    channelName = channel.name;
  }

  try {
    client.logger.info(
      `Liste des quêtes de ${helpers.formatChannelName(
        channelName
      )} demandée par ${helpers.formatUsername(userName)} ${
        ephemeral === true ? '(en privé)' : '(en public)'
      }`
    );

    //api call
    const questsAll = await api.getChannelQuests(channelId);

    //filter deleted
    const quests = questsAll.filter((quest) => !quest.dateDeleted);

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
      `Validation de la quête [${questId}] demandée dans ${helpers.formatChannelName(
        channelName
      )} par ${helpers.formatUsername(userName)}`
    );

    //api call parralel
    //const quest = await api.getChannelQuestById(channelId, questId);
    //const userSettings = await api.getUserSettings(interaction.user.id);
    const [quest, userSettings] = await Promise.all([
      api.getChannelQuestById(channelId, questId),
      api.getUserSettings(interaction.user.id),
    ]);

    //inconnu
    if (quest === undefined) {
      interaction.reply({
        content: `Quête [${questId}] introuvable !`,
        ephemeral: true,
      });
      return;
    }

    //deja complete
    if (quest.dateCompleted) {
      interaction.reply({
        content: `Quête [${questId}] déjà terminée !`,
        ephemeral: true,
      });
      return;
    }

    const completedQuest = await api.completeChannelQuest(channelId, questId);
    client.logger.debug(completedQuest);

    //private or no annouce = reply to user. else to channel

    const isPrivate = quest.private || userSettings.ANNOUNCE_COMPLETE === false;
    if (isPrivate) {
      //private -> reponse en privé
      interaction.reply({
        content: `Quête ${_formatQuestId(id)} ${_formatQuestTitle(
          undeletedQuest.title
        )} terminée !`,
        ephemeral: true,
      });
    } else {
      //public -> reponse dans le channel ou a été lancé la commande
      interaction.reply({
        content: `${interaction.member} a terminé une quête !`,
        embeds: [_formatQuestEmbed(completedQuest)],
      });
    }
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
      `Suppression de la quête [${id}] dans ${helpers.formatChannelName(
        channelName
      )} par ${helpers.formatUsername(userName)}`
    );
    const deletedQuest = await api.deleteChannelQuest(channelId, id);
    client.logger.debug(deletedQuest);
    interaction.reply({
      content: `Quête ${_formatQuestId(id)} ${_formatQuestTitle(
        deletedQuest.title
      )} supprimée !`,
    });
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
      `Invalidation de la quête [${id}] dans ${helpers.formatChannelName(
        channelName
      )} par ${helpers.formatUsername(userName)}`
    );
    const uncompletedQuest = await api.uncompleteChannelQuest(channelId, id);
    client.logger.debug(uncompletedQuest);
    interaction.reply({
      content: `Quête ${_formatQuestId(id)} ${_formatQuestTitle(
        uncompletedQuest.title
      )} invalidée !`,
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
      `Annulation de la suppression de la quête [${id}] dans ${helpers.formatChannelName(
        channelName
      )} par ${helpers.formatUsername(userName)}`
    );
    const undeletedQuest = await api.undeleteChannelQuest(channelId, id);
    client.logger.debug(undeletedQuest);
    interaction.reply({
      content: `Quête ${_formatQuestId(id)} ${_formatQuestTitle(
        undeletedQuest.title
      )} restaurée !`,
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

async function autocompleteGetDeletableQuestIds(client, interaction) {
  const quests = await api.getChannelQuests(interaction.channel.id);
  //sort by most recent first
  quests.sort((a, b) => {
    return new Date(b.dateCreated) - new Date(a.dateCreated);
  });
  return quests
    .filter(
      (quest) => quest.dateDeleted === undefined || quest.dateDeleted === null
    )
    .map((quest) => _formatAutocompleteQuest(quest));
}

async function autocompleteGetDeletedQuestIds(client, interaction) {
  const quests = await api.getChannelQuests(interaction.channel.id);
  //sort by most recent first
  quests.sort((a, b) => {
    return new Date(b.dateCreated) - new Date(a.dateCreated);
  });
  return quests
    .filter((quest) => quest.dateDeleted)
    .map((quest) => _formatAutocompleteQuest(quest));
}

async function autocompleteGetCompletableQuestIds(client, interaction) {
  const quests = await api.getChannelQuests(interaction.channel.id);
  //sort by most recent first
  quests.sort((a, b) => {
    return new Date(b.dateCreated) - new Date(a.dateCreated);
  });
  return quests
    .filter(
      (quest) =>
        quest.dateCompleted === undefined || quest.dateCompleted === null
    )
    .map((quest) => _formatAutocompleteQuest(quest));
}

async function autocompleteGetCompletedQuestIds(client, interaction) {
  const quests = await api.getChannelQuests(interaction.channel.id);
  //sort by most recent first
  quests.sort((a, b) => {
    return new Date(b.dateCreated) - new Date(a.dateCreated);
  });
  return quests
    .filter((quest) => quest.dateCompleted !== undefined)
    .map((quest) => _formatAutocompleteQuest(quest));
}

function _formatAutocompleteChannel(channel) {
  return {
    name: `#${
      channel.name.length > 24
        ? channel.name.substring(0, 21) + '...'
        : channel.name
    }}`,
    value: channel.id,
  };
}

//return all current interaction guild 's channels with at least one quest
async function autocompleteGetAllChannelsWithQuests(client, interaction) {
  const channelsIdWithQuests = await api.getChannelsWithQuests();
  const channels = channelsIdWithQuests.map(async (channelId) => {
    const channel = client.channels.cache.get(channelId);
    if (channel.partial) {
      await channel.fetch();
    }
    return _formatAutocompleteChannel(channel);
  });
  return channels;
}

//return all current interaction guild 's channels
async function autocompleteGetAllChannels(client, interaction) {
  //get current interaction guild 's channels list
  const channels = client.channels.cache.filter(async (channel) => {
    //filter channels
    return (
      channel.type === 0 && //text channel
      interaction.guild.id === channel.guildId //same guild
    );
  });
  return channels.map((channel) => _formatAutocompleteChannel(channel));
}

function _formatAutocompleteUser(user) {
  return {
    name: user.username,
    value: user.id,
  };
}

async function autocompleteGetAllUsers(client, interaction) {
  const users = client.users.cache;
  return users.map(async (user) => {
    //need fetch ?
    if (user.partial) {
      await user.fetch();
    }
    _formatAutocompleteUser(user);
  });
}

//format user settings for display in message
/*
Annoncer:
✅ **Création**
❌ **Modification**
❌ **Validation**
❌ **Annulation de validation**
❌ **Suppression**
❌ **Annulation de suppression**
Public:
**Nom**: John Zoidberg
**Avatar**: <https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.png>
*/

const formatSettings = (settings) => {
  const announceCreate = settings.ANNOUNCE_CREATE ? '✅' : '❌';
  const announceUpdate = settings.ANNOUNCE_UPDATE ? '✅' : '❌';
  const announceComplete = settings.ANNOUNCE_COMPLETE ? '✅' : '❌';
  const announceUncomplete = settings.ANNOUNCE_UNCOMPLETE ? '✅' : '❌';
  const announceDelete = settings.ANNOUNCE_DELETE ? '✅' : '❌';
  const announceUndelete = settings.ANNOUNCE_UNDELETE ? '✅' : '❌';
  const announceSettingsText = `Annoncer:\n${announceCreate} **Création**\n${announceUpdate} **Modification**\n${announceComplete} **Validation**\n${announceUncomplete} **Annulation de validation**\n${announceDelete} **Suppression**\n${announceUndelete} **Annulation de suppression** `;
  const publicSettingsText = `Public:\n**Nom**: ${settings.PUBLIC_NAME}\n**Avatar**: ${settings.PUBLIC_AVATAR}`;
  return `${announceSettingsText}\n\n${publicSettingsText}`;
};

async function commandSettingsAnnounceCreate(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_CREATE = value;
    await api.setUserSettings(interaction.user.id, settings);
    interaction.reply({
      content: `Paramètre ANNOUNCE_CREATE mis à jour sur ${value
        .toString()
        .toLocaleUpperCase()}!`,
      ephemeral: true,
    });
    const loggerMsg = `User ${
      interaction.member
    } set ANNOUNCE_CREATE setting to ${value.toString().toLocaleUpperCase()}`;
    client.logger.info(loggerMsg);
  } catch (error) {
    client.logger.error(error);
  }
}

async function commandSettingsAnnounceUpdate(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_UPDATE = value;
    await api.setUserSettings(interaction.user.id, settings);
    interaction.reply({
      content: `Paramètre ANNOUNCE_UPDATE mis à jour sur ${value
        .toString()
        .toLocaleUpperCase()}!`,
      ephemeral: true,
    });
    const loggerMsg = `User ${
      interaction.user.username
    } set ANNOUNCE_UPDATE setting to ${value.toString().toLocaleUpperCase()}`;
    client.logger.info(loggerMsg);
  } catch (error) {
    client.logger.error(error);
  }
}

async function commandSettingsAnnounceComplete(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_COMPLETE = value;
    await api.setUserSettings(interaction.user.id, settings);
    interaction.reply({
      content: `Paramètre ANNOUNCE_COMPLETE mis à jour sur ${value
        .toString()
        .toLocaleUpperCase()}!`,
      ephemeral: true,
    });
    const loggerMsg = `User ${
      interaction.member
    } set ANNOUNCE_COMPLETE setting to ${value.toString().toLocaleUpperCase()}`;
    client.logger.info(loggerMsg);
  } catch (error) {
    client.logger.error(error);
  }
}

async function commandSettingsAnnounceUncomplete(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_UNCOMPLETE = value;
    await api.setUserSettings(interaction.user.id, settings);
    interaction.reply({
      content: `Paramètre ANNOUNCE_UNCOMPLETE mis à jour sur ${value
        .toString()
        .toLocaleUpperCase()}!`,
      ephemeral: true,
    });
    const loggerMsg = `User ${
      interaction.user.username
    } set ANNOUNCE_UNCOMPLETE setting to ${value
      .toString()
      .toLocaleUpperCase()}`;
    client.logger.info(loggerMsg);
  } catch (error) {
    client.logger.error(error);
  }
}

async function commandSettingsAnnounceDelete(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_DELETE = value;
    await api.setUserSettings(interaction.user.id, settings);
    interaction.reply({
      content: `Paramètre ANNOUNCE_DELETE mis à jour sur ${value
        .toString()
        .toLocaleUpperCase()}!`,
      ephemeral: true,
    });
    const loggerMsg = `User ${
      interaction.user.username
    } set ANNOUNCE_DELETE setting to ${value.toString().toLocaleUpperCase()}`;
    client.logger.info(loggerMsg);
  } catch (error) {
    client.logger.error(error);
  }
}

async function commandSettingsAnnounceUndelete(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_UNDELETE = value;
    await api.setUserSettings(interaction.user.id, settings);
    interaction.reply({
      content: `Paramètre ANNOUNCE_UNDELETE mis à jour sur ${value
        .toString()
        .toLocaleUpperCase()}!`,
      ephemeral: true,
    });
    const loggerMsg = `User ${
      interaction.member
    } set ANNOUNCE_UNDELETE setting to ${value.toString().toLocaleUpperCase()}`;
    client.logger.info(loggerMsg);
  } catch (error) {
    client.logger.error(error);
  }
}

async function commandSettingsPublicName(client, interaction) {
  const value = interaction.options.getString('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.PUBLIC_NAME = value;
    await api.setUserSettings(interaction.user.id, settings);
    interaction.reply({
      content: `Paramètre PUBLIC_NAME mis à jour sur ${value}!`,
      ephemeral: true,
    });
    const loggerMsg = `User ${
      interaction.member
    } set PUBLIC_NAME setting to ${value.toString().toLocaleUpperCase()}`;
    client.logger.info(loggerMsg);
  } catch (error) {
    client.logger.error(error);
  }
}

async function commandSettingsPublicAvatar(client, interaction) {
  const value = interaction.options.getString('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.PUBLIC_AVATAR = value;
    await api.setUserSettings(interaction.user.id, settings);
    interaction.reply({
      content: `Paramètre PUBLIC_AVATAR mis à jour sur ${value}!`,
      ephemeral: true,
    });
    const loggerMsg = `User ${
      interaction.member
    } set PUBLIC_AVATAR setting to ${value.toString().toLocaleUpperCase()}`;
    client.logger.info(loggerMsg);
  } catch (error) {
    client.logger.error(error);
  }
}

async function commandSettingsList(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username;
  try {
    client.logger.info(
      `Liste des paramètres de ${helpers.formatUsername(userName)}`
    );
    const settings = await api.getUserSettings(interaction.user.id);
    //TODO: format settings
    interaction.reply({
      content: `Paramètres de ${helpers.formatUsername(
        userName
      )} : ${formatSettings(settings)}`,
      ephemeral: true,
    });
  } catch (error) {
    client.logger.error(`Erreur lors de la commande settings list`);
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
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
          case 'create':
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
          case 'complete':
            return await commandComplete(client, interaction);
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
          case 'announce_create':
            return await commandSettingsAnnounceCreate(client, interaction);
          case 'announce_update':
            return await commandSettingsAnnounceUpdate(client, interaction);
          case 'announce_complete':
            return await commandSettingsAnnounceComplete(client, interaction);
          case 'announce_delete':
            return await commandSettingsAnnounceDelete(client, interaction);
          case 'announce_undelete':
            return await commandSettingsAnnounceUndelete(client, interaction);
          case 'announce_uncomplete':
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
    const subcommand = interaction.options.getSubcommand();
    let choices = [];
    switch (focusedOption.name) {
      case 'id':
        if (subcommand === 'undelete') {
          choices = await autocompleteGetDeletedQuestIds(client, interaction);
        } else if (subcommand === 'uncomplete') {
          choices = await autocompleteGetCompletedQuestIds(client, interaction);
        } else if (subcommand === 'complete') {
          choices = await autocompleteGetCompletableQuestIds(
            client,
            interaction
          );
        } else {
          choices = await autocompleteGetDeletableQuestIds(client, interaction);
        }
        break;
      case 'channel':
        //check subcommand
        if (subcommand === 'showlist' || subcommand === 'list') {
          choices = await autocompleteGetAllChannelsWithQuests(
            client,
            interaction
          );
        } else {
          choices = await autocompleteGetAllChannels(client, interaction);
        }
        break;
      case 'user':
        choices = await autocompleteGetAllUsers(client, interaction);
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
