const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, requireVerified } = require('../middleware/auth');
const { ChatMessage, ServiceRequest, User, Technician, Notification } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();
router.use(authenticate, requireVerified);

// ── Helper: verify user has access to this request's chat ────────────────────
async function getRequestAndVerifyAccess(requestId, user) {
  const request = await ServiceRequest.findByPk(requestId, {
    include: [
      { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
      {
        model: Technician, as: 'technician',
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      },
    ],
  });

  if (!request) return { error: 'Request not found', status: 404 };

  const isCustomer   = request.userId === user.id;
  const isTechnician = request.technician?.user?.id === user.id;
  const isAdmin      = user.role === 'admin';

  if (!isCustomer && !isTechnician && !isAdmin) {
    return { error: 'Access denied', status: 403 };
  }

  // Chat only allowed after technician is assigned
  const chatAllowed = ['assigned', 'accepted', 'in_progress', 'completed'].includes(request.status);
  if (!chatAllowed) {
    return { error: 'Chat is available once a technician is assigned to your request', status: 403 };
  }

  return { request, isCustomer, isTechnician, isAdmin };
}

// ── GET /api/chat/:requestId — load messages ──────────────────────────────────
router.get('/:requestId', async (req, res) => {
  try {
    const result = await getRequestAndVerifyAccess(req.params.requestId, req.user);
    if (result.error) return res.status(result.status).json({ error: result.error });

    const messages = await ChatMessage.findAll({
      where: { requestId: req.params.requestId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
      order: [['createdAt', 'ASC']],
    });

    // Mark unread messages as read (messages not sent by current user)
    await ChatMessage.update(
      { isRead: true },
      { where: { requestId: req.params.requestId, senderId: { [Op.ne]: req.user.id }, isRead: false } }
    );

    res.json({
      messages,
      request: {
        id: result.request.id,
        ticketNumber: result.request.ticketNumber,
        status: result.request.status,
        customer: result.request.customer,
        technician: result.request.technician?.user || null,
      },
      myId: req.user.id,
    });
  } catch (err) {
    console.error('Chat fetch error:', err);
    res.status(500).json({ error: 'Failed to load chat' });
  }
});

// ── GET /api/chat/:requestId/unread — unread count ────────────────────────────
router.get('/:requestId/unread', async (req, res) => {
  try {
    const count = await ChatMessage.count({
      where: { requestId: req.params.requestId, senderId: { [Op.ne]: req.user.id }, isRead: false },
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// ── POST /api/chat/:requestId — send a message ────────────────────────────────
router.post(
  '/:requestId',
  [body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const result = await getRequestAndVerifyAccess(req.params.requestId, req.user);
      if (result.error) return res.status(result.status).json({ error: result.error });

      const { request, isCustomer, isTechnician } = result;
      const senderRole = isCustomer ? 'customer' : 'technician';

      const msg = await ChatMessage.create({
        requestId:  request.id,
        senderId:   req.user.id,
        senderRole,
        message:    req.body.message,
      });

      // Notify the other party
      let notifyUserId = null;
      let notifyTitle  = '';
      let notifyMsg    = '';

      if (isCustomer && request.technician?.user) {
        notifyUserId = request.technician.user.id;
        notifyTitle  = `New message from ${req.user.name}`;
        notifyMsg    = `Customer message on ticket #${request.ticketNumber}: "${req.body.message.slice(0, 80)}"`;
      } else if (isTechnician) {
        notifyUserId = request.userId;
        notifyTitle  = `Technician sent you a message`;
        notifyMsg    = `${req.user.name} on ticket #${request.ticketNumber}: "${req.body.message.slice(0, 80)}"`;
      }

      if (notifyUserId) {
        await Notification.create({
          userId:    notifyUserId,
          title:     notifyTitle,
          message:   notifyMsg,
          type:      'general',
          relatedId: request.id,
        });
      }

      // Return with sender info
      const full = await ChatMessage.findByPk(msg.id, {
        include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
      });

      res.status(201).json({ message: full });
    } catch (err) {
      console.error('Chat send error:', err);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
);

module.exports = router;
