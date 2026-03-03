// data/defis.js

const DefisOrigine = [
  {
    jour: 1,
    titre: "Prends un moment pour observer tes habitudes alimentaires actuelles",
    description: "Aujourd’hui, note ce que tu manges, quand tu manges et pourquoi tu manges. Commence par être simplement conscient de tes habitudes sans jugement.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 2,
    titre: "Mange en silence",
    description: "Lors de ton repas principal, éteins toute distraction (téléphone, TV) et mange en silence. Concentre-toi uniquement sur les saveurs, les textures et les sensations.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 3,
    titre: "Prends conscience de ta faim",
    description: "Avant chaque repas, prends une minute pour évaluer ton niveau de faim sur une échelle de 1 à 10. Cela t'aidera à mieux comprendre tes besoins réels.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 4,
    titre: "Introduis une pause de gratitude avant de manger",
    description: "Avant de commencer ton repas, prends un moment pour te sentir reconnaissant pour la nourriture devant toi. Cela peut t'aider à te connecter plus profondément à ton repas.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 5,
    titre: "Mastique lentement et longuement",
    description: "Aujourd’hui, concentre-toi sur la mastication. Essaie de mâcher chaque bouchée au moins 20 fois avant d’avaler. Observe comment cela change ton expérience de la nourriture.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 6,
    titre: "Change ton environnement de repas",
    description: "Si tu le peux, mange dans un endroit différent. Ce changement de cadre peut t’aider à sortir de la routine et à te concentrer sur le moment présent.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 7,
    titre: "Remplace une collation transformée par un aliment entier",
    description: "Choisis une collation que tu as l’habitude de consommer et remplace-la par un fruit, des noix ou des légumes crus. Note comment tu te sens après.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 8,
    titre: "Observe les émotions liées à ton alimentation",
    description: "Avant de manger, prends un moment pour te demander ce que tu ressens. Manges-tu par faim ou pour apaiser une émotion ? Identifie ces émotions sans les juger.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 9,
    titre: "Fais une mini-méditation avant de manger",
    description: "Avant de commencer ton repas, prends 2-3 minutes pour respirer profondément et te recentrer. Cette pratique peut améliorer ta digestion et ton état d’esprit.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 10,
    titre: "Découvre l'impact des saveurs",
    description: "Concentre-toi aujourd’hui sur les différentes saveurs de ton repas (sucré, salé, acide, amer, piquant). Essaie de repérer comment chaque saveur influence ton appétit et tes émotions.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 12,
    titre: "Identifie les déclencheurs de tes envies alimentaires",
    description: "Aujourd’hui, fais attention à ce qui déclenche tes envies de manger (stress, ennui, pub TV). Note ces déclencheurs pour mieux les comprendre.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 13,
    titre: "Pratique le jeûne intermittent sur une courte période",
    description: "Essaye de retarder ton petit-déjeuner de quelques heures ou d’avancer ton dîner. Observe comment cela affecte ta faim et ton énergie.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 14,
    titre: "Bois un verre d’eau avant chaque repas",
    description: "Avant de manger, bois un grand verre d’eau. Cela peut t’aider à différencier la faim de la soif et à réduire les excès alimentaires.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 15,
    titre: "Prépare un repas avec une intention consciente",
    description: "Aujourd’hui, prépare ton repas avec une intention particulière, comme nourrir ton corps, te faire plaisir, ou te détendre. Concentre-toi sur chaque étape de la préparation.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 16,
    titre: "Fais une marche de pleine conscience après le repas",
    description: "Après ton repas principal, prends 10-15 minutes pour marcher lentement et digérer. Concentre-toi sur ta respiration et tes sensations corporelles.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 17,
    titre: "Expérimente avec un repas végétarien",
    description: "Choisis de manger un repas végétarien aujourd’hui. Note comment ton corps réagit et comment tu te sens mentalement après ce changement.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 18,
    titre: "Ecoute ton corps pour savoir quand arrêter de manger",
    description: "Aujourd’hui, mange lentement et écoute ton corps pour savoir quand il est temps d’arrêter. Arrête-toi avant de te sentir complètement plein et observe les sensations qui en découlent.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 19,
    titre: "Note tes ressentis après chaque repas",
    description: "Prends quelques minutes après chaque repas pour noter comment tu te sens physiquement et émotionnellement. Cela t’aidera à faire le lien entre ce que tu manges et ton bien-être général.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 20,
    titre: "Limite les aliments transformés",
    description: "Fais de ton mieux pour éviter les aliments transformés aujourd’hui. Concentre-toi sur les aliments entiers et non transformés, et note les différences dans tes sensations.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 21,
    titre: "Crée ton rituel de repas en pleine conscience",
    description: "Compile toutes les pratiques que tu as apprises au cours des 20 derniers jours et crée ton propre rituel de repas en pleine conscience. Engage-toi à continuer ce rituel au-delà de ce défi.",
    termine: false,
    dateValidation: null
  },
  {
    jour: 22,
    titre: "Célèbre ta transformation !",
    description: "Fais-toi une lettre de gratitude pour mettre sur le papier tout ce que tu faisais avant de commencer ce défi et ce qui change ton quotidien maintenant : c’est le moment du bilan !\n\nN'hésite pas à me la partager ou même partager ton expérience sur le groupe Facebook si le cœur t'en dit !\n\nTu peux être fièr.e de ce que tu as réalisé au cours des trois dernières semaines !!",
    termine: false,
    dateValidation: null
  }
];

// Fonction utilitaire pour obtenir le défi d'un jour
function getDefiByDay(jourNumero) {
  return DefisEnvol.find(defi => defi.jour === jourNumero) || DefisEnvol[0];
}

// Sauvegarde la progression dans le localStorage
function saveProgression() {
  localStorage.setItem('defis_envol', JSON.stringify(DefisEnvol));
}

// Charge la progression depuis le localStorage
function loadProgression() {
  const sauvegarde = localStorage.getItem('defis_envol');
  if (sauvegarde) {
    const defisSauves = JSON.parse(sauvegarde);
    defisSauves.forEach((defiSauve, index) => {
      if (DefisEnvol[index]) {
        DefisEnvol[index].termine = defiSauve.termine;
        DefisEnvol[index].dateValidation = defiSauve.dateValidation;
      }
    });
  }
}

// Initialise l'app au premier lancement
function initializeApp() {
  if (!localStorage.getItem('app_initialisee')) {
    localStorage.setItem('app_initialisee', 'true');
    localStorage.setItem('jour_actuel', '1');
    localStorage.setItem('heure_notification', '09:00');
    saveProgression();
  }
  loadProgression();
}
