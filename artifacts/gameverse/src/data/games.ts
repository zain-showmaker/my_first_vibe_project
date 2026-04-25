export interface Review {
  source: string;
  quote: string;
  score: number;
}

export interface ScoreCategory {
  label: string;
  value: number;
  max: number;
}

export interface DLC {
  id: string;
  name: string;
  type: string;
  price: string;
  date: string;
  description: string;
  status: 'owned' | 'available' | 'wishlist';
}

export interface Character {
  id: string;
  name: string;
  role: string;
  allegiance: string;
  description: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'boss' | 'area' | 'hub' | 'dungeon';
  description: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  span2?: boolean;
  isVideo?: boolean;
}

export interface Game {
  slug: string;
  title: string;
  subtitle: string;
  year: number;
  developer: string;
  publisher: string;
  director: string;
  genre: string;
  platforms: string[];
  themeColor: string;
  scores: {
    metacritic: number;
    opencritic: number;
    user: number;
    goty: number;
  };
  scoreCategories: ScoreCategory[];
  synopsis: string[];
  specTable: Record<string, string>;
  dlc: DLC[];
  characters: Character[];
  locations: Location[];
  gallery: GalleryItem[];
  reviews: Review[];
  coverUrl: string;
  heroUrl: string;
}

export const games: Game[] = [
  {
    slug: "elden-ring",
    title: "Elden Ring",
    subtitle: "エルデンリング — \"Rise, Tarnished, and let grace guide thee.\"",
    year: 2022,
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    director: "Hidetaka Miyazaki",
    genre: "Action RPG",
    platforms: ["PS5", "Xbox Series", "PC"],
    themeColor: "#e8ff47",
    coverUrl: "/images/covers/elden-ring.png",
    heroUrl: "/images/heroes/elden-ring.png",
    scores: {
      metacritic: 96,
      opencritic: 95,
      user: 9.8,
      goty: 12,
    },
    scoreCategories: [
      { label: "World", value: 10, max: 10 },
      { label: "Combat", value: 9.5, max: 10 },
      { label: "Lore", value: 9.8, max: 10 },
      { label: "Sound", value: 9.2, max: 10 },
    ],
    synopsis: [
      "Elden Ring is a massive action role-playing game developed by FromSoftware, creators of the acclaimed Dark Souls series. Set in the Lands Between, a realm shattered by the shattering of the titular Elden Ring, players assume the role of a Tarnished—an exiled individual called back to restore order.",
      "The game represents FromSoftware's first truly open-world design, allowing players to explore vast landscapes, delve into intricate legacy dungeons, and discover hidden secrets at their own pace. Combat retains the challenging, stamina-based mechanics the studio is known for, augmented by new features like stealth, mounted combat on your spectral steed Torrent, and customizable weapon skills known as Ashes of War.",
      "With worldbuilding contributions from fantasy author George R.R. Martin, Elden Ring offers a deep, enigmatic lore filled with demigods, ancient dragons, and cosmic entities. Its unparalleled sense of discovery and mastery has cemented its status as one of the greatest games of its generation."
    ],
    specTable: {
      "Engine": "FromSoftware Engine (Proprietary)",
      "Multiplayer": "Co-op up to 3 players, Invasions",
      "Playtime": "80-150 Hours",
      "Release Date": "Feb 25, 2022",
      "File Size": "Approx. 60 GB",
      "Age Rating": "M (Mature 17+)"
    },
    dlc: [
      { id: "sote", name: "Shadow of the Erdtree", type: "Expansion", price: "$39.99", date: "June 21, 2024", description: "Journey to the Land of Shadow, a completely new world obscured by the Erdtree. Uncover the dark secrets of Marika's past and follow in the footsteps of Miquella.", status: "available" },
      { id: "colosseum", name: "Colosseum Update", type: "Update", price: "Free", date: "Dec 7, 2022", description: "Opens the doors of the Limgrave, Caelid, and Leyndell Colosseums for various PvP modes including duels, free-for-alls, and team fights.", status: "owned" }
    ],
    characters: [
      { id: "melina", name: "Melina", role: "Guide", allegiance: "Unknown", description: "A mysterious spectral maiden who offers an accord to the Tarnished, acting as their Finger Maiden and providing the steed Torrent." },
      { id: "ranni", name: "Ranni the Witch", role: "Demigod", allegiance: "Carian Royal Family", description: "Daughter of Radagon and Rennala. She orchestrated the Night of the Black Knives to free herself from the Greater Will." },
      { id: "radahn", name: "Starscourge Radahn", role: "Demigod Boss", allegiance: "Redmanes", description: "The mightiest hero of the demigods, who holds back the stars themselves despite being driven mad by the Scarlet Rot." },
      { id: "malenia", name: "Malenia, Blade of Miquella", role: "Demigod Boss", allegiance: "Haligtree", description: "An Empyrean cursed with Scarlet Rot from birth. She has never known defeat in battle." },
      { id: "margit", name: "Margit, the Fell Omen", role: "Boss", allegiance: "Golden Order", description: "A formidable opponent guarding the approach to Stormveil Castle, dedicated to hunting Tarnished." }
    ],
    locations: [
      { id: "limgrave", name: "Limgrave", type: "area", description: "The starting region of the Lands Between, featuring lush green landscapes, ancient ruins, and Stormveil Castle." },
      { id: "caelid", name: "Caelid", type: "area", description: "A barren wasteland infected by the Scarlet Rot, filled with monstrous creatures and a red sky." },
      { id: "leyndell", name: "Leyndell, Royal Capital", type: "dungeon", description: "The grand, golden capital city situated at the base of the Erdtree." },
      { id: "roundtable", name: "Roundtable Hold", type: "hub", description: "A gathering place for Tarnished champions, existing outside the normal world." }
    ],
    gallery: [
      { id: "er1", url: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1600&auto=format&fit=crop", span2: true },
      { id: "er2", url: "https://images.unsplash.com/photo-1590513904944-d8bc79b009e4?q=80&w=800&auto=format&fit=crop" },
      { id: "er3", url: "https://images.unsplash.com/photo-1542451313056-b7c8e626645f?q=80&w=800&auto=format&fit=crop" },
      { id: "er4", url: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop" },
      { id: "er5", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop", span2: true },
      { id: "er6", url: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop" }
    ],
    reviews: [
      { source: "IGN", score: 10, quote: "Elden Ring is a massive, elegant, and challenging action RPG that elevates the genre to new heights." },
      { source: "GameSpot", score: 10, quote: "An unparalleled masterclass in open-world design and rewarding combat." },
      { source: "Polygon", score: 10, quote: "FromSoftware's magnum opus, blending their best ideas into an unforgettable journey." }
    ]
  },
  {
    slug: "bloodborne",
    title: "Bloodborne",
    subtitle: "ブラッドボーン — \"We are born of the blood, made men by the blood, undone by the blood.\"",
    year: 2015,
    developer: "FromSoftware",
    publisher: "Sony Computer Entertainment",
    director: "Hidetaka Miyazaki",
    genre: "Action RPG",
    platforms: ["PS4"],
    themeColor: "#ff4747",
    coverUrl: "/images/covers/bloodborne.png",
    heroUrl: "/images/heroes/bloodborne.png",
    scores: {
      metacritic: 92,
      opencritic: 93,
      user: 9.6,
      goty: 4,
    },
    scoreCategories: [
      { label: "Atmosphere", value: 10, max: 10 },
      { label: "Combat", value: 9.8, max: 10 },
      { label: "Lore", value: 9.5, max: 10 },
      { label: "Sound", value: 9.4, max: 10 },
    ],
    synopsis: [
      "Bloodborne takes players to the ancient, cursed city of Yharnam, a gothic metropolis known for its medical remedies and now overrun by a horrific endemic illness. As a Hunter, you must navigate the perilous streets, unravelling the city's darkest secrets to survive the Night of the Hunt.",
      "Shifting away from the defensive combat of Dark Souls, Bloodborne encourages aggressive, fast-paced encounters. Players wield transforming trick weapons and firearms to parry attacks, rewarding offense with the Rally system, which allows you to regain lost health by striking back quickly.",
      "The game masterfully transitions from gothic horror to cosmic, Lovecraftian dread, revealing Great Ones and eldritch truths hidden beneath the surface. It remains a beloved masterpiece for its unparalleled atmosphere and lore."
    ],
    specTable: {
      "Engine": "FromSoftware Engine",
      "Multiplayer": "Co-op up to 3 players, Invasions",
      "Playtime": "35-70 Hours",
      "Release Date": "Mar 24, 2015",
      "File Size": "Approx. 35 GB",
      "Age Rating": "M (Mature 17+)"
    },
    dlc: [
      { id: "old-hunters", name: "The Old Hunters", type: "Expansion", price: "$19.99", date: "Nov 24, 2015", description: "Experience the nightmare of the hunters who once guarded Byrgenwerth's deepest, darkest secrets. Adds new weapons, bosses, and lore.", status: "available" }
    ],
    characters: [
      { id: "gehrman", name: "Gehrman", role: "Mentor", allegiance: "Hunter's Dream", description: "The First Hunter, residing in the Hunter's Dream to guide new hunters through the night." },
      { id: "maria", name: "Lady Maria", role: "Boss", allegiance: "Astral Clocktower", description: "One of the first hunters and a student of Gehrman, guarding the secrets of the Fishing Hamlet." },
      { id: "ludwig", name: "Ludwig the Accursed", role: "Boss", allegiance: "Healing Church", description: "The first hunter of the Healing Church, now transformed into a grotesque beast." }
    ],
    locations: [
      { id: "yharnam", name: "Central Yharnam", type: "area", description: "The sprawling, gothic city streets filled with afflicted townsfolk." },
      { id: "hunters-dream", name: "Hunter's Dream", type: "hub", description: "A safe haven outside the waking world where hunters can upgrade and rest." },
      { id: "byrgenwerth", name: "Byrgenwerth", type: "area", description: "An old institution of learning situated by a serene, hidden lake." }
    ],
    gallery: [
      { id: "bb1", url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1600&auto=format&fit=crop", span2: true },
      { id: "bb2", url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop" },
      { id: "bb3", url: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop" },
      { id: "bb4", url: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?q=80&w=800&auto=format&fit=crop" }
    ],
    reviews: [
      { source: "IGN", score: 9.7, quote: "A terrifying, exhilarating, and completely unforgettable masterpiece." },
      { source: "GameSpot", score: 9, quote: "Bloodborne is an incredibly intense, atmospheric, and rewarding game." },
      { source: "Polygon", score: 9.5, quote: "A brilliant, harrowing descent into madness that demands to be played." }
    ]
  },
  {
    slug: "witcher-3",
    title: "The Witcher 3: Wild Hunt",
    subtitle: "Wiedźmin 3: Dziki Gon — \"The world doesn't need a hero, it needs a professional.\"",
    year: 2015,
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    director: "Konrad Tomaszkiewicz",
    genre: "Action RPG",
    platforms: ["PC", "PS4", "PS5", "Xbox One", "Xbox Series", "Switch"],
    themeColor: "#e0a96d",
    coverUrl: "/images/covers/witcher3.png",
    heroUrl: "/images/heroes/witcher3.png",
    scores: {
      metacritic: 93,
      opencritic: 93,
      user: 9.4,
      goty: 250,
    },
    scoreCategories: [
      { label: "Narrative", value: 10, max: 10 },
      { label: "World", value: 9.8, max: 10 },
      { label: "Quests", value: 10, max: 10 },
      { label: "Combat", value: 8.5, max: 10 },
    ],
    synopsis: [
      "The Witcher 3: Wild Hunt is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences. You play as Geralt of Rivia, a monster slayer tasked with finding a child of prophecy in a vast open world rich with merchant cities, pirate islands, dangerous mountain passes, and forgotten caverns.",
      "The game is renowned for its writing, mature themes, and deeply engaging side quests that often outshine main storylines in other games. Every choice matters, leading to multiple different endings for characters and entire regions.",
      "With its expansions, Hearts of Stone and Blood and Wine, it offers one of the most complete and satisfying RPG experiences ever crafted, setting a benchmark for storytelling in games."
    ],
    specTable: {
      "Engine": "REDengine 3",
      "Multiplayer": "None",
      "Playtime": "100-200 Hours",
      "Release Date": "May 19, 2015",
      "File Size": "Approx. 50 GB",
      "Age Rating": "M (Mature 17+)"
    },
    dlc: [
      { id: "hos", name: "Hearts of Stone", type: "Expansion", price: "$9.99", date: "Oct 13, 2015", description: "Geralt is hired to defeat a ruthless bandit captain, Olgierd von Everec, a man who possesses the power of immortality.", status: "available" },
      { id: "baw", name: "Blood and Wine", type: "Expansion", price: "$19.99", date: "May 31, 2016", description: "Travel to the vibrant and untouched land of Toussaint, where an ancient secret and a beast terrorizing the kingdom await.", status: "available" }
    ],
    characters: [
      { id: "geralt", name: "Geralt of Rivia", role: "Protagonist", allegiance: "Wolf School", description: "A mutated monster hunter for hire, searching for his adopted daughter Ciri." },
      { id: "ciri", name: "Ciri", role: "Deuteragonist", allegiance: "None", description: "The Child of Prophecy, carrying the Elder Blood and hunted by the Wild Hunt." },
      { id: "yennefer", name: "Yennefer of Vengerberg", role: "Ally", allegiance: "Lodge of Sorceresses", description: "A powerful sorceress and Geralt's true love, aiding in the search for Ciri." }
    ],
    locations: [
      { id: "velen", name: "Velen", type: "area", description: "A war-torn, swampy region known as No Man's Land, ruled by the Bloody Baron." },
      { id: "novigrad", name: "Novigrad", type: "area", description: "The largest city in the North, a bustling hub of commerce, religion, and crime." },
      { id: "skellige", name: "Skellige", type: "area", description: "A harsh, mountainous archipelago inhabited by proud clans of warriors and sailors." }
    ],
    gallery: [
      { id: "w1", url: "https://images.unsplash.com/photo-1443632864897-14973fa006cf?q=80&w=1600&auto=format&fit=crop", span2: true },
      { id: "w2", url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&auto=format&fit=crop" },
      { id: "w3", url: "https://images.unsplash.com/photo-1506804886640-20a390977d2d?q=80&w=800&auto=format&fit=crop" }
    ],
    reviews: [
      { source: "IGN", score: 9.3, quote: "One of the best role-playing games ever crafted, a titan among giants." },
      { source: "GameSpot", score: 10, quote: "A masterpiece that sets a new bar for storytelling in video games." },
      { source: "PC Gamer", score: 9.2, quote: "An immersive, beautifully written adventure that you can lose yourself in for months." }
    ]
  },
  {
    slug: "red-dead-redemption-2",
    title: "Red Dead Redemption 2",
    subtitle: "\"Outlaws for life.\"",
    year: 2018,
    developer: "Rockstar Studios",
    publisher: "Rockstar Games",
    director: "Imran Sarwar",
    genre: "Action-Adventure",
    platforms: ["PS4", "Xbox One", "PC"],
    themeColor: "#ff4747",
    coverUrl: "/images/covers/rdr2.png",
    heroUrl: "/images/heroes/rdr2.png",
    scores: {
      metacritic: 97,
      opencritic: 97,
      user: 9.1,
      goty: 175,
    },
    scoreCategories: [
      { label: "Narrative", value: 10, max: 10 },
      { label: "World", value: 10, max: 10 },
      { label: "Graphics", value: 10, max: 10 },
      { label: "Realism", value: 9.5, max: 10 },
    ],
    synopsis: [
      "America, 1899. The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs. Those who will not surrender or succumb are killed. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee.",
      "With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive.",
      "As deepening internal divisions threaten to tear the gang apart, Arthur must make a choice between his own ideals and loyalty to the gang who raised him."
    ],
    specTable: {
      "Engine": "RAGE",
      "Multiplayer": "Red Dead Online",
      "Playtime": "60-120 Hours",
      "Release Date": "Oct 26, 2018",
      "File Size": "Approx. 120 GB",
      "Age Rating": "M (Mature 17+)"
    },
    dlc: [],
    characters: [
      { id: "arthur", name: "Arthur Morgan", role: "Protagonist", allegiance: "Van der Linde Gang", description: "A seasoned outlaw and Dutch's most trusted enforcer, struggling with his morality as the gang's era ends." },
      { id: "dutch", name: "Dutch van der Linde", role: "Leader", allegiance: "Van der Linde Gang", description: "The charismatic, idealistic, but increasingly erratic leader of the gang." },
      { id: "john", name: "John Marston", role: "Ally", allegiance: "Van der Linde Gang", description: "A core member of the gang trying to build a family life amidst the chaos of the outlaw lifestyle." }
    ],
    locations: [
      { id: "valentine", name: "Valentine", type: "hub", description: "A muddy, livestock town filled with cowboys, outlaws, and mud." },
      { id: "saint-denis", name: "Saint Denis", type: "hub", description: "A bustling, modernizing southern city heavily inspired by New Orleans." },
      { id: "ambarino", name: "Ambarino", type: "area", description: "The freezing, snowy northern mountains where the gang starts their journey." }
    ],
    gallery: [
      { id: "rdr1", url: "https://images.unsplash.com/photo-1549488344-c15da08d8101?q=80&w=1600&auto=format&fit=crop", span2: true },
      { id: "rdr2", url: "https://images.unsplash.com/photo-1502484918236-0c9f13e7cebb?q=80&w=800&auto=format&fit=crop" },
      { id: "rdr3", url: "https://images.unsplash.com/photo-1533221976527-81789c0953a9?q=80&w=800&auto=format&fit=crop" }
    ],
    reviews: [
      { source: "IGN", score: 10, quote: "Red Dead Redemption 2 stands shoulder-to-shoulder with Grand Theft Auto V as one of the greatest games of the modern age." },
      { source: "GameSpot", score: 9, quote: "An excellent prequel, but it's also an emotional, thought-provoking story in its own right." },
      { source: "Polygon", score: 10, quote: "A staggering achievement in world-building and character development." }
    ]
  },
  {
    slug: "hollow-knight",
    title: "Hollow Knight",
    subtitle: "\"Descend into the Dark.\"",
    year: 2017,
    developer: "Team Cherry",
    publisher: "Team Cherry",
    director: "Ari Gibson, William Pellen",
    genre: "Metroidvania",
    platforms: ["PC", "Switch", "PS4", "Xbox One"],
    themeColor: "#7c6aff",
    coverUrl: "/images/covers/hollow-knight.png",
    heroUrl: "/images/heroes/hollow-knight.png",
    scores: {
      metacritic: 90,
      opencritic: 90,
      user: 9.3,
      goty: 3,
    },
    scoreCategories: [
      { label: "Design", value: 10, max: 10 },
      { label: "Art", value: 9.5, max: 10 },
      { label: "Music", value: 9.8, max: 10 },
      { label: "Combat", value: 9.0, max: 10 },
    ],
    synopsis: [
      "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style.",
      "Beneath the fading town of Dirtmouth sleeps an ancient, ruined kingdom. Many are drawn below the surface, searching for riches, or glory, or answers to old secrets.",
      "As the enigmatic Knight, you'll traverse the depths of Hallownest, unraveling its mysteries and conquering its challenges in this beloved modern Metroidvania."
    ],
    specTable: {
      "Engine": "Unity",
      "Multiplayer": "None",
      "Playtime": "30-50 Hours",
      "Release Date": "Feb 24, 2017",
      "File Size": "Approx. 9 GB",
      "Age Rating": "E10+ (Everyone 10+)"
    },
    dlc: [
      { id: "godmaster", name: "Godmaster", type: "Update", price: "Free", date: "Aug 23, 2018", description: "Take your place amongst the Gods. New Characters and Quest. New Boss Fights.", status: "owned" },
      { id: "grimm", name: "The Grimm Troupe", type: "Update", price: "Free", date: "Oct 26, 2017", description: "Light the Nightmare Lantern. Summon the Troupe. New Major Quest. New Boss Fights. New Charms. New Enemies. New Friends.", status: "owned" }
    ],
    characters: [
      { id: "knight", name: "The Knight", role: "Protagonist", allegiance: "None", description: "A silent vessel wielding a simple nail, journeying through the ruins of Hallownest." },
      { id: "hornet", name: "Hornet", role: "Rival/Ally", allegiance: "Hallownest", description: "The nimble protector of Hallownest's ruins, armed with a needle and thread." },
      { id: "hollowknight", name: "The Hollow Knight", role: "Boss", allegiance: "None", description: "A vessel chosen to contain the Infection, sealed away in the Black Egg Temple." }
    ],
    locations: [
      { id: "dirtmouth", name: "Dirtmouth", type: "hub", description: "The fading town on the surface, acting as a small refuge for travelers." },
      { id: "forgotten-crossroads", name: "Forgotten Crossroads", type: "area", description: "The upper ruins of Hallownest, serving as an entry point to deeper areas." },
      { id: "city-of-tears", name: "City of Tears", type: "area", description: "The capital of Hallownest, endlessly rained upon by water from the Blue Lake above." }
    ],
    gallery: [
      { id: "hk1", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop", span2: true },
      { id: "hk2", url: "https://images.unsplash.com/photo-1540998145320-cbeac28eb71a?q=80&w=800&auto=format&fit=crop" },
      { id: "hk3", url: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be1?q=80&w=800&auto=format&fit=crop" }
    ],
    reviews: [
      { source: "IGN", score: 9.4, quote: "Hollow Knight is a masterpiece of the Metroidvania genre." },
      { source: "GameSpot", score: 9, quote: "A rich world, full of secrets, that completely draws you in." },
      { source: "PC Gamer", score: 92, quote: "An exceptional adventure game." }
    ]
  },
  {
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    subtitle: "\"Wake the f*** up, Samurai. We have a city to burn.\"",
    year: 2020,
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    director: "Gabe Amatangelo",
    genre: "Action RPG",
    platforms: ["PC", "PS5", "Xbox Series", "PS4", "Xbox One"],
    themeColor: "#fce000",
    coverUrl: "/images/covers/cyberpunk.png",
    heroUrl: "/images/heroes/cyberpunk.png",
    scores: {
      metacritic: 86,
      opencritic: 86,
      user: 8.5,
      goty: 20,
    },
    scoreCategories: [
      { label: "City", value: 10, max: 10 },
      { label: "Story", value: 9.0, max: 10 },
      { label: "Graphics", value: 9.5, max: 10 },
      { label: "Combat", value: 8.5, max: 10 },
    ],
    synopsis: [
      "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.",
      "You can customize your character's cyberware, skillset and playstyle, and explore a vast city where the choices you make shape the story and the world around you.",
      "With the release of the Phantom Liberty expansion and Update 2.0, the game has been thoroughly overhauled, delivering the definitive cyberpunk experience."
    ],
    specTable: {
      "Engine": "REDengine 4",
      "Multiplayer": "None",
      "Playtime": "50-100 Hours",
      "Release Date": "Dec 10, 2020",
      "File Size": "Approx. 70 GB",
      "Age Rating": "M (Mature 17+)"
    },
    dlc: [
      { id: "phantom-liberty", name: "Phantom Liberty", type: "Expansion", price: "$29.99", date: "Sep 26, 2023", description: "A new spy-thriller adventure for Cyberpunk 2077. Return as cyber-enhanced mercenary V and embark on a high-stakes mission of espionage and intrigue to save the NUSA President.", status: "available" }
    ],
    characters: [
      { id: "v", name: "V", role: "Protagonist", allegiance: "None", description: "An up-and-coming mercenary looking to make it big in Night City." },
      { id: "johnny", name: "Johnny Silverhand", role: "Ally", allegiance: "Samurai", description: "A legendary rockerboy and terrorist whose digital engram is stuck in V's head." },
      { id: "panam", name: "Panam Palmer", role: "Ally", allegiance: "Aldecaldos", description: "A nomad who left her clan to become a mercenary in Night City." }
    ],
    locations: [
      { id: "night-city", name: "Night City", type: "area", description: "A sprawling metropolis in the Free State of Northern California, controlled by megacorporations." },
      { id: "dogtown", name: "Dogtown", type: "area", description: "A walled-off combat zone in Pacifica, ruled by the warlord Kurt Hansen." },
      { id: "badlands", name: "The Badlands", type: "area", description: "The vast, arid plains surrounding Night City, home to Nomad clans." }
    ],
    gallery: [
      { id: "cp1", url: "https://images.unsplash.com/photo-1589315053535-6b5860d5b0d6?q=80&w=1600&auto=format&fit=crop", span2: true },
      { id: "cp2", url: "https://images.unsplash.com/photo-1542382156909-9ae3829dc70f?q=80&w=800&auto=format&fit=crop" },
      { id: "cp3", url: "https://images.unsplash.com/photo-1605330364177-3e1104e760c4?q=80&w=800&auto=format&fit=crop" }
    ],
    reviews: [
      { source: "IGN", score: 9, quote: "A sprawling RPG with an exceptional level of detail in its world." },
      { source: "GameSpot", score: 8, quote: "Night City is a fascinating, awe-inspiring place to explore." },
      { source: "PC Gamer", score: 85, quote: "An ambitious, occasionally brilliant RPG." }
    ]
  }
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
