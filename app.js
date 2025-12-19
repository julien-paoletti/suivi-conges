// État de l'application
const state = {
    currentYear: new Date().getFullYear(),
    days: {}, // { 'YYYY-MM-DD': 'conges' | 'rtt' | 'autres' | null }
    selectedZone: '', // '', 'A', 'B', ou 'C'
    isDragging: false,
    dragStartDate: null,
    dragType: null, // Type de congé à appliquer lors du glisser-déposer
    darkTheme: false // Mode sombre activé ou non
};

// Vacances scolaires par zone (2025-2026)
// Source: Calendrier officiel de l'Éducation Nationale
const vacancesScolaires = {
    2025: {
        A: [
            { start: '2025-02-08', end: '2025-02-24', name: 'Hiver' },
            { start: '2025-04-05', end: '2025-04-22', name: 'Printemps' },
            { start: '2025-07-05', end: '2025-09-01', name: 'Été' },
            { start: '2025-10-18', end: '2025-11-03', name: 'Toussaint' },
            { start: '2025-12-20', end: '2026-01-05', name: 'Noël' }
        ],
        B: [
            { start: '2025-02-22', end: '2025-03-10', name: 'Hiver' },
            { start: '2025-04-19', end: '2025-05-05', name: 'Printemps' },
            { start: '2025-07-05', end: '2025-09-01', name: 'Été' },
            { start: '2025-10-18', end: '2025-11-03', name: 'Toussaint' },
            { start: '2025-12-20', end: '2026-01-05', name: 'Noël' }
        ],
        C: [
            { start: '2025-02-15', end: '2025-03-03', name: 'Hiver' },
            { start: '2025-04-12', end: '2025-04-28', name: 'Printemps' },
            { start: '2025-07-05', end: '2025-09-01', name: 'Été' },
            { start: '2025-10-18', end: '2025-11-03', name: 'Toussaint' },
            { start: '2025-12-20', end: '2026-01-05', name: 'Noël' }
        ]
    },
    2026: {
        A: [
            { start: '2026-02-07', end: '2026-02-23', name: 'Hiver' },
            { start: '2026-04-04', end: '2026-04-20', name: 'Printemps' },
            { start: '2026-07-04', end: '2026-09-01', name: 'Été' },
            { start: '2026-10-17', end: '2026-11-02', name: 'Toussaint' },
            { start: '2026-12-19', end: '2027-01-04', name: 'Noël' }
        ],
        B: [
            { start: '2026-02-21', end: '2026-03-09', name: 'Hiver' },
            { start: '2026-04-18', end: '2026-05-04', name: 'Printemps' },
            { start: '2026-07-04', end: '2026-09-01', name: 'Été' },
            { start: '2026-10-17', end: '2026-11-02', name: 'Toussaint' },
            { start: '2026-12-19', end: '2027-01-04', name: 'Noël' }
        ],
        C: [
            { start: '2026-02-14', end: '2026-03-02', name: 'Hiver' },
            { start: '2026-04-11', end: '2026-04-27', name: 'Printemps' },
            { start: '2026-07-04', end: '2026-09-01', name: 'Été' },
            { start: '2026-10-17', end: '2026-11-02', name: 'Toussaint' },
            { start: '2026-12-19', end: '2027-01-04', name: 'Noël' }
        ]
    }
};

// Obtenir les dates de vacances pour une zone et une année données
function getVacancesScolaires(year, zone) {
    if (!zone || !vacancesScolaires[year] || !vacancesScolaires[year][zone]) {
        return [];
    }

    const vacances = [];
    vacancesScolaires[year][zone].forEach(periode => {
        const start = new Date(periode.start);
        const end = new Date(periode.end);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            vacances.push(formatDate(new Date(d)));
        }
    });

    return vacances;
}

// Vérifier si une date est pendant les vacances scolaires
function isVacancesScolaires(dateStr, vacances) {
    return vacances.includes(dateStr);
}

