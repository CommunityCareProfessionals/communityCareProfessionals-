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
  // Define an alias for when data is retrieved
  as: 'category_skills',
});

Skill.belongsToMany(Category, {
  through: {
    model: SkillCategory,
    unique: true,
  },
  // Define an alias for when data is retrieved
  as: 'skill_categories',
});

User.belongsToMany(Skill, {
  through: {
    model: UserSkill,
    unique: true,
  },
  // Define an alias for when data is retrieved
  as: 'user_skills',
});

Skill.belongsToMany(User, {
  through: {
    model: UserSkill,
    unique: true,
  },
  // Define an alias for when data is retrieved
  as: 'skill_users',
});

Skill.hasMany(ServiceRequest, {
  foreignKey: 'skill_id',
  onDelete: 'CASCADE',
});

ServiceRequest.belongsTo(Skill, {
  foreignKey: 'skill_id',
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

module.exports = { User, Project, Category, Skill, UserSkill };
