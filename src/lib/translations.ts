/**
 * Multilingual Content for Morabaraba
 * Supports English (EN), Zulu (ZU), and Sotho (SO)
 */

export interface Translation {
  en: string;
  zu: string;
  so: string;
}

export const GAME_TIPS: Translation[] = [
  {
    en: "Focus on placing your cows in positions that can form multiple mills later.",
    zu: "Gxila ekubekeni izinkomo zakho ezindaweni ezingakha imigqa eminingi kamuva.",
    so: "Tsepamisa maikutlo ho beha likhomo tsa hau libakeng tse ka etsang mela e mengata hamorao."
  },
  {
    en: "Try to block your opponent's movement while keeping your cows mobile.",
    zu: "Zama ukuvimba ukunyakaza komphikisi kuyilapho ugcina izinkomo zakho zinyakaza.",
    so: "Leka ho thibela motsotso oa mohanyetsi ha u ntse u boloka likhomo tsa hau li tsamaea."
  },
  {
    en: "Your cows can now fly to any open spot! Use this to surprise your opponent.",
    zu: "Izinkomo zakho manje sezindiza ziya kunoma iyiphi indawo evulekile! Sebenzisa lokhu ukumangaza umphikisi.",
    so: "Likhomo tsa hau joale li ka fofela sebakeng sefe kapa sefe se bulehileng! Sebedisa sena ho makatsa mohanyetsi."
  },
  {
    en: "You formed a mill! Choose an opponent's cow to shoot (remove from the board).",
    zu: "Wakha umgqa! Khetha inkomo yomphikisi oyizodubula (ukususa ebhodini).",
    so: "U entse mola! Kgetha khomo ya mohanyetsi ho e thunya (ho e tlosa boramong)."
  },
  {
    en: "Control the center points for maximum mobility.",
    zu: "Lawula amaphuzu aphakathi ukuze uthole ukunyakaza okuphezulu.",
    so: "Laola lintlha tsa bohareng bakeng sa motsamao o moholo."
  },
  {
    en: "A double mill (Mora) is almost impossible to defeat!",
    zu: "Umgqa ophindwe kabili (Mora) cishe awunakwehlulwa!",
    so: "Mola o habeli (Mora) ha e na ho hloloha hoo e ka bang!"
  }
];

export const PHASE_TIPS: Record<string, Translation> = {
  PLACING: {
    en: "📍 PLACE YOUR COW",
    zu: "📍 BEKA INKOMO YAKHO",
    so: "📍 BEHA KHOMO YA HAO"
  },
  MOVING: {
    en: "🔄 MOVE TO ADJACENT SPOT",
    zu: "🔄 NYAKAZA ENDAWENI ECELLE",
    so: "🔄 TSAMAYA SEBAKENG SE HARETSENG"
  },
  FLYING: {
    en: "✈️ FLY TO ANY SPOT",
    zu: "✈️ ZINDIZA UYE NANOMA YIYIPHI INDOWO",
    so: "✈️ FOFA YA SEBAKENG SEFE"
  },
  SHOOTING: {
    en: "🎯 REMOVE OPPONENT COW",
    zu: "🎯 SUSULA INKOMO YOMPHIKISI",
    so: "🎯 TLOSA KHOMO YA MOHANYETSI"
  }
};