// Jours fériés français (fonction pour calculer les dates mobiles)
function getJoursFeries(year) {
    const joursFeries = [];

    // Jours fixes
    joursFeries.push(`${year}-01-01`); // Nouvel An
    joursFeries.push(`${year}-05-01`); // Fête du Travail
    joursFeries.push(`${year}-05-08`); // Victoire 1945
    joursFeries.push(`${year}-07-14`); // Fête Nationale
    joursFeries.push(`${year}-08-15`); // Assomption
    joursFeries.push(`${year}-11-01`); // Toussaint
    joursFeries.push(`${year}-11-11`); // Armistice 1918
    joursFeries.push(`${year}-12-25`); // Noël

    // Calcul de Pâques (algorithme de Meeus)
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    const paques = new Date(year, month - 1, day);

    // Lundi de Pâques (Pâques + 1 jour)
    const lundiPaques = new Date(paques);
    lundiPaques.setDate(paques.getDate() + 1);
    joursFeries.push(formatDate(lundiPaques));

    // Ascension (Pâques + 39 jours)
    const ascension = new Date(paques);
    ascension.setDate(paques.getDate() + 39);
    joursFeries.push(formatDate(ascension));

    // Lundi de Pentecôte (Pâques + 50 jours)
    const lundiPentecote = new Date(paques);
    lundiPentecote.setDate(paques.getDate() + 50);
    joursFeries.push(formatDate(lundiPentecote));

    return joursFeries;
}

// Formater une date en YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Obtenir le nom du mois
function getMonthName(monthIndex) {
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[monthIndex];
}

// Obtenir les jours de la semaine
function getDayHeaders() {
    return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
}

// Vérifier si une date est un jour férié
function isJourFerie(dateStr, joursFeries) {
    return joursFeries.includes(dateStr);
}

// Vérifier si une date est un weekend
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // Dimanche ou Samedi
}

