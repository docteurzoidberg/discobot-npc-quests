const userdb = require('../lib/users');

const getUserIds = async (req, res) => {
  const { logger } = req;
  logger.info('getUsers');
  const users = await userdb.getUserIds();
  res.json(users);
};

const getUserSettings = async (req, res) => {
  const { logger } = req;
  const userId = req.params.userId;
  logger.info('getUserSettings', userId);
  const userSettings = await userdb.getUserSettings(userId);
  res.json(userSettings);
};

const setUserSettings = async (req, res) => {
  const { logger } = req;
  const { userId } = req.params;
  const settings = req.body;
  logger.info('updateUserSettings', { userId, settings });
  const savedSettings = userdb.setUserSettings(userId, settings);
  res.json(savedSettings);
};

const router = require('express').Router();
//router.get('/', getUserIds);
router.get('/:userId/settings', getUserSettings);
router.put('/:userId/settings', setUserSettings);
module.exports = router;
