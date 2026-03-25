import { io } from 'socket.io-client';

// Connect to local backend for Phase 4
export const socket = io('http://localhost:3001', {
  autoConnect: false, // Don't connect until Battle page mounts
});
