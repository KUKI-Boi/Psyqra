import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const TEST_TEXT = "The quick brown fox jumps over the lazy dog. Programming is the art of algorithm design and the craft of debugging errant code. Typing fast requires practice, muscle memory, and a calm focus.";

// State
let waitingPlayer = null;
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('joinQueue', () => {
    if (waitingPlayer && waitingPlayer.id !== socket.id) {
      // Match found
      const roomId = `room_${waitingPlayer.id}_${socket.id}`;
      rooms.set(roomId, {
        id: roomId,
        text: TEST_TEXT,
        players: {
          [waitingPlayer.id]: { id: waitingPlayer.id, progress: 0, health: 100, isWinner: false },
          [socket.id]: { id: socket.id, progress: 0, health: 100, isWinner: false },
        },
        isActive: true,
      });

      socket.join(roomId);
      waitingPlayer.join(roomId);

      // Notify both players start of match
      io.to(roomId).emit('matchFound', {
        roomId,
        text: TEST_TEXT,
        players: rooms.get(roomId).players,
      });

      console.log(`Match started in ${roomId}`);
      waitingPlayer = null;
    } else {
      // Wait in queue
      waitingPlayer = socket;
      socket.emit('waiting', { message: 'Waiting for opponent...' });
    }
  });

  socket.on('typingProgress', ({ roomId, progress }) => {
    const room = rooms.get(roomId);
    if (!room || !room.isActive) return;

    // Update their progress
    if (room.players[socket.id]) {
        // Did they progress correctly?
        // We'll trust the client progress for now to keep sync lightweight
        // Each correct tick deals damage to the opponent
        const prevProgress = room.players[socket.id].progress;
        if (progress > prevProgress) {
            // Find opponent
            const opponentId = Object.keys(room.players).find(id => id !== socket.id);
            if (opponentId) {
                room.players[opponentId].health = Math.max(0, room.players[opponentId].health - 1);
            }
        }
        room.players[socket.id].progress = progress;
    }

    // Check Win/Loss conditions
    checkForGameEnd(roomId);

    // Broadcast updated state to room
    io.to(roomId).emit('gameStateUpdate', room.players);
  });

  socket.on('typingError', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || !room.isActive) return;

    if (room.players[socket.id]) {
      // Mistakes hurt own health
      room.players[socket.id].health = Math.max(0, room.players[socket.id].health - 2);
    }

    checkForGameEnd(roomId);
    io.to(roomId).emit('gameStateUpdate', room.players);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }

    // Handle mid-match disconnects
    rooms.forEach((room, roomId) => {
      if (room.players[socket.id] && room.isActive) {
        room.isActive = false;
        const opponentId = Object.keys(room.players).find((id) => id !== socket.id);
        
        if (opponentId) {
            room.players[opponentId].isWinner = true;
            io.to(roomId).emit('gameOver', { winner: opponentId, reason: 'Opponent disconnected' });
        }
        rooms.delete(roomId);
      }
    });
  });

  const checkForGameEnd = (roomId) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const players = Object.values(room.players);
    let winnerId = null;

    // 1. Check if someone health is 0
    const deadPlayer = players.find(p => p.health <= 0);
    if (deadPlayer) {
        winnerId = players.find(p => p.id !== deadPlayer.id).id;
    }

    // 2. Check if someone finished the text first
    if (!winnerId) {
        const finishedPlayer = players.find(p => p.progress >= room.text.length);
        if (finishedPlayer) {
            winnerId = finishedPlayer.id;
        }
    }

    if (winnerId) {
        room.isActive = false;
        room.players[winnerId].isWinner = true;
        io.to(roomId).emit('gameOver', { winner: winnerId, reason: 'Victory achieved' });
        
        // Clean up room after a short delay
        setTimeout(() => rooms.delete(roomId), 5000);
    }
  };
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
