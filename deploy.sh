#!/bin/bash

###############################################################################
# Script de déploiement pour l'application Pokecard
# Destination: /var/www/pokecard
# Port: 5000
###############################################################################

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/pokecard"
APP_NAME="pokecard"
PORT=5000

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Déploiement de Pokecard${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 1. Vérifier si le répertoire existe
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠️  Le répertoire $PROJECT_DIR n'existe pas.${NC}"
    echo -e "${BLUE}📁 Création du répertoire...${NC}"
    sudo mkdir -p $PROJECT_DIR
    echo -e "${GREEN}✅ Répertoire créé${NC}\n"
fi

# 2. Copier les fichiers du projet
echo -e "${BLUE}📦 Copie des fichiers du projet...${NC}"
sudo cp -r backend $PROJECT_DIR/
sudo cp -r frontend $PROJECT_DIR/
sudo cp package.json $PROJECT_DIR/ 2>/dev/null || true
echo -e "${GREEN}✅ Fichiers copiés${NC}\n"

# 3. Installer les dépendances backend
echo -e "${BLUE}📚 Installation des dépendances backend...${NC}"
cd $PROJECT_DIR/backend
sudo npm install --production
echo -e "${GREEN}✅ Dépendances backend installées${NC}\n"

# 4. Build du frontend
echo -e "${BLUE}🔨 Build du frontend...${NC}"
cd $PROJECT_DIR/frontend
sudo npm install
sudo npm run build
echo -e "${GREEN}✅ Frontend buildé${NC}\n"

# 5. Modifier le port dans le fichier serveur
echo -e "${BLUE}⚙️  Configuration du port $PORT...${NC}"
sudo sed -i "s/const PORT = process.env.PORT || [0-9]*/const PORT = process.env.PORT || $PORT/" $PROJECT_DIR/backend/server/index.js
echo -e "${GREEN}✅ Port configuré${NC}\n"

# 6. Vérifier si l'application existe déjà dans PM2
if pm2 list | grep -q "$APP_NAME"; then
    echo -e "${YELLOW}🔄 Application existante détectée. Mise à jour...${NC}"
    pm2 delete $APP_NAME
    echo -e "${GREEN}✅ Ancienne instance supprimée${NC}\n"
fi

# 7. Démarrer l'application avec PM2
echo -e "${BLUE}🚀 Démarrage de l'application avec PM2...${NC}"
cd $PROJECT_DIR/backend
pm2 start server/index.js --name "$APP_NAME" --time
echo -e "${GREEN}✅ Application démarrée${NC}\n"

# 8. Sauvegarder la configuration PM2
echo -e "${BLUE}💾 Sauvegarde de la configuration PM2...${NC}"
pm2 save
echo -e "${GREEN}✅ Configuration sauvegardée${NC}\n"

# 9. Configurer PM2 pour démarrer au boot (si pas déjà fait)
echo -e "${BLUE}🔧 Configuration du démarrage automatique...${NC}"
pm2 startup systemd -u $USER --hp $HOME > /dev/null 2>&1 || true
echo -e "${GREEN}✅ Démarrage automatique configuré${NC}\n"

# 10. Afficher le statut
echo -e "${BLUE}📊 Statut de l'application:${NC}"
pm2 list | grep "$APP_NAME"
echo ""

# 11. Récupérer l'IP du serveur
SERVER_IP=$(hostname -I | awk '{print $1}')

# 12. Message final
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✅ Déploiement terminé avec succès!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}🌐 Accès à l'application:${NC}"
echo -e "${YELLOW}   http://$SERVER_IP:$PORT${NC}"
echo -e "${YELLOW}   http://localhost:$PORT${NC} (si vous êtes sur le serveur)\n"

echo -e "${BLUE}📝 Commandes utiles PM2:${NC}"
echo -e "   pm2 logs $APP_NAME       - Voir les logs"
echo -e "   pm2 restart $APP_NAME    - Redémarrer l'app"
echo -e "   pm2 stop $APP_NAME       - Arrêter l'app"
echo -e "   pm2 delete $APP_NAME     - Supprimer l'app"
echo -e "   pm2 monit                - Monitoring en temps réel\n"

echo -e "${YELLOW}⚠️  Note de sécurité:${NC}"
echo -e "   N'oubliez pas d'ouvrir le port $PORT dans votre firewall si nécessaire:"
echo -e "   ${BLUE}sudo ufw allow $PORT/tcp${NC}\n"
