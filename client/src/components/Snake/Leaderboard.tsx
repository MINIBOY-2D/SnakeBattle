import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Trophy, Medal, Award, Trash2 } from "lucide-react";
import { useLeaderboard } from "../../lib/stores/useLeaderboard";

interface LeaderboardProps {
  currentScore?: number;
  highlightScore?: boolean;
}

export function Leaderboard({ currentScore, highlightScore = false }: LeaderboardProps) {
  const { getTopEntries, getRank, clearLeaderboard } = useLeaderboard();
  
  const topEntries = getTopEntries(10);
  const currentRank = currentScore ? getRank(currentScore) : null;
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Leaderboard
        </CardTitle>
        {topEntries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLeaderboard}
            className="text-gray-400 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {highlightScore && currentScore !== undefined && (
          <div className="p-3 bg-blue-900/50 border border-blue-600 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-200 font-medium">Your Score</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-800 text-blue-200 border-blue-600">
                  #{currentRank}
                </Badge>
                <span className="text-blue-100 font-bold">{currentScore}</span>
              </div>
            </div>
          </div>
        )}
        
        {topEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No scores yet!</p>
            <p className="text-sm">Be the first to play and set a record.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  index < 3 
                    ? "bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-600/30" 
                    : "bg-gray-800 hover:bg-gray-750"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(index + 1)}
                  <div>
                    <div className="font-medium text-white">{entry.playerName}</div>
                    <div className="text-sm text-gray-400">
                      Length: {entry.length} • {formatDate(entry.timestamp)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg text-white">{entry.score}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
