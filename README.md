# 📅 Suivi de Congés

Une application web statique intuitive pour suivre et gérer vos jours de congés annuels, RTT et autres absences.

Utilisable directement via GitHub pages: [Suivi Congés](https://julien-paoletti.github.io/suivi-conges/)

## ✨ Fonctionnalités

### 🎯 Gestion des congés

- **Sélection simple** : Cliquez sur un jour pour le marquer comme congé
- **Cycle de types** : Chaque clic change le type de congé (Congés Annuels → RTT → Autres → Réinitialiser)
- **Glisser-déposer** : Sélectionnez rapidement plusieurs jours en glissant la souris
- **Compteurs en temps réel** : Visualisez instantanément le nombre de jours par type
- **Numérotation des semaines** : Affichage des numéros de semaine selon la norme ISO 8601

### 🏫 Vacances scolaires

- Sélection de zone (A, B ou C)
- Affichage automatique des vacances scolaires françaises
- Données pour 2025-2026
- Icône d'aide pour identifier votre zone

### 🎨 Interface utilisateur

- **Design moderne** : Interface épurée avec dégradés et animations
- **Thème sombre** : Basculez facilement entre mode clair et sombre
- **Responsive** : Adapté aux ordinateurs, tablettes et mobiles
- **Jours fériés** : Affichage automatique des jours fériés français
- **Indicateur du jour actuel** : Le jour d'aujourd'hui est mis en évidence

### 💾 Sauvegarde et export

- **Sauvegarde automatique** : Vos données sont enregistrées dans le navigateur
- **Export JSON** : Téléchargez une copie de vos données
- **Import JSON** : Restaurez vos données depuis un fichier
- **Fusion intelligente** : Choisissez de fusionner ou remplacer lors de l'import

### 🛠️ Outils pratiques

- **Réinitialisation par mois** : Supprimez tous les congés d'un mois en un clic
- **Navigation annuelle** : Passez facilement d'une année à l'autre
- **Aide intégrée** : Guide complet accessible en un clic

## 🚀 Installation

Aucune installation requise ! Il s'agit d'une application web statique.

### Utilisation locale

1. Clonez ou téléchargez ce dépôt
2. Ouvrez le fichier `index.html` dans votre navigateur web

### Déploiement

Vous pouvez déployer cette application sur n'importe quel hébergement web statique :

- GitHub Pages
- Netlify
- Vercel
- Hébergement web traditionnel

Copiez simplement les fichiers suivants :

- `index.html`
- `styles.css`
- `app.js`

## 📖 Guide d'utilisation

### Sélectionner des jours de congés

1. **Clic simple** : Cliquez sur un jour pour le marquer
2. **Cycle de couleurs** :
   - 1er clic : Congés Annuels (vert)
   - 2e clic : RTT (bleu)
   - 3e clic : Autres (orange)
   - 4e clic : Retour à l'état normal
3. **Glisser-déposer** : Maintenez le bouton de la souris et glissez pour sélectionner plusieurs jours

### Vacances scolaires

1. Sélectionnez votre zone dans la liste déroulante
2. Les vacances apparaissent avec un contour violet
3. Cliquez sur l'icône **?** pour savoir quelle zone choisir

### Exporter/Importer

- **Exporter** : Bouton "Exporter JSON" pour télécharger vos données
- **Importer** : Bouton "Importer JSON" pour restaurer des données

### Thème

Cliquez sur l'icône ☀️/🌙 en haut à droite pour basculer entre thème clair et sombre.

## 🎨 Légende des couleurs

| Couleur          | Type               | Description                             |
| ---------------- | ------------------ | --------------------------------------- |
| 🟢 Vert           | Congés Annuels     | Jours de congés payés annuels           |
| 🔵 Bleu           | RTT                | Jours de Réduction du Temps de Travail  |
| 🟠 Orange         | Autres             | Autres types d'absences                 |
| 🔴 Rouge          | Jours fériés       | Jours fériés français (non modifiables) |
| 🟣 Contour violet | Vacances scolaires | Vacances scolaires selon la zone        |
| ⚪ Gris           | Weekends           | Samedis et dimanches                    |

## 🏗️ Structure du projet

```plain
suivi-congés/
├── index.html          # Structure HTML de l'application
├── styles.css          # Styles et thèmes (clair/sombre)
├── app.js              # Logique JavaScript
└── README.md           # Ce fichier
```

## 🔧 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Design moderne avec flexbox, grid, animations
- **JavaScript (Vanilla)** : Logique applicative sans framework
- **LocalStorage API** : Sauvegarde locale des données
- **File API** : Import/Export de fichiers JSON

## 📋 Fonctionnalités détaillées

### Calcul des jours fériés

L'application calcule automatiquement les jours fériés français :

- Jours fixes (Nouvel An, Fête du Travail, 14 juillet, etc.)
- Jours mobiles calculés via l'algorithme de Meeus pour Pâques

### Numérotation des semaines

Les numéros de semaine suivent la norme **ISO 8601** utilisée en France :

- La semaine 1 est celle qui contient le premier jeudi de l'année
- Les semaines commencent le lundi

### Zones de vacances scolaires

**Zone A** : Besançon, Bordeaux, Clermont-Ferrand, Dijon, Grenoble, Limoges, Lyon, Poitiers

**Zone B** : Aix-Marseille, Amiens, Caen, Lille, Nancy-Metz, Nantes, Nice, Orléans-Tours, Reims, Rennes, Rouen, Strasbourg

**Zone C** : Créteil, Montpellier, Paris, Toulouse, Versailles

## 🔒 Confidentialité

- Toutes les données restent sur votre appareil (LocalStorage)
- Aucune donnée n'est envoyée à un serveur
- L'export JSON vous permet de sauvegarder vos données localement

## 🐛 Problèmes connus

Si vous rencontrez des problèmes :

1. Vérifiez que JavaScript est activé dans votre navigateur
2. Essayez de vider le cache de votre navigateur
3. Assurez-vous d'utiliser un navigateur moderne (Chrome, Firefox, Edge, Safari)

## 📱 Compatibilité

- ✅ Chrome/Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Navigateurs mobiles iOS/Android

## 🎯 Fonctionnalités futures possibles

- [ ] Export PDF du calendrier
- [ ] Partage de calendrier via URL
- [ ] Ajout d'événements personnalisés
- [ ] Intégration avec Google Calendar
- [ ] Application Progressive Web App (PWA)
- [ ] Multi-utilisateurs avec synchronisation cloud

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel et professionnel.

## 👤 Auteur

Développé avec ❤️ et Claude AI

## 🙏 Remerciements

- Design inspiré par les tendances modernes du web
- Données des vacances scolaires : Calendrier officiel de l'Éducation Nationale
- Calcul de Pâques : Algorithme de Meeus

---

**Bonne gestion de vos congés ! 🌴**
