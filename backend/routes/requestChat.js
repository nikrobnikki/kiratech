const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, requireVerified } = require('../middleware/auth');
const { ChatMessage, ServiceRequest, User, Technician, Notification } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();
router.use(authenticate, requireVerified);

// Helper: verify the caller has access to this request
async function canAccess(req, requestId) {
  const sr = await ServiceRequest.findByPk(requestId, {
    include: [{ model: Technician, as: 'technician', include: [{ model: User, as: 'user' }] }],
  });
  if (!sr) return null;
  const role = req.user.role;
  if (role === 'admin') return sr;
  if (role === 'customer' && sr.userId === req.user.id) return sr;
  if (role === 'technician') {
    const tech = await Technician.findOne({ where: { userId: req.user.id } });
    if (tech && sr.technicianId === tech.id) return sr;
  }
  return null;
}

// ── GET /api/request-chat/:requestId ─────────────────────────────────────────
// Fetch all messages for a request — also marks unread as read
router.get('/:requestId', async (req, res) => {
  try {
    const sr = await canAccess(req, req.params.requestId);
    if (!sr) return res.status(403).json({ error: 'Access denied' });

    const messages = await ChatMessage.findAll({
      where: { requestId: req.params.requestId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role', 'avatar'] }],
      order: [['createdAt', 'ASC']],
    });

    // Mark all messages NOT sent by current user as read
    await ChatMessage.update(
      { isRead: true },
      { where: { requestId: req.params.requestId, senderId: { [Op.ne]: req.user.id }, isRead: false } }
    );

    res.json({ messages, myUserId: req.user.id });
  } catch (err) {
    console.error('Chat fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ── POST /api/request-chat/:requestId ────────────────────────────────────────
// Send a message
router.post('/:requestId',
  [body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message required (max 2000 chars)')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    try {
      const sr = await canAccess(req, req.params.requestId);
      if (!sr) return res.status(403).json({ error: 'Access denied' });

      const senderRole = req.user.role === 'admin' ? 'technician' : req.user.role;

      const msg = await ChatMessage.create({
        requestId:  req.params.requestId,
        senderId:   req.user.id,
        senderRole,
        message:    req.body.message,
      });

      // Notify the other party
      let notifyUserId = null;
      if (req.user.role === 'customer') {
        // Notify technician
        if (sr.technician?.user?.id) notifyUserId = sr.technician.user.id;
      } else {
        // Notify customer
        notifyUserId = sr.userId;
      }

      if (notifyUserId && notifyUserId !== req.user.id) {
        await Notification.create({
          userId:    notifyUserId,
          title:     `New message on ticket #${sr.ticketNumber}`,
          message:   `${req.user.name}: "${req.body.message.slice(0, 80)}"`,
          type:      'general',
          relatedId: sr.id,
        });
      }

      // Return full message with sender
      const full = await ChatMessage.findByPk(msg.id, {
        include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role', 'avatar'] }],
      });

      res.status(201).json({ message: full });
    } catch (err) {
      console.error('Chat send error:', err);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
);

// ── GET /api/request-chat/:requestId/unread ───────────────────────────────────
// Unread count for a specific request
router.get('/:requestId/unread', async (req, res) => {
  try {
    const count = await ChatMessage.count({
      where: {
        requestId: req.params.requestId,
        senderId:  { [Op.ne]: req.user.id },
        isRead:    false,
      },
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

module.exports = router;
