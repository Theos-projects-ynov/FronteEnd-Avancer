import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../../style/page/register.scss";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!firstName || !lastName || !email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation");
      setLoading(false);
      return;
    }

    // Simulation d'inscription
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Redirection vers la page de connexion après inscription
      navigate("/login");
    } catch {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <Card className="register-card">
          <CardContent>
            <Box className="register-header">
              <Typography variant="h4" component="h1" className="register-title">
                Inscription
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Créez votre compte PokéDex
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" className="register-error">
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} className="register-form">
              <TextField
                fullWidth
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin="normal"
                required
                autoComplete="given-name"
                autoFocus
              />

              <TextField
                fullWidth
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                margin="normal"
                required
                autoComplete="family-name"
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label="J'accepte les conditions d'utilisation"
                className="terms-checkbox"
                sx={{ mt: 1, mb: 1 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                className="register-button"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "Inscription..." : "S'inscrire"}
              </Button>

              <Box className="register-links">
                <Typography variant="body2" align="center">
                  Déjà un compte ?{" "}
                  <Link to="/login" className="login-link">
                    Se connecter
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register; 