// Vérifier si c'est aujourd'hui
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Calculer le numéro de semaine ISO 8601 (norme française)
function getWeekNumber(date) {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

// Créer un calendrier pour un mois
function createMonthCalendar(year, month, joursFeries, vacances) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month-calendar';

    // En-tête du mois avec bouton de réinitialisation
    const headerContainer = document.createElement('div');
    headerContainer.className = 'month-header-container';

    const header = document.createElement('div');
    header.className = 'month-header';
    header.textContent = getMonthName(month);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'reset-month-btn';
    resetBtn.innerHTML = `
        <svg width="18" height="18" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.67742 20.5673C2.53141 18.0212 0.758026 12.7584 2.71678 8.1439C4.87472 3.0601 10.7453 0.68822 15.8291 2.84617C20.9129 5.00412 23.2848 10.8747 21.1269 15.9585C20.2837 17.945 18.8736 19.5174 17.1651 20.5673" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 16V20.4C17 20.7314 17.2686 21 17.6 21H22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 22.01L12.01 21.9989" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    resetBtn.title = 'Réinitialiser le mois';
    resetBtn.addEventListener('click', () => resetMonth(year, month));

    headerContainer.appendChild(header);
    headerContainer.appendChild(resetBtn);
    monthDiv.appendChild(headerContainer);

    // Grille du calendrier
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // En-tête pour la colonne des semaines (vide)
    const weekHeader = document.createElement('div');
    weekHeader.className = 'week-header';
    weekHeader.textContent = 'S';
    grid.appendChild(weekHeader);

    // En-têtes des jours de la semaine
    getDayHeaders().forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });

    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
    let startDay = firstDay.getDay();
    // Convertir pour que lundi soit 0
    startDay = startDay === 0 ? 6 : startDay - 1;

    let currentWeek = -1;
    let dayCounter = 0;

    // Ajouter les cellules vides pour aligner le premier jour
    for (let i = 0; i < startDay; i++) {
        // Ajouter le numéro de semaine au début de chaque ligne
        if (i === 0) {
            const weekCell = document.createElement('div');
            weekCell.className = 'week-number';
            weekCell.textContent = getWeekNumber(firstDay);
            grid.appendChild(weekCell);
            currentWeek = getWeekNumber(firstDay);
        }

        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell empty';
        grid.appendChild(emptyCell);
        dayCounter++;
    }

    // Ajouter tous les jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const weekNum = getWeekNumber(date);

        // Ajouter le numéro de semaine si on commence une nouvelle semaine (lundi)
        if (dayCounter % 7 === 0) {
            const weekCell = document.createElement('div');
            weekCell.className = 'week-number';
            weekCell.textContent = weekNum;
            grid.appendChild(weekCell);
            currentWeek = weekNum;
        }

        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;
        dayCell.dataset.date = dateStr;

        // Vérifier si c'est aujourd'hui
        if (isToday(date)) {
            dayCell.classList.add('today');
        }

        // Vérifier si c'est un jour férié (priorité la plus haute)
        if (isJourFerie(dateStr, joursFeries)) {
            dayCell.classList.add('ferie');
        }
        // Vérifier si c'est pendant les vacances scolaires
        else if (isVacancesScolaires(dateStr, vacances)) {
            dayCell.classList.add('vacances');
        }
        // Vérifier si c'est un weekend
        else if (isWeekend(date)) {
            dayCell.classList.add('weekend');
        }

        // Appliquer l'état du jour si existant (congés posés par l'utilisateur)
        if (state.days[dateStr]) {
            dayCell.classList.add(state.days[dateStr]);
        }

        // Ajouter les événements de clic et de glisser-déposer
        dayCell.addEventListener('mousedown', handleDayMouseDown);
        dayCell.addEventListener('mouseenter', handleDayMouseEnter);
        dayCell.addEventListener('mouseup', handleDayMouseUp);

        grid.appendChild(dayCell);
        dayCounter++;
    }

    monthDiv.appendChild(grid);
    return monthDiv;
}

// Gérer le début du glisser-déposer (mousedown)
function handleDayMouseDown(event) {
    const dayCell = event.target;
    const dateStr = dayCell.dataset.date;

    // Ne rien faire si c'est un jour férié
    if (dayCell.classList.contains('ferie')) {
        return;
    }

    // Empêcher la sélection de texte pendant le drag
    event.preventDefault();

    // Obtenir l'état actuel
    const currentState = state.days[dateStr];

    // Déterminer le prochain état selon le cycle
    let nextState;
    if (!currentState) {
        nextState = 'conges';
    } else if (currentState === 'conges') {
        nextState = 'rtt';
    } else if (currentState === 'rtt') {
        nextState = 'autres';
    } else {
        nextState = null;
    }

    // Démarrer le mode glisser-déposer
    state.isDragging = true;
    state.dragStartDate = dateStr;
    state.dragType = nextState;

    // Appliquer le changement au jour cliqué
    applyDayState(dayCell, dateStr, nextState);
}

// Gérer le survol pendant le glisser-déposer (mouseenter)
function handleDayMouseEnter(event) {
    if (!state.isDragging) {
        return;
    }

    const dayCell = event.target;

    // Vérifier que c'est bien une cellule de jour avec une date
    if (!dayCell.dataset.date) {
        return;
    }

    const dateStr = dayCell.dataset.date;

    // Ne rien faire si c'est un jour férié
    if (dayCell.classList.contains('ferie')) {
        return;
    }

    // Appliquer le même type de congé que celui du début du drag
    applyDayState(dayCell, dateStr, state.dragType);
}

// Gérer la fin du glisser-déposer (mouseup)
function handleDayMouseUp(event) {
    if (state.isDragging) {
        state.isDragging = false;
        state.dragStartDate = null;
        state.dragType = null;

        // Sauvegarder l'état dans le localStorage
        saveState();

        // Mettre à jour les compteurs
        updateCounters();
    }
}

// Appliquer un état à un jour
function applyDayState(dayCell, dateStr, newState) {
    // Retirer toutes les classes de type de congé
    dayCell.classList.remove('conges', 'rtt', 'autres', 'weekend', 'vacances');

    if (newState === null) {
        // Réinitialiser
        delete state.days[dateStr];

        // Remettre la classe appropriée selon le type de jour
        const date = new Date(dateStr);
        const vacances = getVacancesScolaires(state.currentYear, state.selectedZone);

        if (isVacancesScolaires(dateStr, vacances)) {
            dayCell.classList.add('vacances');
        } else if (isWeekend(date)) {
            dayCell.classList.add('weekend');
        }
    } else {
        // Appliquer le nouveau type de congé
        state.days[dateStr] = newState;
        dayCell.classList.add(newState);
    }
}

// Réinitialiser tous les congés d'un mois
function resetMonth(year, month) {
    // Demander confirmation
    const monthName = getMonthName(month);
    const confirmation = confirm(`Voulez-vous vraiment supprimer tous les congés de ${monthName} ${year} ?`);

    if (!confirmation) {
        return;
    }

    // Supprimer tous les congés du mois
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        delete state.days[dateStr];
    }

    // Sauvegarder et rafraîchir
    saveState();
    renderCalendars();

    showNotification(`Congés de ${monthName} ${year} réinitialisés`, 'success');
}

// Mettre à jour les compteurs
function updateCounters() {
    let congesCount = 0;
    let rttCount = 0;
    let autresCount = 0;

    Object.values(state.days).forEach(type => {
        if (type === 'conges') congesCount++;
        else if (type === 'rtt') rttCount++;
        else if (type === 'autres') autresCount++;
    });

    document.getElementById('congesCount').textContent = congesCount;
    document.getElementById('rttCount').textContent = rttCount;
    document.getElementById('autresCount').textContent = autresCount;
}

// Rendre tous les calendriers de l'année
function renderCalendars() {
    const container = document.getElementById('calendarsContainer');
    container.innerHTML = '';

    const zoneSelect = document.getElementById('zoneSelect');
    const vacancesAvailable = vacancesScolaires[state.currentYear] !== undefined;

    // Récupérer les vacances seulement si disponibles et zone sélectionnée
    const vacances = vacancesAvailable ? getVacancesScolaires(state.currentYear, state.selectedZone) : [];
    const joursFeries = getJoursFeries(state.currentYear);

    // Gérer l'état du sélecteur de zone
    if (!vacancesAvailable) {
        // Désactiver le sélecteur mais conserver la valeur sélectionnée
        zoneSelect.disabled = true;
    } else {
        // Activer le sélecteur
        zoneSelect.disabled = false;
    }

    // Mettre à jour le sélecteur de zone avec la valeur actuelle
    zoneSelect.value = state.selectedZone;

    // Afficher/masquer la légende des vacances scolaires
    const vacancesLegend = document.getElementById('vacancesLegend');
    if (state.selectedZone && vacancesAvailable) {
        vacancesLegend.style.display = 'flex';
    } else {
        vacancesLegend.style.display = 'none';
    }

    // Créer un calendrier pour chaque mois
    for (let month = 0; month < 12; month++) {
        const monthCalendar = createMonthCalendar(state.currentYear, month, joursFeries, vacances);
        container.appendChild(monthCalendar);
    }

    // Mettre à jour l'affichage de l'année
    document.getElementById('currentYear').textContent = state.currentYear;

    // Mettre à jour les compteurs
    updateCounters();
}

// Sauvegarder l'état dans le localStorage
function saveState() {
    localStorage.setItem('congesState', JSON.stringify(state));
}

// Charger l'état depuis le localStorage
function loadState() {
    const savedState = localStorage.getItem('congesState');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        state.currentYear = parsed.currentYear || new Date().getFullYear();
        state.days = parsed.days || {};
        state.selectedZone = parsed.selectedZone || '';
        state.darkTheme = parsed.darkTheme || false;
    }

    // Appliquer le thème
    if (state.darkTheme) {
        document.body.classList.add('dark-theme');
    }
}

// Basculer entre thème clair et sombre
function toggleTheme() {
    state.darkTheme = !state.darkTheme;

    if (state.darkTheme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    saveState();
}

// Changer d'année
function changeYear(delta) {
    state.currentYear += delta;
    saveState();
    renderCalendars();
}

// Exporter les données en JSON
function exportToJSON() {
    const dataToExport = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        currentYear: state.currentYear,
        selectedZone: state.selectedZone,
        days: state.days
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `conges-${state.currentYear}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Export réussi !', 'success');
}

