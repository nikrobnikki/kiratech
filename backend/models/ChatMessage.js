const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChatMessage = sequelize.define(
    'ChatMessage',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      requestId: {
        type: DataTypes.UUID, allowNull: false,
        references: { model: 'service_requests', key: 'id' },
      },
      senderId: {
        type: DataTypes.UUID, allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      senderRole: {
        type: DataTypes.ENUM('customer', 'technician'),
        allowNull: false,
      },
      message:  { type: DataTypes.TEXT, allowNull: false },
      isRead:   { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: 'chat_messages', timestamps: true }
  );
  return ChatMessage;
};
