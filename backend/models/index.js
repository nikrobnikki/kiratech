const { Sequelize } = require('sequelize');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error('❌ Missing required DB environment variables:', missing.join(', '));
    process.exit(1);
  }
}

const sslConfig = isProd
  ? (process.env.DB_SSL === 'false'
      ? { connectTimeout: 60000 }
      : { ssl: { rejectUnauthorized: false }, connectTimeout: 60000 })
  : {};

const sequelize = new Sequelize(
  process.env.DB_NAME   || 'kiratech_db',
  process.env.DB_USER   || 'root',
  process.env.DB_PASSWORD || '',
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: isProd ? false : console.log,
    pool:    { max: isProd ? 5 : 10, min: 0, acquire: 60000, idle: 10000 },
    dialectOptions: sslConfig,
  }
);

// ── Models ────────────────────────────────────────────────────────────────────
const User              = require('./User')(sequelize);
const Technician        = require('./Technician')(sequelize);
const Service           = require('./Service')(sequelize);
const ServiceRequest    = require('./ServiceRequest')(sequelize);
const Notification      = require('./Notification')(sequelize);
const Review            = require('./Review')(sequelize);
const Payment           = require('./Payment')(sequelize);
const TechnicianMessage = require('./TechnicianMessage')(sequelize);
const ChatMessage       = require('./ChatMessage')(sequelize);

// ── Associations ──────────────────────────────────────────────────────────────
User.hasMany(ServiceRequest, { foreignKey: 'userId', as: 'requests' });
ServiceRequest.belongsTo(User, { foreignKey: 'userId', as: 'customer' });

Technician.hasMany(ServiceRequest, { foreignKey: 'technicianId', as: 'assignedRequests' });
ServiceRequest.belongsTo(Technician, { foreignKey: 'technicianId', as: 'technician' });

User.hasOne(Technician, { foreignKey: 'userId', as: 'technicianProfile' });
Technician.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Service.hasMany(ServiceRequest, { foreignKey: 'serviceId', as: 'requests' });
ServiceRequest.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

ServiceRequest.hasOne(Review, { foreignKey: 'requestId', as: 'review' });
Review.belongsTo(ServiceRequest, { foreignKey: 'requestId', as: 'request' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'customer' });
Technician.hasMany(Review, { foreignKey: 'technicianId', as: 'reviews' });
Review.belongsTo(Technician, { foreignKey: 'technicianId', as: 'technician' });

ServiceRequest.hasMany(Payment, { foreignKey: 'requestId', as: 'payments' });
Payment.belongsTo(ServiceRequest, { foreignKey: 'requestId', as: 'request' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'payer' });

// Technician ↔ TechnicianMessage (team chat)
Technician.hasMany(TechnicianMessage, { foreignKey: 'senderId',   as: 'sentMessages' });
Technician.hasMany(TechnicianMessage, { foreignKey: 'receiverId', as: 'receivedMessages' });
TechnicianMessage.belongsTo(Technician, { foreignKey: 'senderId',   as: 'sender' });
TechnicianMessage.belongsTo(Technician, { foreignKey: 'receiverId', as: 'receiver' });
ServiceRequest.hasMany(TechnicianMessage, { foreignKey: 'requestId', as: 'sharedTaskMessages' });
TechnicianMessage.belongsTo(ServiceRequest, { foreignKey: 'requestId', as: 'linkedRequest' });

// ServiceRequest ↔ ChatMessage (customer ↔ technician per-request chat)
ServiceRequest.hasMany(ChatMessage, { foreignKey: 'requestId', as: 'chatMessages' });
ChatMessage.belongsTo(ServiceRequest, { foreignKey: 'requestId', as: 'request' });
User.hasMany(ChatMessage, { foreignKey: 'senderId', as: 'chatsSent' });
ChatMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

module.exports = {
  sequelize, Sequelize,
  User, Technician, Service, ServiceRequest,
  Notification, Review, Payment, TechnicianMessage, ChatMessage,
};