// Importer les données depuis JSON
function importFromJSON(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);

            // Validation basique
            if (!importedData.days || typeof importedData.days !== 'object') {
                throw new Error('Format de fichier invalide');
            }

            // Demander confirmation si des données existent déjà
            const hasExistingData = Object.keys(state.days).length > 0;
            if (hasExistingData) {
                const confirmImport = confirm(
                    'Des congés sont déjà enregistrés. Voulez-vous :\n\n' +
                    'OK = Fusionner avec les données existantes\n' +
                    'Annuler = Remplacer toutes les données'
                );

                if (!confirmImport) {
                    // Remplacer toutes les données
                    state.days = {};
                }
            }

            // Fusionner ou importer les données
            Object.assign(state.days, importedData.days);

            // Mettre à jour l'année si fournie
            if (importedData.currentYear) {
                state.currentYear = importedData.currentYear;
            }

            // Mettre à jour la zone si fournie
            if (importedData.selectedZone !== undefined) {
                state.selectedZone = importedData.selectedZone;
            }

            // Sauvegarder et rafraîchir
            saveState();
            renderCalendars();

            showNotification('Import réussi !', 'success');
        } catch (error) {
            showNotification('Erreur lors de l\'import : ' + error.message, 'error');
            console.error('Erreur d\'import:', error);
        }
    };

    reader.onerror = () => {
        showNotification('Erreur lors de la lecture du fichier', 'error');
    };

    reader.readAsText(file);
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Appliquer les styles inline
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.95em',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease-out',
        backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'
    });

    // Ajouter les keyframes pour l'animation
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Retirer la notification après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Charger l'état sauvegardé
    loadState();

    // Rendre les calendriers
    renderCalendars();

    // Ajouter les événements pour les boutons de navigation d'année
    document.getElementById('prevYear').addEventListener('click', () => changeYear(-1));
    document.getElementById('nextYear').addEventListener('click', () => changeYear(1));

    // Ajouter les événements pour l'export/import
    document.getElementById('exportBtn').addEventListener('click', exportToJSON);

    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            importFromJSON(file);
        }
        // Réinitialiser l'input pour permettre de réimporter le même fichier
        e.target.value = '';
    });

    // Ajouter l'événement pour le changement de zone
    document.getElementById('zoneSelect').addEventListener('change', (e) => {
        state.selectedZone = e.target.value;
        saveState();
        renderCalendars();
    });

    // Ajouter un gestionnaire global pour mouseup pour terminer le glisser-déposer
    document.addEventListener('mouseup', () => {
        if (state.isDragging) {
            state.isDragging = false;
            state.dragStartDate = null;
            state.dragType = null;
            saveState();
            updateCounters();
        }
    });

    // Ajouter l'événement pour le bouton de thème
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Gérer la modale d'aide
    const helpModal = document.getElementById('helpModal');
    const helpBtn = document.getElementById('helpBtn');
    const modalClose = document.querySelector('.modal-close');

    helpBtn.addEventListener('click', () => {
        helpModal.classList.add('show');
    });

    modalClose.addEventListener('click', () => {
        helpModal.classList.remove('show');
    });

    // Fermer la modale en cliquant à l'extérieur
    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            helpModal.classList.remove('show');
        }
    });
});
