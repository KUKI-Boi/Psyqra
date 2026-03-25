// ... existing imports
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import TypingEngine from '../components/typing/TypingEngine';
import PostMatchResult from '../components/typing/PostMatchResult';
import { socket } from '../services/socket';

const HealthBar = ({ health, isOpponent }) => {
  // Color shifting dependent on health
  const getColor = () => {
    if (health > 60) return 'bg-success';
    if (health > 30) return 'bg-accent';
    return 'bg-error animate-pulse';
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between text-sm font-semibold text-white/70 uppercase tracking-widest px-1">
        <span>{isOpponent ? 'Opponent' : 'You'}</span>
        <span>{health} HP</span>
      </div>
      <div className="relative h-4 w-full bg-white/10 rounded-full overflow-hidden shadow-inner backdrop-blur-md">
        <motion.div
          animate={{ width: `${health}%` }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          className={`absolute top-0 bottom-0 left-0 rounded-full ${getColor()} shadow-[0_0_10px_currentColor]`}
        />
      </div>
    </div>
  );
};

const Battle = () => {
  const navigate = useNavigate();
  const [matchState, setMatchState] = useState('searching');
  const [roomId, setRoomId] = useState(null);
  const [text, setText] = useState('');
  const [players, setPlayers] = useState({});
  const [winner, setWinner] = useState(null);
  const [endReason, setEndReason] = useState('');
  
  // Track our local typing stats
  const [localStats, setLocalStats] = useState({ wpm: 0, accuracy: 100, errors: 0 });

  useEffect(() => {
    socket.connect();
    socket.emit('joinQueue');

    socket.on('waiting', () => {
      setMatchState('searching');
    });

    socket.on('matchFound', (data) => {
      setRoomId(data.roomId);
      setText(data.text);
      setPlayers(data.players);
      setMatchState('active');
    });

    socket.on('gameStateUpdate', (newPlayers) => {
      setPlayers(newPlayers);
    });

    socket.on('gameOver', ({ winner: winnerId, reason }) => {
      setWinner(winnerId);
      setEndReason(reason);
      setMatchState('gameover');
    });

    return () => {
      socket.off('waiting');
      socket.off('matchFound');
      socket.off('gameStateUpdate');
      socket.off('gameOver');
      socket.disconnect();
    };
  }, []);

  const handleProgress = useCallback((progressCount) => {
    if (matchState !== 'active' || !roomId) return;
    socket.emit('typingProgress', { roomId, progress: progressCount });
  }, [matchState, roomId]);

  const handleError = useCallback(() => {
    if (matchState !== 'active' || !roomId) return;
    socket.emit('typingError', { roomId });
  }, [matchState, roomId]);

  const handleStatsUpdate = useCallback((stats) => {
      setLocalStats(prev => ({
          ...prev,
          ...stats
      }));
  }, []);

  const myId = socket.id;
  const me = players[myId] || { health: 100, progress: 0 };
  const opponentId = Object.keys(players).find((id) => id !== myId);
  const opponent = players[opponentId] || { health: 100, progress: 0 };

  const handleExit = () => {
    socket.disconnect();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary text-white overflow-hidden relative selection:bg-neon/30">
      
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none opacity-20 bg-gradient-to-b from-accent to-transparent mix-blend-screen mix-blend-overlay"></div>
      
      <header className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center bg-primary/20 backdrop-blur-md border-b border-white/5 shadow-md">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${matchState === 'active' ? 'bg-success text-success' : 'bg-neon text-neon animate-pulse'}`}></div>
          <span className="font-bold tracking-widest text-white/80 uppercase text-sm">
            {matchState === 'searching' ? 'Searching for Match...' : 'Live Match'}
          </span>
        </div>
        <Button onClick={handleExit} variant="secondary" className="px-4 py-2 text-sm !rounded-md">
          {matchState === 'gameover' ? 'Return Home' : 'Forfeit match'}
        </Button>
      </header>

      <Container className="relative z-10 pt-32 pb-20 flex flex-col h-full min-h-screen">
        <AnimatePresence mode="wait">
          
          {matchState === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center gap-8"
            >
              <div className="w-24 h-24 border-4 border-white/10 border-t-neon rounded-full animate-spin"></div>
              <h2 className="text-3xl font-inter animate-pulse text-neon">Waiting for opponent...</h2>
            </motion.div>
          )}

          {matchState === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full flex flex-col gap-10"
            >
              <div className="w-full flex justify-between items-center gap-16 px-4">
                <div className="flex-1 drop-shadow-lg">
                  <HealthBar health={me.health} isOpponent={false} />
                  <div className="mt-2 text-xs text-white/40 uppercase tracking-widest text-left">Progress: {me.progress} / {text.length}</div>
                </div>
                
                <div className="text-4xl font-black text-white/20 px-8 italic">VS</div>
                
                <div className="flex-1 drop-shadow-lg opacity-80">
                  <HealthBar health={opponent.health} isOpponent={true} />
                  <div className="mt-2 text-xs text-white/40 uppercase tracking-widest text-right">Progress: {opponent.progress} / {text.length}</div>
                </div>
              </div>

              <div className="w-full flex justify-center mt-4">
                 <TypingEngine text={text} onProgress={handleProgress} onError={handleError} onStatsUpdate={handleStatsUpdate} />
              </div>
            </motion.div>
          )}

          {matchState === 'gameover' && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-primary/95 backdrop-blur-xl"
            >
              <div className="absolute top-10 left-0 right-0 text-center">
                 <h1 className={`text-6xl font-black drop-shadow-[0_0_20px_currentColor] mb-2 ${winner === myId ? 'text-success' : 'text-error'}`}>
                    {winner === myId ? 'VICTORY' : 'DEFEAT'}
                 </h1>
                 <p className="text-lg text-white/60 font-mono tracking-widest uppercase">{endReason}</p>
              </div>

              {/* Enhanced Stats Reveal Component */}
              <PostMatchResult 
                wpm={localStats.wpm}
                accuracy={localStats.accuracy}
                errors={localStats.errors}
                onRematch={() => window.location.reload()}
                onHome={handleExit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default Battle;
