const User = require('./User');
const Project = require('./Project');
const Category = require('./Category');
const Skill = require('./Skill');
const SkillCategory = require('./SkillCategory');
const UserSkill = require('./UserSkill');
const ServiceRequest = require('./ServiceRequest');

User.hasMany(Project, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Project.belongsTo(User, {
  foreignKey: 'user_id',
});

Category.belongsToMany(Skill, {
  through: {
    model: SkillCategory,
    unique: true,
  },
  as: 'category_skills',
});

Skill.belongsToMany(Category, {
  through: {
    model: SkillCategory,
    unique: true,
  },
  as: 'skill_categories',
});

User.belongsToMany(Skill, {
  through: {
    model: UserSkill,
    unique: true,
  },
  as: 'provider_skills',
});

Skill.belongsToMany(User, {
  through: {
    model: UserSkill,
    unique: true,
  },
  as: 'skill_providers',
});

User.hasMany(ServiceRequest, {
  foreignKey: 'provider_id',
  onDelete: 'CASCADE',
});

ServiceRequest.belongsTo(User, {
  as: 'provider',
  foreignKey: 'provider_id',
});

User.hasMany(ServiceRequest, {
  foreignKey: 'consumer_id',
  onDelete: 'CASCADE',
});

ServiceRequest.belongsTo(User, {
  as: 'consumer',
  foreignKey: 'consumer_id',
});

Skill.belongsToMany(ServiceRequest, {
  through: {
    model: SkillCategory,
    foreignKey: 'category_skill_id',
    unique: true,
  },
  as: 'skill_service_requests',
});

ServiceRequest.belongsToMany(Skill, {
  through: {
    model: SkillCategory,
    foreignKey: 'category_skill_id',
    unique: true,
  },
  as: 'service_request_skills',
});

Category.belongsToMany(ServiceRequest, {
  through: {
    model: SkillCategory,
    foreignKey: 'category_skill_id',
    unique: true,
  },
  as: 'category_service_requests',
});

ServiceRequest.belongsToMany(Category, {
  through: {
    model: SkillCategory,
    foreignKey: 'category_skill_id',
    unique: true,
  },
  as: 'service_request_categories',
});

module.exports = {
  User,
  Project,
  Category,
  Skill,
  SkillCategory,
  UserSkill,
  ServiceRequest,
};
