import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Gamepad2,
  Trophy
} from "lucide-react";
import { useSnake } from "../../lib/stores/useSnake";
import { useFirebaseLeaderboard } from "../../lib/stores/useFirebaseLeaderboard";
import { useAudio } from "../../lib/stores/useAudio";
import { useFirebasePlayer } from "../../lib/stores/useFirebasePlayer";
import { Leaderboard } from "./Leaderboard";
import { ScoreNotification } from "./ScoreNotification";

export function GameUI() {
  const {
    phase,
    score,
    snake,
    speed,
    settings,
    start,
    pause,
    resume,
    restart,
  } = useSnake();
  
  const { addEntry, updatePlayerName } = useFirebaseLeaderboard();
  const { isMuted, toggleMute, playSuccess } = useAudio();
  const { createOrGetPlayer, updatePlayerName: updatePlayerNameInStore, getPlayer, initializePlayer } = useFirebasePlayer();
  
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [savedToLeaderboard, setSavedToLeaderboard] = useState(false);
  const [isNewPlayer, setIsNewPlayer] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [previousBest, setPreviousBest] = useState(0);
  
  // Initialize Firebase player
  useEffect(() => {
    initializePlayer();
  }, [initializePlayer]);

  // Initialize player name from stored player
  useEffect(() => {
    const player = getPlayer();
    if (player) {
      setPlayerName(player.name);
      setIsNewPlayer(false);
    } else {
      setIsNewPlayer(true);
    }
  }, [getPlayer]);

  // Reset states when game restarts
  useEffect(() => {
    if (phase === "ready") {
      setShowNameInput(false);
      setSavedToLeaderboard(false);
      setShowNotification(false);
      setIsNewRecord(false);
      setPreviousBest(0);
    }
  }, [phase]);
  
  // Play success sound when game ends with a good score
  useEffect(() => {
    if (phase === "ended" && score > 0) {
      playSuccess();
    }
  }, [phase, score, playSuccess]);
  
  const handleStart = () => {
    start();
  };
  
  const handlePause = () => {
    if (phase === "playing") {
      pause();
    } else if (phase === "paused") {
      resume();
    }
  };
  
  const handleRestart = () => {
    restart();
  };
  
  const handleSaveScore = async () => {
    if (score > 0 && !savedToLeaderboard) {
      try {
        const finalPlayerName = playerName.trim() || "Anonymous";
        const player = getPlayer();
        const ipAddress = player?.ip || "unknown";
        
        const playerId = await createOrGetPlayer(finalPlayerName, ipAddress);
        
        // Get player's previous best score
        const { getPlayerBestScore } = useFirebaseLeaderboard.getState();
        const playerBestScore = getPlayerBestScore(playerId);
        const isRecord = score > playerBestScore;
        
        // Update player name in store if it changed
        if (!isNewPlayer && finalPlayerName !== getPlayer()?.name) {
          await updatePlayerNameInStore(finalPlayerName);
          await updatePlayerName(playerId, finalPlayerName);
        }
        
        await addEntry(playerId, finalPlayerName, score, snake.length, ipAddress);
        
        setSavedToLeaderboard(true);
        setShowNameInput(false);
        setIsNewPlayer(false);
        
        // Show notification
        setIsNewRecord(isRecord);
        setPreviousBest(playerBestScore);
        setShowNotification(true);
        
        playSuccess();
      } catch (error) {
        console.error("Error saving score:", error);
        // Could show error message to user here
      }
    }
  };
  
  const currentSpeed = Math.round((1000 / speed) * 10) / 10; // FPS equivalent
  
  return (
    <div className="space-y-4">
      {/* Game Stats */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{snake.length}</div>
              <div className="text-sm text-gray-400">Length</div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="outline" className="bg-gray-800 text-gray-200 border-gray-600">
              Speed: {currentSpeed} FPS
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-gray-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Game Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="pt-6">
          {phase === "ready" && (
            <div className="text-center space-y-4">
              <div className="text-lg font-medium text-white mb-4">Ready to Play!</div>
              <Button 
                onClick={handleStart} 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Use arrow keys or WASD to move
                </div>
                <div>Touch controls available on mobile</div>
              </div>
            </div>
          )}
          
          {(phase === "playing" || phase === "paused") && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button 
                  onClick={handlePause} 
                  variant="outline"
                  className="flex-1 bg-gray-800 border-gray-600 hover:bg-gray-700"
                >
                  {phase === "playing" ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleRestart} 
                  variant="outline"
                  className="flex-1 bg-gray-800 border-gray-600 hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
              </div>
              
              {phase === "paused" && (
                <div className="text-center text-yellow-400 font-medium">
                  Game Paused
                </div>
              )}
            </div>
          )}
          
          {phase === "ended" && (
            <div className="text-center space-y-4">
              <div className="text-lg font-medium text-red-400 mb-2">Game Over!</div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">{score}</div>
                <div className="text-sm text-gray-400">Final Score</div>
              </div>
              
              {!savedToLeaderboard && score > 0 && (
                <div className="space-y-3">
                  {!showNameInput ? (
                    <Button
                      onClick={() => setShowNameInput(true)}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      {isNewPlayer ? "Save to Leaderboard" : "Add Score"}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      {isNewPlayer && (
                        <div className="text-sm text-gray-400 mb-2">
                          Entrez votre pseudo (vous pourrez le changer plus tard)
                        </div>
                      )}
                      {!isNewPlayer && (
                        <div className="text-sm text-gray-400 mb-2">
                          Pseudo actuel: {getPlayer()?.name || "Anonymous"}
                        </div>
                      )}
                      <Input
                        placeholder={isNewPlayer ? "Entrez votre pseudo" : "Nouveau pseudo (optionnel)"}
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        maxLength={20}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveScore();
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSaveScore}
                          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                        >
                          {isNewPlayer ? "Créer et Sauvegarder" : "Sauvegarder Score"}
                        </Button>
                        <Button 
                          onClick={() => setShowNameInput(false)}
                          variant="outline"
                          className="bg-gray-800 border-gray-600"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {savedToLeaderboard && (
                <div className="text-green-400 font-medium">
                  ✓ Score sauvegardé dans le classement !
                </div>
              )}
              
              <Button 
                onClick={handleRestart} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Leaderboard */}
      <Leaderboard 
        currentScore={phase === "ended" ? score : undefined}
        highlightScore={phase === "ended" && score > 0}
        currentPlayerId={getPlayer()?.id}
      />
      
      {/* Score Notification */}
      <ScoreNotification
        isNewRecord={isNewRecord}
        score={score}
        previousBest={previousBest}
        show={showNotification}
        onComplete={() => setShowNotification(false)}
      />
    </div>
  );
}
