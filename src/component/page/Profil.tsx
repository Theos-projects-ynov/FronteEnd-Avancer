import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    Chip,
    LinearProgress,
    Alert,
    CircularProgress,
} from "@mui/material";
import { Logout, Badge, Height, FitnessCenter } from "@mui/icons-material";
import { AuthService } from "../../service/authService";
import type { Trainer } from "../../type/Trainer";
import "../../style/page/profil.scss";

const Profil = () => {
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const loadTrainerProfile = async () => {
      try {
        setIsLoading(true);
        const trainerData = await AuthService.getTrainerProfile();
        setTrainer(trainerData);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        setError(error instanceof Error ? error.message : "Erreur lors du chargement du profil");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainerProfile();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await AuthService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setError("Erreur lors de la déconnexion");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profil-page">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div className="profil-page">
        <Alert severity="error">
          {error || "Erreur lors du chargement du profil. Veuillez vous reconnecter."}
        </Alert>
      </div>
    );
  }

  return (
    <div className="profil-page">
      <div className="profil-container">
        <Card className="profil-card">
          <CardContent>
            <Box className="profil-header">
              <Avatar
                src={trainer.image}
                alt={trainer.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h4" component="h1" className="profil-name">
                {trainer.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {trainer.email}
              </Typography>
              <Chip 
                label={trainer.isAdmin ? "Administrateur" : "Dresseur"} 
                color={trainer.isAdmin ? "secondary" : "primary"}
                sx={{ mt: 1 }}
              />
            </Box>

            <div className="profil-info">
              <Card variant="outlined" className="info-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informations générales
                  </Typography>
                  <Box className="info-item">
                    <Typography variant="body2" color="text.secondary">
                      Région
                    </Typography>
                    <Typography variant="body1">{trainer.region}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="body2" color="text.secondary">
                      Genre
                    </Typography>
                    <Typography variant="body1">{trainer.gender}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Height fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        Taille
                      </Typography>
                    </Box>
                    <Typography variant="body1">{trainer.height}m</Typography>
                  </Box>
                  <Box className="info-item">
                    <Box display="flex" alignItems="center" gap={1}>
                      <FitnessCenter fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        Poids
                      </Typography>
                    </Box>
                    <Typography variant="body1">{trainer.weight}kg</Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" className="info-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Progression
                  </Typography>
                  <Box className="info-item">
                    <Typography variant="body2" color="text.secondary">
                      Niveau
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {trainer.level}
                    </Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="body2" color="text.secondary">
                      Expérience
                    </Typography>
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(trainer.exp % 1000) / 10} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {trainer.exp} XP
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {trainer.badge && trainer.badge.length > 0 && (
                <Card variant="outlined" className="info-card full-width">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Badge />
                      <Typography variant="h6">
                        Badges ({trainer.badge.length})
                      </Typography>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {trainer.badge.map((badge, index) => (
                        <Chip
                          key={index}
                          label={badge}
                          variant="outlined"
                          color="secondary"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {trainer.description && (
                <Card variant="outlined" className="info-card full-width">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {trainer.description}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </div>

            <Box className="profil-actions">
              <Button
                variant="outlined"
                color="error"
                startIcon={<Logout />}
                onClick={handleLogout}
                disabled={isLoggingOut}
                size="large"
              >
                {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profil; 