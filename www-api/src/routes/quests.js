/* express middleware for all methods of lib/quests.js */

//TODO: write wrapper for all quest api methods
/*
  getChannelQuestById
  addChannelQuest
  updateChannelQuest
  deleteChannelQuest
  completeChannelQuest
  uncompleteChannelQuest
  undeleteChannelQuest
  addTagToChannelQuest
  removeTagFromChannelQuest
  getChannelPublicQuests
  getChannelQuests
*/

const questsdb = require('../lib/quests');

const getChannelQuestById = async (req, res) => {
  const { channelId, questId } = req.params;
  const quest = await questsdb.getChannelQuestById(channelId, questId);
  if (!quest) return res.status(404).send('Quest not found');
  res.json(quest);
};

const addChannelQuest = async (req, res) => {
  const { channelId } = req.params;
  const questObject = req.body;
  const quest = await questsdb.addChannelQuest(channelId, questObject);
  res.json(quest);
};

const updateChannelQuest = async (req, res) => {
  const { channelId, questId } = req.params;
  const questObject = req.body;
  const quest = await questsdb.updateChannelQuest(
    channelId,
    questId,
    questObject
  );
  res.json(quest);
};

const deleteChannelQuest = async (req, res) => {
  const { channelId, questId } = req.params;
  const quest = await questsdb.deleteChannelQuest(channelId, questId);
  res.json(quest);
};

const completeChannelQuest = async (req, res) => {
  const { channelId, questId } = req.params;
  const quest = await questsdb.completeChannelQuest(channelId, questId);
  res.json(quest);
};

const uncompleteChannelQuest = async (req, res) => {
  const { channelId, questId } = req.params;
  const quest = await questsdb.uncompleteChannelQuest(channelId, questId);
  res.json(quest);
};

const undeleteChannelQuest = async (req, res) => {
  const { channelId, questId } = req.params;
  const quest = await questsdb.undeleteChannelQuest(channelId, questId);
  res.json(quest);
};

const addTagToChannelQuest = async (req, res) => {
  const { channelId, questId } = req.params;
  const tag = req.body.tag;
  const quest = await questsdb.addTagToChannelQuest(channelId, questId, tag);
  res.json(quest);
};

const removeTagFromChannelQuest = async (req, res) => {
  const { channelId, questId } = req.params;
  const tag = req.body.tag;
  const quest = await questsdb.removeTagFromChannelQuest(
    channelId,
    questId,
    tag
  );
  res.json(quest);
};

const getChannelPublicQuests = async (req, res) => {
  const { channelId } = req.params;
  const quests = await questsdb.getChannelPublicQuests(channelId);
  res.json(quests);
};

const getChannelQuests = async (req, res) => {
  const { channelId } = req.params;
  const quests = await questsdb.getChannelQuests(channelId);
  res.json(quests);
};

const router = require('express').Router();

router.get('/:channelId/:questId', getChannelQuestById);

router.put('/:channelId/:questId', updateChannelQuest);
router.delete('/:channelId/:questId', deleteChannelQuest);

router.put('/:channelId/:questId/complete', completeChannelQuest);
router.put('/:channelId/:questId/uncomplete', uncompleteChannelQuest);
router.put('/:channelId/:questId/undelete', undeleteChannelQuest);
router.post('/:channelId/:questId/tag', addTagToChannelQuest);
router.delete('/:channelId/:questId/tag', removeTagFromChannelQuest);

router.get('/:channelId/public', getChannelPublicQuests);
router.get('/:channelId', getChannelQuests);
router.post('/:channelId', addChannelQuest);

module.exports = router;