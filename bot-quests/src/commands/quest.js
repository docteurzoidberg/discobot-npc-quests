const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const api = require('../lib/quests-api');
const dalle = require('../lib/openai-dall-e');
const tppt = require('../lib/tppt-api');
const helpers = require('../lib/discobot-helpers');

//emojis

//calendar emoji
//📅
//exclamation emoji
//❗️
//lock emoji
//🔒
//plus emoji
//➕
//check emoji
//✅

const commands = new SlashCommandBuilder()
  .setName('quest')
  .setDescription('Gère les quêtes !')

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
        option
          .setName('give')
          .setDescription('Récompenses ?')
          .setRequired(false)
      )
      .addStringOption((option) =>
        option
          .setName('icon')
          .setDescription("URL de l'icone ?")
          .setRequired(false)
      )
      .addStringOption((option) =>
        option
          .setName('image')
          .setDescription("URL de l'image ?")
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName('private')
          .setDescription('Quête privée ?')
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName('daily')
          .setDescription('Quête journalière ?')
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName('repeat')
          .setDescription('Quête répétable ?')
          .setRequired(false)
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
        option.setName('give').setDescription('Récompense(s) ?')
      )
      .addStringOption((option) =>
        option.setName('image').setDescription("URL de l'image ?")
      )
      .addStringOption((option) =>
        option.setName('icon').setDescription("URL de l'icone ?")
      )
      .addBooleanOption((option) =>
        option
          .setName('private')
          .setDescription('Quête privée ?')
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName('daily')
          .setDescription('Quête journalière ?')
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName('repeat')
          .setDescription('Quête répétable ?')
          .setRequired(false)
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
      .addBooleanOption((option) =>
        option
          .setName('show')
          .setDescription('Afficher la liste dans le channel ?')
          .setRequired(false)
      )
  )

  //preview
  .addSubcommand((subcommand) =>
    subcommand
      .setName('preview')
      .setDescription('Afficher la quête en privé')
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true)
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
      .addBooleanOption((option) =>
        option
          .setName('full')
          .setDescription('Afficher en mode detaillé ?')
          .setRequired(false)
      )
  )
  //show
  .addSubcommand((subcommand) =>
    subcommand
      .setName('show')
      .setDescription('Afficher la quête publiquement')
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true)
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
      .addBooleanOption((option) =>
        option
          .setName('full')
          .setDescription('Afficher en mode detaillé ?')
          .setRequired(false)
      )
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

  // tags group
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

  // settings group
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
  )

  // players group
  .addSubcommandGroup((group) =>
    group
      .setName('player')
      .setDescription('Gestion des joueurs')
      .addSubcommand((subcommand) =>
        subcommand.setName('list').setDescription('Liste les joueurs')
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('add')
          .setDescription('Ajoute un joueur sur une quête')
          .addStringOption((option) =>
            option
              .setName('id')
              .setDescription('ID de la quête')
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addUserOption((option) =>
            option.setName('player').setDescription('Joueur').setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('remove')
          .setDescription('Retire un joueur dune quête')
          .addStringOption((option) =>
            option
              .setName('id')
              .setDescription('ID de la quête')
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addUserOption((option) =>
            option.setName('player').setDescription('Joueur').setRequired(true)
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

  const questCompleted = quest.dateCompleted ? '☑' : '☐';
  const questPrivate = quest.private ? '🔒' : '';
  //const questWeekly = quest.weekly ? '📆' : '';
  const questDaily = quest.daily ? '📅' : '';
  const questRepeat = quest.repeat ? '🔄' : '';

  const questMembers = (quest.players || []).length > 1 ? ' 👥' : '';

  // strike through if completed
  const striked = quest.dateCompleted ? '~~' : '';
  const tagsText = tagsArray.length > 0 ? ` ${_formatTags(tagsArray)}` : '';

  return `${questId} ${questCompleted} ${striked}[${title}]${tagsText}${striked} ${questPrivate}${questMembers}${questDaily}${questRepeat}`;
};

const _formatQuestTitle = (title) => {
  let questTitle = title || '';
  //if empty title, use "Sans titre"
  if (questTitle === '') {
    questTitle = '*Sans titre*';
  }
  return `[${helpers.preventEmbed(questTitle)}]`;
};

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
const _formatSettings = (settings) => {
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
//format quest for display in autocomplete prompt
/* XX Titre */
const _formatAutocompleteQuest = (quest) => {
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
};

const _formatAutocompleteChannel = (channel) => {
  return {
    name: `#${
      channel.name.length > 24
        ? channel.name.substring(0, 21) + '...'
        : channel.name
    }}`,
    value: channel.id,
  };
};

const _formatAutocompleteUser = (user) => {
  return {
    name: user.username,
    value: user.id,
  };
};

const amap = async (arr, fun) =>
  await Promise.all(arr.map(async (v) => await fun(v)));

const _getUserName = async (client, userNameOrId) => {
  const unknown = 'Utilisateur inconnu';
  if (!userNameOrId) {
    return unknown;
  }
  if (userNameOrId.match(/^[0-9]+$/)) {
    try {
      const user = client.users.cache.get(userNameOrId);
      if (!user) {
        client.logger.error('user not in cache: ' + userNameOrId);
        return unknown;
      }
      return user.username;
    } catch (error) {
      return unknown;
    }
  }
  return userNameOrId;
};

const _getUserTag = async (client, userNameOrId) => {
  const unknown = 'Utilisateur inconnu';
  if (!userNameOrId) {
    return unknown;
  }
  if (userNameOrId.match(/^[0-9]+$/)) {
    try {
      const user = client.users.cache.get(userNameOrId);
      if (!user) {
        client.logger.error('user not in cache: ' + userNameOrId);
        return unknown;
      }
      return `<@${user.id}>`;
    } catch (error) {
      return unknown;
    }
  }
  return userNameOrId;
};

const _getUserNames = async (client, usersOrIds = []) => {
  const usernames = await amap(usersOrIds, async (userNameOrId) => {
    const userName = await _getUserName(client, userNameOrId);
    return userName;
  });
  return usernames;
};

const _getUserTags = async (client, usersOrIds = []) => {
  const userTags = await amap(usersOrIds, async (userNameOrId) => {
    const userTag = await _getUserTag(client, userNameOrId);
    return userTag;
  });
  return userTags;
};

const _generateDallePrompt = (title) => {
  const prompt = `imagine un personnage de jeu rpg en style pixel-art vue top-down, qui est en train d'accomplir la quête intitulée [${title}]`;
  return prompt;
};

const _generateQuestEmbedShort = async (client, interaction, quest) => {
  let title = helpers.preventEmbed(quest.title) || '*Sans titre*';
  let description = quest.description || '*Aucune description*';
  let icon = quest.icon || '';
  let image = quest.image || '';
  let players = quest.players || [];

  const options = [];
  if (quest.private) options.push('🔒 privée');
  if (quest.daily) options.push('📅 journalière');
  if (quest.repeat) options.push('🔁 répétable');
  if (players.length > 1) options.push('👥 groupe');

  const createdByUser =
    quest.dateCreated && quest.createdBy ? quest.createdBy : false;
  const completedByUser =
    quest.dateCompleted && quest.completedBy ? quest.completedBy : false;

  const color = quest.dateCompleted ? 0x00ff00 : helpers.colorFromId(quest.id);
  const footerUser = completedByUser
    ? await _getUserName(client, completedByUser)
    : await _getUserName(client, createdByUser);

  console.log('footerUser', footerUser);

  const footerStatus =
    quest.dateCompleted && completedByUser ? '✅ accompli par' : '⭐ créée par';
  const footerOptions = options.join(' ') + '\n';

  const descriptionPlayerEmoji = players.length > 1 ? '👥' : '👤';
  const descriptionPlayers =
    players.length > 1
      ? await _getUserTags(client, players).join(', ')
      : await _getUserTag(client, players[0]);

  console.log('descriptionPlayers', descriptionPlayers);

  description = `${description}\n\n${descriptionPlayerEmoji} ${descriptionPlayers}`;
  const footerPlayers = '';

  //const footerPlayers =
  //  players.length > 1
  //    ? `👤 ${_getUserNames(client, players).join(', ')}\n`
  //   : '';

  const footer = `${footerOptions}${footerPlayers}${footerStatus} ${footerUser}`;

  const timestamp =
    quest.dateCompleted != null
      ? helpers.parseDate(quest.dateCompleted)
      : helpers.parseDate(quest.dateCreated);

  const msgEmbed = new EmbedBuilder()
    .setTitle(`[${title}]`)
    .setDescription(description)
    .setColor(color)
    .setFooter({ text: footer })
    .setTimestamp(timestamp);

  if (icon !== '') {
    msgEmbed.setThumbnail(icon);
  } else if (image !== '') {
    msgEmbed.setThumbnail(image);
  }
  client.logger.debug(msgEmbed);
  return msgEmbed;
};

const _generateQuestEmbed = async (client, interaction, quest) => {
  const emojiDaily = '📅';
  const emojiRepeat = '🔁';
  const emojiCompleted = '✅';
  const emojiCreated = '✎';
  const emojiGive = '🎁';
  const emojiPrivate = '🔒';
  const emojiGroup = '👥';

  let title = helpers.preventEmbed(quest.title) || '*Sans titre*';
  let description =
    helpers.preventEmbed(quest.description) || '*Aucune description*';
  let image = quest.image || '';
  let icon = quest.icon || '';
  let give = quest.give || '';
  let players = await _getUserTags(client, quest.players || []);

  const color = quest.dateCompleted ? 0x00ff00 : helpers.colorFromId(quest.id);

  const createdBy = quest.createdBy || '';
  const completedBy = quest.completedBy || '';

  let createdByUser = false;
  if (createdBy !== '') {
    createdByUser = createdBy;
  } else if (players.length > 0) {
    createdByUser = players[0];
  }

  let completedByUser = false;
  if (completedBy !== '') {
    completedByUser = completedBy;
  }

  //TODO: utiliser createdBy / completedBy
  const footerUser =
    quest.dateCompleted && completedByUser
      ? await _getUserName(client, completedByUser)
      : await _getUserName(client, createdByUser);

  const footerStatus =
    quest.dateCompleted && completedByUser
      ? `${emojiCompleted} Accompli par`
      : `${emojiCreated} Crée par`;

  const footerPrivate = quest.private ? ' ' + emojiPrivate : '';

  const footer = `${footerStatus} ${footerUser}${footerPrivate}`;

  const timestamp =
    quest.dateCompleted != null
      ? helpers.parseDate(quest.dateCompleted)
      : helpers.parseDate(quest.dateCreated);

  const msgEmbed = new EmbedBuilder()
    .setTitle(`[${title}]`)
    //.setDescription(description)
    //.addField('Donne', give, true)
    //.addField('Points', points, true)
    //.addField('Joueurs', players.join(', '), true)
    .setColor(color)
    .setFooter({ text: footer })
    .setTimestamp(timestamp);

  let descriptionMsg = `**Description**\n${description}`;
  /*
  if (quest.dateCreated && createdByUser) {
    descriptionMsg += `\n\n**Crée** le ${helpers.formatEmbedFieldDate(
      quest.dateCompleted
    )} par ${_getUserTag(client, completedByUser)}`;
  }
  if (quest.dateCompleted && completedByUser) {
    descriptionMsg += `\n\n**Accomplie** le ${helpers.formatEmbedFieldDate(
      quest.dateCompleted
    )} par ${_getUserTag(client, completedByUser)}`;
  }
*/
  if (quest.dateCreated && createdByUser) {
    const userTag = await _getUserTag(client, createdByUser);
    msgEmbed.addFields({
      name: 'Créée',
      value: `${helpers.formatEmbedFieldDate(quest.dateCreated)} ${userTag}`,
      inline: false,
    });
  }

  if (quest.dateCompleted && completedByUser) {
    const userTag = await _getUserTag(client, completedByUser);
    msgEmbed.addFields({
      name: 'Accomplie',
      value: `${helpers.formatEmbedFieldDate(quest.dateCompleted)} ${userTag}`,
      inline: false,
    });
  }

  //add field players
  if (players.length > 1) {
    msgEmbed.addFields({
      name: 'Joueurs',
      value: `${players.join(', ')}`,
      inline: false,
    });
  }

  let questOptions = [];
  if (quest.daily) questOptions.push(`${emojiDaily} Quête quotidienne`);
  if (quest.private) questOptions.push(`${emojiPrivate} Quête privée`);
  if (quest.repeat) questOptions.push(`${emojiRepeat} Quête répétable`);
  if (players.length > 1) questOptions.push(`${emojiGroup} Quête de groupe`);
  if (questOptions.length > 0) {
    msgEmbed.addFields({
      name: 'Options',
      value: `${questOptions.join(' ')}`,
    });
  }

  //quest image => image is not empety else icon if not empty else nothing?
  //TODO: reflechir images/icones
  const embedImage = image !== '' ? image : icon !== '' ? icon : '';
  if (embedImage !== '') {
    msgEmbed.setImage(embedImage);
  }

  const embedIcon = icon !== '' ? icon : '';
  if (embedIcon !== '') {
    msgEmbed.setThumbnail(embedIcon);
  }

  msgEmbed.setDescription(descriptionMsg);
  client.logger.debug(msgEmbed);
  return msgEmbed;
};

async function commandAdd(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const userId = interaction.user.id;
  const channelId = interaction.channelId;
  const channelName = interaction.channel.name;
  const title = interaction.options.getString('title');
  const description = interaction.options.getString('description');
  let image = interaction.options.getString('image') || '';
  let icon = interaction.options.getString('icon') || '';
  let give = interaction.options.getString('give') || '';
  const private = interaction.options.getBoolean('private') || false;
  const daily = interaction.options.getBoolean('daily') || false;
  const repeat = interaction.options.getBoolean('repeat') || false;

  let deferred = false;

  //Autogen images with dall-e?
  if (client.config.USE_DALLE && (image === '' || icon === '')) {
    const prompt = _generateDallePrompt(title);

    //take long time so tell discord
    deferred = true;
    interaction.deferReply({ ephemeral: true });

    const dalleImage = await dalle.getDallEImage(prompt);
    client.logger.debug(dalleImage);

    //uploads to tppt
    const tpptUrl = await tppt.dalle2tppt(dalleImage);
    client.logger.debug(tpptUrl);

    if (image === '') {
      image = tpptUrl;
    }
    if (icon === '') {
      icon = tpptUrl;
    }
  }

  //TODO: validation ?
  const quest = {
    createdBy: userId,
    title: title,
    description: description,
    image: image,
    icon: icon,
    give: give,
    daily: daily,
    repeat: repeat,
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
    if (!deferred) {
      interaction.reply({
        content: `Quête ${_formatQuestTitle(quest.title)} ajoutée ! (ID: ${
          newQuest.id
        })`,
        ephemeral: true,
      });
    } else {
      interaction.editReply({
        content: `Quête ${_formatQuestTitle(quest.title)} ajoutée ! (ID: ${
          newQuest.id
        })`,
        ephemeral: true,
      });
    }
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
  const icon = interaction.options.getString('icon') || false;
  const private = interaction.options.getBoolean('private');
  const daily = interaction.options.getBoolean('daily');
  const repeat = interaction.options.getBoolean('repeat');

  const optionnalNull = (value) => {
    switch (value) {
      case 'null':
      case 'rien':
      case 'none':
      case '-':
        return '';
      default:
        return value;
    }
  };

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
      quest.give = optionnalNull(give);
    }
    if (image !== false) {
      quest.image = optionnalNull(image);
    }
    if (icon !== false) {
      quest.icon = optionnalNull(icon);
    }

    if (private !== undefined) quest.private = private;
    if (daily !== undefined) quest.daily = daily;
    if (repeat !== undefined) quest.repeat = repeat;

    const updatedQuest = await api.updateChannelQuest(channelId, id, quest);
    client.logger.debug(updatedQuest);
    interaction.reply({ content: `Quête [${id}] modifiée !`, ephemeral: true });
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
  const full = interaction.options.getBoolean('full') || false;
  const short = !full;
  try {
    client.logger.info(
      `Affichage de la quête [${id}] dans ${helpers.formatChannelName(
        channelName
      )} par ${helpers.formatUsername(userName)} ` +
        (ephemeral === true ? '(en privé)' : '(en public)')
    );
    const quest = await api.getChannelQuestById(channelId, id);

    //replace users ids by names
    //quest.players = _getUserNames(client, quest.players || []);
    //if (quest.createdBy)
    //  quest.createdBy = _getUserName(client, quest.createdBy);
    //if (quest.completedBy)
    //  quest.completedBy = _getUserName(client, quest.completedBy);

    client.logger.debug(quest);
    const msg = short
      ? ''
      : `${interaction.member} souhaite vous montrer cette quête:`;
    const embed = short
      ? _generateQuestEmbedShort(client, interaction, quest)
      : _generateQuestEmbed(client, interaction, quest);
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

async function commandList(client, interaction) {
  const userName = client.users.cache.get(interaction.user.id).username;

  let channelId = interaction.channelId;
  let channelName = interaction.channel.name;

  //options
  const byuser = interaction.options.getString('user') || false;
  const bytag = interaction.options.getString('tag') || false;
  const bychannel = interaction.options.getString('channel') || false;
  const show = interaction.options.getBoolean('show') || false;

  const ephemeral = show === true ? false : true;

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
      )} demandée par ${helpers.formatUsername(userName)}`
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
      ephemeral: ephemeral,
    });
  } catch (error) {
    client.logger.error('Erreur lors de la commande ' + 'list', error);
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandComplete(client, interaction) {
  const userId = interaction.user.id;
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

    //deja completée et pas répétable
    if (quest.dateCompleted && !quest.repeat) {
      const canCompleteMsg = quest.daily ? "(aujourd'hui)" : '';
      interaction.reply({
        content: `Quête [${questId}] déjà terminée ${canCompleteMsg}!`,
        ephemeral: true,
      });
      return;
    }

    const completedQuest = await api.completeChannelQuest(
      channelId,
      questId,
      userId
    );
    client.logger.debug(completedQuest);

    //private or no annouce = reply to user. else to channel

    const isPrivate = quest.private || userSettings.ANNOUNCE_COMPLETE === false;
    if (isPrivate) {
      //private -> reponse en privé
      interaction.reply({
        content: `Quête ${_formatQuestId(quest.id)} ${_formatQuestTitle(
          completedQuest.title
        )} terminée !`,
        ephemeral: true,
      });
    } else {
      //public -> reponse dans le channel ou a été lancé la commande
      interaction.reply({
        content: `${interaction.member} a terminé une quête !`,
        embeds: [_generateQuestEmbed(completedQuest, true)],
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
      ephemeral: true,
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

/* Autocomplete Methods */

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

/* Command Methods */

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
      )} : ${_formatSettings(settings)}`,
      ephemeral: true,
    });
  } catch (error) {
    client.logger.error(`Erreur lors de la commande settings list`);
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandPlayerAdd(client, interaction) {
  const userId = interaction.user.id;
  const channelId = interaction.channelId;
  const userName = client.users.cache.get(userId).username;
  const player = interaction.options.getUser('player') || false;
  const questId = interaction.options.getString('id') || false;
  try {
    client.logger.info(
      `Ajout du joueur ${helpers.formatUsername(
        player.userName
      )} à la quête ${questId} par ${helpers.formatUsername(userName)}`
    );
    const quest = await api.addPlayerToQuest(channelId, questId, player.id);
    client.logger.debug(quest);

    interaction.reply({
      content: `Joueur ${helpers.formatUsername(
        player.username
      )} ajouté à la quête ${questId}!`,
      ephemeral: true,
    });
  } catch (error) {
    client.logger.error(`Erreur lors de la commande player add`);
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

async function commandPlayerRemove(client, interaction) {
  const userId = interaction.user.id;
  const channelId = interaction.channelId;
  const userName = client.users.cache.get(userId).username;
  const player = interaction.options.getUser('player') || false;
  const questId = interaction.options.getString('id') || false;
  try {
    client.logger.info(
      `Retrait du joueur ${helpers.formatUsername(
        player.userName
      )} de la quête ${questId} par ${helpers.formatUsername(userName)}`
    );
    const quest = await api.removePlayerFromQuest(
      channelId,
      questId,
      player.id
    );
    client.logger.debug(quest);
    interaction.reply({
      content: `Joueur ${helpers.formatUsername(
        player.username
      )} retiré de la quête ${questId}!`,
      ephemeral: true,
    });
  } catch (error) {
    client.logger.error(`Erreur lors de la commande player remove`);
    client.logger.debug(error.message);
    client.logger.debug(error.stack);
  }
}

/* Module exports */

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
          case 'preview':
            return await commandShow(client, interaction, true);
          case 'show':
            return await commandShow(client, interaction, false);
          case 'list':
            return await commandList(client, interaction);
          //case 'showlist':
          //  return await commandList(client, interaction, false);
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
      case 'player':
        switch (subcommand) {
          case 'add':
            return await commandPlayerAdd(client, interaction);
          case 'remove':
            return await commandPlayerRemove(client, interaction);
          default:
            interaction.reply({
              content: `Désolé mais, la commande ${commandgroup} ${subcommand} n'existe pas ou n'est pas encore implementée :(`,
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
