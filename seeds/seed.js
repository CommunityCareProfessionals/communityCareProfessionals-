const sequelize = require('../config/connection');
const { User, Category, Skill, UserSkill } = require('../models');

const SkillCategory = require('../models/SkillCategory');
const ServiceRequest = require('../models/ServiceRequest');

const userData = require('./userData.json');
const categoryData = require('./categoryData.json');
const skillData = require('./skillData.json');
const skillCategoryData = require('./skillCategoryData.json');
const userSkillData = require('./userSkillData.json');
const serviceRequestData = require('./serviceRequestData.json');



const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const category = await Category.bulkCreate(categoryData, {
    individualHooks: true,
    returning: true,
  });

  const skill = await Skill.bulkCreate(skillData, {
    individualHooks: true,
    returning: true,
  });

  const skillCategory = await SkillCategory.bulkCreate(skillCategoryData, {
    individualHooks: true,
    returning: true,
  });

  const userSkill = await UserSkill.bulkCreate(userSkillData, {
    individualHooks: true,
    returning: true,
  });

  const serviceRequest = await ServiceRequest.bulkCreate(serviceRequestData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
