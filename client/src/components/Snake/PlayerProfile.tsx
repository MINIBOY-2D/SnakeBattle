import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { User, Edit3, Save, X, Trophy } from "lucide-react";
import { useFirebasePlayer } from "../../lib/stores/useFirebasePlayer";
import { useFirebaseLeaderboard } from "../../lib/stores/useFirebaseLeaderboard";

export function PlayerProfile() {
  const { getPlayer, updatePlayerName, clearPlayer } = useFirebasePlayer();
  const { updatePlayerName: updateLeaderboardNames, getPlayerEntries, getPlayerBestScore } = useFirebaseLeaderboard();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  
  const player = getPlayer();
  const playerEntries = player ? getPlayerEntries(player.id) : [];
  const bestScore = player ? getPlayerBestScore(player.id) : 0;
  const totalGames = playerEntries.length;
  const averageScore = totalGames > 0 ? Math.round(playerEntries.reduce((sum, entry) => sum + entry.score, 0) / totalGames) : 0;
  
  const handleStartEdit = () => {
    setNewName(player?.name || "");
    setIsEditing(true);
  };
  
  const handleSaveEdit = async () => {
    if (player && newName.trim() && newName.trim() !== player.name) {
      const trimmedName = newName.trim();
      try {
        await updatePlayerName(trimmedName);
        await updateLeaderboardNames(player.id, trimmedName);
      } catch (error) {
        console.error("Error updating player name:", error);
      }
    }
    setIsEditing(false);
    setNewName("");
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewName("");
  };
  
  if (!player) {
    return (
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardContent className="pt-6 text-center">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-400">Aucun joueur créé</p>
          <p className="text-sm text-gray-500">Jouez une partie pour créer votre profil</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-blue-500" />
          Profil Joueur
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Player Name Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Pseudo</span>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartEdit}
                className="text-gray-400 hover:text-white p-1"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                maxLength={20}
                placeholder="Nouveau pseudo"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveEdit}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Sauvegarder
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-lg font-medium text-white">
              {player.name}
            </div>
          )}
        </div>
        
        {/* Player Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{bestScore}</div>
            <div className="text-sm text-gray-400">Meilleur Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{totalGames}</div>
            <div className="text-sm text-gray-400">Parties Jouées</div>
          </div>
        </div>
        
        {totalGames > 0 && (
          <div className="text-center pt-2">
            <div className="text-lg font-bold text-green-500">{averageScore}</div>
            <div className="text-sm text-gray-400">Score Moyen</div>
          </div>
        )}
        
        {/* Recent Games Badge */}
        {totalGames > 0 && (
          <div className="flex justify-center pt-2">
            <Badge variant="outline" className="bg-gray-800 text-gray-200 border-gray-600">
              <Trophy className="w-3 h-3 mr-1" />
              {totalGames} score{totalGames > 1 ? 's' : ''} enregistré{totalGames > 1 ? 's' : ''}
            </Badge>
          </div>
        )}
        
        {/* Player ID (for debugging/support) */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-700">
          ID: {player.id.split('_')[1]}
        </div>
      </CardContent>
    </Card>
  );
}