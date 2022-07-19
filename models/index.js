const User = require('./User');
const Category = require('./Category');
const Skill = require('./Skill');
const SkillCategory = require('./SkillCategory');
const UserSkill = require('./UserSkill');
const ServiceRequest = require('./ServiceRequest');

Category.belongsToMany(Skill, {
  through: {
    model: SkillCategory,
    foreignKey: 'category_id',
    unique: true,
  },
  as: 'category_skills',
});

Skill.belongsToMany(Category, {
  through: {
    model: SkillCategory,
    foreignKey: 'skill_id',
    unique: true,
  },
  as: 'skill_categories',
});

Skill.hasMany(SkillCategory);
SkillCategory.belongsTo(Skill);
Category.hasMany(SkillCategory);
SkillCategory.belongsTo(Category);

User.belongsToMany(SkillCategory, {
  through: {
    model: UserSkill,
    foreignKey: 'user_id',
    unique: true,
  },
  as: 'provider_skills',
});

SkillCategory.belongsToMany(User, {
  through: {
    model: UserSkill,
    foreignKey: 'skillcategory_id',
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

// SkillCategory.belongsToMany(ServiceRequest, {
//   through: {
//     model: SkillCategory,
//     foreignKey: 'skillcategory_id',
//     unique: true,
//   },
//   as: 'skill_service_requests',
// });

// ServiceRequest.belongsToMany(Skill, {
//   through: {
//     model: SkillCategory,
//     foreignKey: 'category_skill_id',
//     unique: true,
//   },
//   as: 'service_request_skills',
// });

// SkillCategory.belongsToMany(ServiceRequest, {
//   through: {
//     model: SkillCategory,
//     foreignKey: 'category_skill_id',
//     unique: true,
//   },
//   as: 'category_service_requests',
// });

// ServiceRequest.belongsToMany(Category, {
//   through: {
//     model: SkillCategory,
//     foreignKey: 'category_skill_id',
//     unique: true,
//   },
//   as: 'service_request_categories',
// });

module.exports = {
  User,
  Category,
  Skill,
  SkillCategory,
  UserSkill,
  ServiceRequest,
};
