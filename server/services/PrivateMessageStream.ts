// services/PrivateMessageStream.ts
import { Server } from 'socket.io';
import MessageSchema from '../models/MessageSchema';
import Conversation from '../models/Conversation';
import mongoose from 'mongoose';

export const startMessageChangeStream = (io: Server) => {
  // Message change stream with proper configuration
  const messageChangeStream = MessageSchema.watch([], {
    fullDocument: 'updateLookup'
  });

  // Conversation change stream with same configuration
  const conversationChangeStream = Conversation.watch([], {
    fullDocument: 'updateLookup'
  });

  // Store user filters by socket ID
  const userFilters = new Map<string, mongoose.Types.ObjectId>();

  // Socket.IO connection handler
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      userFilters.delete(socket.id);
    });

    socket.on('test', (data: { userId: string }) => {
      try {
        // Convert string ID to ObjectId and store it
        const userId = new mongoose.Types.ObjectId(data.userId);
        userFilters.set(socket.id, userId);
        console.log(`Stored filter for socket ${socket.id}:`, userId);
      } catch (error) {
        console.error('Invalid user ID format:', data.userId, error);
      }
    });
  });

  console.log('[ChangeStream] Watching collections...');

  // Message change handler (unchanged)
  messageChangeStream.on('change', (change) => {
    try {
      if (change.operationType === 'insert' && change.fullDocument) {
        const messageData = {
          Id: change.fullDocument._id,
          content: change.fullDocument.content,
          sender: change.fullDocument.sender,
          conversation: change.fullDocument.conversation,
          createdAt: change.fullDocument.createdAt
        };
        io.emit('new-message', messageData);
      }
    } catch (error) {
      console.error('[MessageChangeStream] Error processing change:', error);
    }
  });

conversationChangeStream.on('change', async (change) => {
  try {
    if (change.operationType === 'update' && change.fullDocument) {
      const conversation = change.fullDocument;
      
      // Find all sockets that should receive this update
      const socketsToUpdate = Array.from(userFilters.entries())
        .filter(([, userId]) => 
          conversation.participants.some(participant => 
            participant.equals(userId)
          )
        )
        .map(([socketId]) => socketId);

      if (socketsToUpdate.length === 0) return;

      // Populate participants and lastMessage
      const populatedConvo = await Conversation.findById(conversation._id)
        .populate({
          path: 'participants',
          select: '_id username name email avatar status', // Include the fields you need
          model: 'User'
        })
        .populate({
          path: 'lastMessage',
          select: 'content sender createdAt', // Include message fields you need
          populate: {
            path: 'sender',
            select: 'username avatar', // Populate sender info in lastMessage
            model: 'User'
          }
        })
        .lean()
        .exec();

      if (!populatedConvo) return;

      const inboxData = {
        Id: populatedConvo._id,
        participants: populatedConvo.participants, // Now populated with user objects
        lastMessage: populatedConvo.lastMessage, // Now populated with message and sender
        conversationType: populatedConvo.conversationType,
        updatedAt: populatedConvo.updatedAt
      };

      // Emit only to relevant sockets
      socketsToUpdate.forEach(socketId => {
        io.to(socketId).emit('updated-inbox', inboxData);
      });
    }
  } catch (error) {
    console.error('[ConversationChangeStream] Error processing change:', error);
  }
});

  // Error handlers
  messageChangeStream.on('error', (err) => {
    console.error('[MessageChangeStream] Error:', err);
  });

  conversationChangeStream.on('error', (err) => {
    console.error('[ConversationChangeStream] Error:', err);
  });
};