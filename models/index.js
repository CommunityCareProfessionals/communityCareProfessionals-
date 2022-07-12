const User = require('./User');
const Project = require('./Project');
const Category = require('./Category');
const Skill = require('./Skill');
const SkillCategory = require('./SkillCategory');
const UserSkill = require('./UserSkill');

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
  as: 'skill_categories',
});

Skill.belongsToMany(Category, {
  through: {
    model: SkillCategory,
    unique: true,
  },
  // Define an alias for when data is retrieved
  as: 'category_skills',
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

module.exports = { User, Project, Category, Skill, UserSkill };
