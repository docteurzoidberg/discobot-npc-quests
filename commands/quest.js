require('dotenv').config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const api = require('../lib/api');

const commands = new SlashCommandBuilder()
  .setName('quests')
  .setDescription('Gere les quêtes !')
  
  //add
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Ajouter une quête')
      .addStringOption(option =>
        option
          .setName('title')
          .setDescription('Titre de la quête')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('Description de la quête')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('icon')
          .setDescription('URL de l\'icone'))
      .addStringOption(option =>
        option
          .setName('give')
          .setDescription('Récompenses')))

  //update
  .addSubcommand(subcommand =>
    subcommand
      .setName('update')
      .setDescription('Modifier une quête')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('title')
          .setDescription('Titre de la quête'))
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('Description de la quête'))
      .addStringOption(option =>
        option
          .setName('image')
          .setDescription('URL de l\'icone'))
      .addStringOption(option =>
        option
          .setName('give')
          .setDescription('Récompense(s)')))
     


  //rm
  .addSubcommand(subcommand =>
    subcommand
      .setName('delete')
      .setDescription('Supprimer une quête de la liste')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID de la quête')	
          .setRequired(true)))

  //list
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('Lister les quêtes du channel/thread')
      .addStringOption(option =>
        option
          .setName('user')
          .setDescription('Nom du joueur')))

  //complete
  .addSubcommand(subcommand =>
    subcommand
      .setName('complete')
      .setDescription('Terminer une quête')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID de la quête')
          .setRequired(true)));


const shiftCharCode = Δ => c => String.fromCharCode(c.charCodeAt(0) + Δ);
const toFullWidth = str => str.replace(/[!-~]/g, shiftCharCode(0xFEE0));
const toHalfWidth = str => str.replace(/[！-～]/g, shiftCharCode(-0xFEE0));

//return size of characters in string 
//full width characters (2 bytes) and half width characters (1 byte)
const mbStrWidth = input => {
  let len = 0;
  for (let i = 0; i < input.length; i++) {
      let code = input.charCodeAt(i);
      if ((code >= 0x0020 && code <= 0x1FFF) || (code >= 0xFF61 && code <= 0xFF9F)) {
          len += 1;
      } else if ((code >= 0x2000 && code <= 0xFF60) || (code >= 0xFFA0)) {
          len += 2;
      } else {
          len += 0;
      }
  }
  return len;
};

async function add(client, interaction) {
  
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
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
    players: [...username]
  };
  try {
    const channelId = interaction.channelId;
    await api.addChannelQuest(channelId, quest);  
    interaction.reply({content: `Quête [${quest.title}] ajoutée !`, ephemeral: true});
  } catch (error) {
    console.error('Erreur lors de la commande add', error);
  }
}

async function update(client, interaction) {
  
  const channelId = interaction.channelId;
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
    private: private
  };
  try {
    await api.updateChannelQuest(channelId, quest);
    interaction.reply({content: `Quête [${id}] modifiée !`});
  } catch (error) {
    console.error('Erreur lors de la commande update', error);
  }
}

async function rm(client, interaction) {
  const channelId = interaction.channelId;
  const id = interaction.options.getString('id');
  try {
    await api.deleteChannelQuest(channelId, id);
    interaction.reply({content: `Quête [${id}] supprimée !`});
  } catch (error) {
    console.error('Erreur lors de la commande rm', error);
  }
}

async function ls(client, interaction) {
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const channelId = interaction.channelId;
  const channelName = interaction.channel.name;
  try {
    const quests = await api.getChannelQuests(channelId);

    const msg = 
      `Liste des quête de ${channelName}:`
      + quests.map(quest => `\n${toFullWidth(quest.id)}> [${quest.title}] ${quest.description}`).join('');

    interaction.reply({content: msg, ephemeral: true});
  } catch (error) {
    console.error('Erreur lors de la commande ls', error);
  }
}

async function complete(client, interaction) {
  const channelId = interaction.channelId;
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const questId = interaction.options.getString('id');
  try {
    
    const quest = await api.getChannelQuestById(username, id);

    //inconnu
    if(quest === undefined) {
      interaction.reply({content: `Quête [${questId}] introuvable !`, ephemeral: true});
      return;
    }
    
    //deja complete
    if(quest.dateCompleted !== undefined) {
      interaction.reply({content: `Quête [${questId}] déjà complétée !`, ephemeral: true});
      return;
    }

    await api.completeChannelQuest(channelId, questId);
    
    //public -> reponse dans le channel ou a été lancé la commande
    interaction.reply({content: `${interaction.member} a complété une quête !\n[${quest.title}] ${quest.description} !`});
  } catch (error) {
    console.error('Erreur lors de la commande complete', error);
  }
}

module.exports = {
	data: commands,
  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case 'add':
        return await add(client, interaction);
      case 'update':
        return await update(client, interaction);
      case 'rm':
      case 'delete':
        return await rm(client, interaction);
      case 'ls':
      case 'list':
        return await ls(client, interaction);
      case 'complete':
        return await complete(client, interaction);
      default:
        interaction.reply({content: `Désolé mais, la commande ${subcommand} n'existe pas ou n'est pas encore implementée :(`, ephemeral: true});
        break;
    }
  }
};