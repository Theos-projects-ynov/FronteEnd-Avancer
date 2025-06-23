import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    LinearProgress,
    Alert,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import { battleService } from "../../service/battleService";
import type { OwnedPokemon } from "../../type/Trainer";
import "../../style/page/battle.scss";

interface Move {
  id: number;
  name: string;
  power: number;
  accuracy: number;
  type: string;
}

interface BattleData {
  playerPokemon: {
    id: string;
    name: string;
    currentHp: number;
    maxHp: number;
    level: number;
    moves: Move[];
  };
  enemyPokemon: {
    id: string;
    name: string;
    currentHp: number;
    maxHp: number;
    level: number;
  };
  turn: 'player' | 'enemy';
  battleLog: string[];
}

interface LocationState {
  selectedPokemon: OwnedPokemon[];
  dungeonId: number;
}

function BattlePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [battleData, setBattleData] = useState<BattleData | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState("");
  const [battleEnded, setBattleEnded] = useState(false);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [connectionState, setConnectionState] = useState<string>('');

  useEffect(() => {
    if (!state?.selectedPokemon || state.selectedPokemon.length !== 4) {
      navigate('/donjon');
      return;
    }

    document.title = "PokéDex - Combat";
    initializeBattle();

    return () => {
      battleService.disconnect();
    };
  }, []);

  const initializeBattle = async () => {
    try {
      setError("");
      setConnectionState("Connexion en cours...");
      
      console.log('🎮 Initialisation du combat');
      console.log('👥 Équipe sélectionnée:', state.selectedPokemon.map(p => ({ id: p.id, name: p.pokedexId })));
      console.log('🏰 Donjon ID:', state.dungeonId);
      
      await battleService.connect();
      
      // Écouter les événements de bataille
      battleService.on('AUTHENTICATED', handleAuthenticated);
      battleService.on('BATTLE_CREATED', handleBattleCreated);
      battleService.on('BATTLE_STARTED', handleBattleStarted);
      battleService.on('BATTLE_UPDATE', handleBattleUpdate);
      battleService.on('BATTLE_END', handleBattleEnd);
      battleService.on('disconnect', handleDisconnect);
      battleService.on('auth_error', handleAuthError);
      battleService.on('connection_error', handleConnectionError);

      setConnectionState("Authentifié, sélection équipe...");

      // Sélectionner l'équipe
      const teamIds = state.selectedPokemon.map(p => p.id);
      battleService.selectTeam(teamIds, state.dungeonId);

      setConnectionState("Équipe sélectionnée, démarrage combat...");

      // Démarrer avec le premier Pokémon
      setTimeout(() => {
        battleService.startBattle(state.selectedPokemon[0].id);
        setConnectionState("Combat démarré !");
      }, 1000);

      setIsConnecting(false);
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      setError(`Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsConnecting(false);
    }
  };

  const handleAuthenticated = (data: unknown) => {
    console.log('🔐 Authentification réussie:', data);
    setConnectionState("Authentifié !");
  };

  const handleBattleCreated = (data: unknown) => {
    console.log('⚔️ Combat créé:', data);
    setConnectionState("Combat créé, en attente...");
  };

  const handleBattleStarted = (data: unknown) => {
    console.log('🚀 Combat démarré:', data);
    setConnectionState("Combat en cours !");
    setBattleData(data as BattleData);
    setIsConnecting(false);
  };

  const handleBattleUpdate = (data: unknown) => {
    console.log('⚔️ Mise à jour combat:', data);
    setBattleData(data as BattleData);
  };

  const handleBattleEnd = (result: unknown) => {
    console.log('🏁 Fin du combat:', result);
    const battleResult = result as { winner: 'player' | 'enemy'; rewards?: unknown };
    setBattleEnded(true);
    setBattleResult(battleResult.winner === 'player' ? 'victory' : 'defeat');
  };

  const handleDisconnect = () => {
    console.log('🔌 Déconnexion détectée');
    setError("Connexion perdue avec le serveur");
  };

  const handleAuthError = (error: unknown) => {
    console.error('🔐 Erreur d\'authentification:', error);
    setError("Erreur d'authentification - Reconnectez-vous");
  };

  const handleConnectionError = (error: unknown) => {
    console.error('📡 Erreur de connexion:', error);
    setError(`Erreur de connexion: ${error}`);
  };

  const handleAttack = (moveId: number) => {
    if (battleData?.turn === 'player' && !battleEnded) {
      battleService.attack(moveId);
    }
  };

  const handleReturnToDungeon = () => {
    navigate('/donjon');
  };

  const getHpPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const getHpColor = (percentage: number) => {
    if (percentage > 50) return 'success';
    if (percentage > 20) return 'warning';
    return 'error';
  };

  if (isConnecting) {
    return (
      <div className="battle-page">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Card>
            <CardContent>
              <Typography variant="h6" textAlign="center" mb={2}>
                {connectionState}
              </Typography>
              <LinearProgress />
            </CardContent>
          </Card>
        </Box>
      </div>
    );
  }

  if (error && !battleData) {
    return (
      <div className="battle-page">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Card>
            <CardContent>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Button variant="contained" onClick={handleReturnToDungeon}>
                Retourner aux donjons
              </Button>
            </CardContent>
          </Card>
        </Box>
      </div>
    );
  }

  return (
    <div className="battle-page">
      <div className="battle-container">
        {/* Zone de combat principal */}
        <Card className="battle-arena">
          <CardContent>
            {battleData && battleData.enemyPokemon && battleData.playerPokemon ? (
              <>
                {/* Pokémon ennemi */}
                <div className="enemy-section">
                  <div className="pokemon-info">
                    <Typography variant="h6" className="pokemon-name">
                      {battleData.enemyPokemon?.name || 'Pokémon ennemi'}
                    </Typography>
                    <Chip 
                      label={`Niv. ${battleData.enemyPokemon?.level || '?'}`} 
                      size="small" 
                    />
                  </div>
                  <div className="hp-bar-container">
                    <Typography variant="body2" className="hp-text">
                      HP: {battleData.enemyPokemon?.currentHp || 0}/{battleData.enemyPokemon?.maxHp || 100}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getHpPercentage(
                        battleData.enemyPokemon?.currentHp || 0, 
                        battleData.enemyPokemon?.maxHp || 100
                      )}
                      color={getHpColor(getHpPercentage(
                        battleData.enemyPokemon?.currentHp || 0, 
                        battleData.enemyPokemon?.maxHp || 100
                      ))}
                      className="hp-bar"
                    />
                  </div>
                  <div className="pokemon-sprite">
                    <img 
                      src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${battleData.enemyPokemon?.id || 1}/regular.png`}
                      alt={battleData.enemyPokemon?.name || 'Pokémon ennemi'}
                      className="enemy-sprite"
                    />
                  </div>
                </div>

                {/* Zone centrale */}
                <div className="battle-center">
                  <Typography variant="body1" className="turn-indicator">
                    {battleData.turn === 'player' ? "À votre tour !" : "Tour de l'adversaire..."}
                  </Typography>
                </div>

                {/* Pokémon joueur */}
                <div className="player-section">
                  <div className="pokemon-sprite">
                    <img 
                      src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${battleData.playerPokemon?.id || 1}/back.png`}
                      alt={battleData.playerPokemon?.name || 'Mon Pokémon'}
                      className="player-sprite"
                      onError={(e) => {
                        e.currentTarget.src = `https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${battleData.playerPokemon?.id || 1}/regular.png`;
                      }}
                    />
                  </div>
                  <div className="pokemon-info">
                    <Typography variant="h6" className="pokemon-name">
                      {battleData.playerPokemon?.name || 'Mon Pokémon'}
                    </Typography>
                    <Chip 
                      label={`Niv. ${battleData.playerPokemon?.level || '?'}`} 
                      size="small" 
                      color="primary"
                    />
                  </div>
                  <div className="hp-bar-container">
                    <Typography variant="body2" className="hp-text">
                      HP: {battleData.playerPokemon?.currentHp || 0}/{battleData.playerPokemon?.maxHp || 100}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getHpPercentage(
                        battleData.playerPokemon?.currentHp || 0, 
                        battleData.playerPokemon?.maxHp || 100
                      )}
                      color={getHpColor(getHpPercentage(
                        battleData.playerPokemon?.currentHp || 0, 
                        battleData.playerPokemon?.maxHp || 100
                      ))}
                      className="hp-bar"
                    />
                  </div>
                </div>
              </>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <div style={{ textAlign: 'center' }}>
                  <LinearProgress sx={{ mb: 2, width: 200 }} />
                  <Typography variant="h6" color="text.secondary">
                    {connectionState || "Préparation du combat..."}
                  </Typography>
                </div>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Actions de combat */}
        {battleData && battleData.playerPokemon && battleData.playerPokemon.moves && (
          <Card className="battle-actions">
            <CardContent>
              <Typography variant="h6" className="actions-title">
                Attaques disponibles
              </Typography>
              <div className="moves-grid">
                {battleData.playerPokemon.moves.map((move) => (
                  <Button
                    key={move.id}
                    variant="contained"
                    disabled={battleData.turn !== 'player' || battleEnded}
                    onClick={() => handleAttack(move.id)}
                    className="move-button"
                  >
                    <div className="move-info">
                      <Typography variant="subtitle2">{move.name || 'Attaque'}</Typography>
                      <Typography variant="caption">
                        Puissance: {move.power || '?'} | Précision: {move.accuracy || '?'}%
                      </Typography>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Log de combat */}
        {battleData && battleData.battleLog && battleData.battleLog.length > 0 && (
          <Card className="battle-log">
            <CardContent>
              <Typography variant="h6" className="log-title">
                Historique du combat
              </Typography>
              <div className="log-container">
                {battleData.battleLog.slice(-5).map((entry, index) => (
                  <Typography key={index} variant="body2" className="log-entry">
                    {entry}
                  </Typography>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de fin de combat */}
      <Dialog open={battleEnded} onClose={handleReturnToDungeon}>
        <DialogTitle>
          {battleResult === 'victory' ? '🎉 Victoire !' : '💀 Défaite'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {battleResult === 'victory' 
              ? 'Félicitations ! Vous avez remporté le combat !'
              : 'Vous avez été vaincu... Réessayez plus tard !'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnToDungeon} variant="contained">
            Retourner aux donjons
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BattlePage; 