const sequelize = require('../config/connection');
const { UserSkill, ServiceRequest } = require('../models');

const userSkillData = require('./userSkillData.json');
const serviceRequestData = require('./serviceRequestData.json');

const seedDemo = async () => {
  await sequelize.sync({ alter: true });

  await UserSkill.destroy({
    where: {},
    truncate: true,
  });

  const userSkill = await UserSkill.bulkCreate(userSkillData, {
    individualHooks: true,
    returning: true,
  });

  await ServiceRequest.destroy({
    where: {},
    truncate: true,
  });

  const serviceRequest = await ServiceRequest.bulkCreate(serviceRequestData, {
    individualHooks: true,
    returning: true,
  });
};

module.exports = seedDemo;