export const UI_LABELS: Record<string, Translation> = {
  MORABARABA: {
    en: "MORABARABA",
    zu: "UMLABALABA",
    so: "MORABARABA"
  },
  THE_GAME_OF_THE_HERD: {
    en: "The Game of the Herd",
    zu: "Umdlalo Wezinkomo",
    so: "Papali ea Likhomo"
  },
  PLAY_NOW: {
    en: "PLAY NOW",
    zu: "DLALA MANJE",
    so: "BAPALA JOALE"
  },
  LEARN_HERITAGE: {
    en: "LEARN HERITAGE",
    zu: "FUNDA UFAKO",
    so: "ITHUTE BOHLOKOA"
  },
  SETTINGS: {
    en: "SETTINGS",
    zu: "IZILUNGISELO",
    so: "LIHLOPHISO"
  },
  THEME: {
    en: "THEME",
    zu: "INGQIKITHE",
    so: "SEHLOOHO"
  },
  TEXT_SIZE: {
    en: "TEXT SIZE",
    zu: "USAYIZI WOKUBHALA",
    so: "BOHLOLO BA MONGOLO"
  },
  SOUND_EFFECTS: {
    en: "Sound Effects",
    zu: "Imisindo Yemidlalo",
    so: "Litlamorao tsa Molumo"
  },
  HAPTIC_FEEDBACK: {
    en: "Haptic Feedback",
    zu: "Ukuphendula Kokuthinta",
    so: "Karabo ea Ho Ama"
  },
  BOARD_ROTATION: {
    en: "Board Rotation",
    zu: "Ukujikeleza Kwebhodi",
    so: "Potoloho ea Boto"
  },
  BOARD_ZOOM: {
    en: "Board Zoom",
    zu: "Ukuqhakaza Ibhodi",
    so: "Zoom ea Boto"
  },
  VICTORY: {
    en: "VICTORY!",
    zu: "UKUNQOBA!",
    so: "TLHOLO!"
  },
  GAME_OVER: {
    en: "GAME OVER",
    zu: "UMDLALO UPHILILE",
    so: "PAPALI E FELETSE"
  },
  DRAW: {
    en: "DRAW (50 moves without capture)",
    zu: "NKABA (ukunyakaza okungu-50 ngokubanjwa)",
    so: "ROKA (mehato ea 50 ntle le ho tšoara)"
  }
};

export const AUDIO_NARRATIONS: Record<string, { en: string; zu: string; so: string }> = {
  // Welcome
  welcome: {
    en: "Welcome to Morabaraba, the ancient game of strategy.",
    zu: "Siyakwamukela kuMorabaraba, umdlalo wasendulo wamasu.",
    so: "Rea u amohela Morabaraba, papali ea khale ea leano."
  },
  
  // Game phases
  placingPhase: {
    en: "Place your cows on the board.",
    zu: "Beka izinkomo zakho ebhodini.",
    so: "Beha likhomo tsa hao boramong."
  },
  movingPhase: {
    en: "Move your cows to adjacent points.",
    zu: "Nyakaza izinkomo zakho kumaphuzu aseduze.",
    so: "Sutamisa likhomo tsa hao lintlheng tse haufi."
  },
  flyingPhase: {
    en: "Your cows can now fly! Move to any empty point.",
    zu: "Izinkomo zakho manje sezizindiza! Nyakaza uye kunoma iyiphi indawo engenalutho.",
    so: "Likhomo tsa hao joale lia fofa! Sutumisa sebakeng sefe kapa sefe se se nang letho."
  },
  
  // Events
  millFormed: {
    en: "Mill formed! Remove an opponent's cow.",
    zu: "Kwakheke umgqa! Susa inkomo yomphikisi.",
    so: "Mola o entsoe! Tlosa khomo ya mohanyetsi."
  },
  victory: {
    en: "Victory! You have mastered the herd.",
    zu: "Ukunqoba! Ulawule izinkomo.",
    so: "Tlholo! U laetse likhomo."
  }
};

/**
 * Get translation for current language
 */
export const getTranslation = (key: string, language: 'EN' | 'ZU' | 'SO'): string => {
  const langMap: Record<string, 'en' | 'zu' | 'so'> = {
    EN: 'en',
    ZU: 'zu',
    SO: 'so'
  };
  
  const lang = langMap[language];
  
  // Check UI labels
  if (UI_LABELS[key]) {
    return UI_LABELS[key][lang];
  }
  
  // Check audio narrations
  if (AUDIO_NARRATIONS[key]) {
    return AUDIO_NARRATIONS[key][lang];
  }
  
  // Check game tips
  const tipIndex = parseInt(key);
  if (!isNaN(tipIndex) && GAME_TIPS[tipIndex]) {
    return GAME_TIPS[tipIndex][lang];
  }
  
  // Fallback to English
  return key;
};

/**
 * Get phase tip for current language
 */
export const getPhaseTip = (phase: string, language: 'EN' | 'ZU' | 'SO'): string => {
  const langMap: Record<string, 'en' | 'zu' | 'so'> = {
    EN: 'en',
    ZU: 'zu',
    SO: 'so'
  };
  
  const lang = langMap[language];
  return PHASE_TIPS[phase]?.[lang] || PHASE_TIPS[phase]?.['en'] || phase;
};
