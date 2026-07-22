export type SceneBadge = 'NEW' | 'PRO' | 'HOT' | null;

export interface RealScene {
  id: string;
  emoji: string;
  name: string;
  location: string;
  category: string;
  bgColors: readonly [string, string];
  badge: SceneBadge;
  views: number;
  description: string;
  outfitDetails: string;
  prompt: string;
}

export interface ExtraScene {
  id: string;
  emoji: string;
  name: string;
  location: string;
  category: string;
  bgColors: readonly [string, string];
  badge: SceneBadge;
  views: number;
}

const PROMPT_HEADER =
  'Use the uploaded reference image(s) for the male or female subject. ' +
  'The facial identity must be reproduced 1:1 with no changes to bone structure, ' +
  'facial proportions, skin tone, hairline, or expression. No beautification. ' +
  'No substitutions. No face smoothing.\n\n';

const PROMPT_FOOTER =
  '\n\nShot on iPhone 15 Pro Max. RAW capture. Photorealistic. ' +
  'No AI aesthetic. No CGI. No watermark. No text. 8K quality.';

function buildPrompt(body: string): string {
  return `${PROMPT_HEADER}${body}${PROMPT_FOOTER}`;
}

export const REAL_SCENES: RealScene[] = [
  {
    id: 'dubai-amg-night',
    emoji: '🇦🇪',
    name: 'Dubai AMG Night',
    location: 'Downtown Dubai',
    category: 'Dubai',
    bgColors: ['#3a1c5c', '#0d0a1f'],
    badge: 'HOT',
    views: 128400,
    description:
      'Standing beside a matte black Mercedes-AMG GT 63S with a rich purple interior, the Burj Khalifa towering behind you lit up against the Downtown Dubai night skyline.',
    outfitDetails: 'Black tailored fit, subtle luxury accents, Burj Khalifa in the background.',
    prompt: buildPrompt(
      'Place the subject standing next to a matte black Mercedes-AMG GT 63S with a deep purple leather interior visible through the open door, parked on a reflective wet street in Downtown Dubai at night. The Burj Khalifa rises dramatically in the background, fully lit, with warm city lights reflecting off the car and the pavement. Cinematic night photography, dramatic rim lighting from the skyline, shallow depth of field.'
    ),
  },
  {
    id: 'private-jet',
    emoji: '🛩️',
    name: 'Private Jet',
    location: 'Private Tarmac',
    category: 'Jets',
    bgColors: ['#1a2a4a', '#05070f'],
    badge: 'PRO',
    views: 96200,
    description:
      'Boarding a Gulfstream G700 on a private tarmac at night, carrying a Louis Vuitton Keepall duffel, a Rolex Daytona on the wrist, wearing an Essentials hoodie.',
    outfitDetails: 'Essentials hoodie, LV Keepall duffel, Rolex Daytona.',
    prompt: buildPrompt(
      'Place the subject walking toward a Gulfstream G700 private jet on a private airport tarmac at night, jet stairs deployed with warm cabin light glowing from inside. The subject carries a Louis Vuitton Keepall duffel bag, wears a Rolex Daytona watch, and an Essentials hoodie with matching sweatpants. Ambient tarmac floodlights, cinematic low-key lighting, sense of quiet luxury and travel.'
    ),
  },
  {
    id: 'monaco-rooftop',
    emoji: '🇲🇨',
    name: 'Monaco Rooftop',
    location: 'Monte Carlo',
    category: 'Europe',
    bgColors: ['#0f3a4a', '#071018'],
    badge: 'NEW',
    views: 74300,
    description:
      'Relaxing on a luxury hotel rooftop terrace overlooking the Monaco harbor, superyachts anchored below, the Monte Carlo Casino glowing in the distance, a Patek Philippe Nautilus on the wrist.',
    outfitDetails: 'Linen resort shirt, Patek Philippe Nautilus.',
    prompt: buildPrompt(
      'Place the subject on a luxury rooftop terrace bar in Monte Carlo, Monaco, at dusk, overlooking a marina filled with superyachts and the illuminated Monte Carlo Casino in the distance. The subject wears an open linen resort shirt and a Patek Philippe Nautilus watch. Golden hour lighting mixed with warm terrace ambient lights, soft bokeh from string lights, opulent Mediterranean atmosphere.'
    ),
  },
  {
    id: 'underground-parking',
    emoji: '🅿️',
    name: 'Underground Parking',
    location: 'Private Garage',
    category: 'Luxury',
    bgColors: ['#2a2a3a', '#08080c'],
    badge: null,
    views: 58900,
    description:
      'Posed between a Lamborghini Huracán EVO and a Mercedes-G63 AMG under harsh fluorescent garage lighting, wearing Chrome Hearts and Amiri jeans, an Audemars Piguet Royal Oak on the wrist.',
    outfitDetails: 'Chrome Hearts tee, Amiri jeans, AP Royal Oak.',
    prompt: buildPrompt(
      'Place the subject standing in an underground private parking garage between a Lamborghini Huracán EVO and a Mercedes-Benz G63 AMG, under harsh overhead fluorescent lighting creating high-contrast shadows on the concrete floor and pillars. The subject wears a Chrome Hearts graphic t-shirt, Amiri distressed jeans, and an Audemars Piguet Royal Oak watch. Gritty editorial street-style lighting, sharp reflections on the car paint.'
    ),
  },
  {
    id: 'helipad-hongkong',
    emoji: '🚁',
    name: 'Helipad Hong Kong',
    location: 'Victoria Harbour',
    category: 'Luxury',
    bgColors: ['#1a1a3a', '#050510'],
    badge: 'PRO',
    views: 41200,
    description:
      'Standing on a rooftop helipad beside an Airbus H145 helicopter, Victoria Harbour and the Hong Kong skyline stretching out behind, wearing a Moncler puffer and an AP Royal Oak Offshore.',
    outfitDetails: 'Moncler puffer jacket, AP Royal Oak Offshore.',
    prompt: buildPrompt(
      'Place the subject standing on a rooftop helipad next to a parked Airbus H145 helicopter, with the Hong Kong skyline and Victoria Harbour visible in the background at dusk, skyscraper lights beginning to glow. The subject wears a Moncler puffer jacket and an Audemars Piguet Royal Oak Offshore watch. Wind-swept hair, dramatic elevated perspective, crisp cool-toned lighting.'
    ),
  },
  {
    id: 'paris-night',
    emoji: '🗼',
    name: 'Paris Night',
    location: 'Saint-Germain',
    category: 'Europe',
    bgColors: ['#2a1a3a', '#080510'],
    badge: null,
    views: 63700,
    description:
      'Walking the wet cobblestone streets of Saint-Germain at night under a classic French lamppost, wearing Nike Tech Fleece and Air Force 1s.',
    outfitDetails: 'Nike Tech Fleece, Nike Air Force 1.',
    prompt: buildPrompt(
      'Place the subject walking on wet cobblestone streets in Saint-Germain-des-Prés, Paris, at night, illuminated by a classic wrought-iron French street lamp with reflections shimmering on the rain-soaked stones. The subject wears a Nike Tech Fleece set and white Nike Air Force 1 sneakers. Moody cinematic street photography, soft warm lamplight against a cool blue night sky.'
    ),
  },
  {
    id: 'amalfi-coast',
    emoji: '🇮🇹',
    name: 'Amalfi Coast',
    location: 'Positano',
    category: 'Europe',
    bgColors: ['#1a3a5a', '#06121f'],
    badge: 'NEW',
    views: 39500,
    description:
      'Leaning against a white Ferrari Roma Spider on a cliffside road above Positano during blue hour, wearing a cream Loro Piana jacket.',
    outfitDetails: 'Loro Piana cream jacket, white Ferrari Roma Spider.',
    prompt: buildPrompt(
      'Place the subject leaning against a white Ferrari Roma Spider parked on a cliffside road above Positano on the Amalfi Coast during blue hour, the pastel cliffside village and Tyrrhenian Sea visible below. The subject wears a cream Loro Piana jacket. Soft blue-hour light mixed with warm village lights below, Mediterranean coastal ambience, cinematic wide shot.'
    ),
  },
  {
    id: 'burj-old-money',
    emoji: '🏙️',
    name: 'Burj Khalifa Old Money',
    location: 'Downtown Dubai',
    category: 'Dubai',
    bgColors: ['#3a2a1a', '#0f0a05'],
    badge: 'HOT',
    views: 152000,
    description:
      'Posed beside a Ferrari Roma Spider on an open plaza with the Burj Khalifa illuminated at night, wearing a Brunello Cucinelli blazer, a Patek Philippe Calatrava on the wrist.',
    outfitDetails: 'Brunello Cucinelli blazer, Patek Philippe Calatrava.',
    prompt: buildPrompt(
      'Place the subject standing beside a Ferrari Roma Spider on an open plaza in Downtown Dubai at night, the fully illuminated Burj Khalifa rising directly behind. The subject wears a tailored Brunello Cucinelli blazer and a Patek Philippe Calatrava watch. Old-money elegance, warm architectural up-lighting, cinematic symmetrical composition.'
    ),
  },
];

const CATEGORIES = ['Luxury', 'Dubai', 'Europe', 'Jets', 'Nature', 'Night', 'Custom'] as const;

const EMOJI_BY_CATEGORY: Record<string, string[]> = {
  Luxury: ['💎', '🥂', '🏆', '👔', '💍', '🛥️'],
  Dubai: ['🇦🇪', '🏙️', '🕌', '🌇'],
  Europe: ['🇫🇷', '🇮🇹', '🇲🇨', '🏛️', '🍷'],
  Jets: ['🛩️', '✈️', '🚁'],
  Nature: ['🏔️', '🌴', '🏝️', '🌊', '🌵', '🌅'],
  Night: ['🌃', '🌙', '✨', '🎆'],
  Custom: ['🎨', '🖌️', '🪄', '🌀'],
};

const LOCATIONS_BY_CATEGORY: Record<string, string[]> = {
  Luxury: ['Beverly Hills', 'Fifth Avenue', 'Mayfair', 'Saint-Tropez'],
  Dubai: ['Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Al Barari'],
  Europe: ['Lake Como', 'Santorini', 'Ibiza', 'Zurich'],
  Jets: ['Teterboro', 'Le Bourget', 'Nice Airport', 'Van Nuys'],
  Nature: ['Maldives', 'Swiss Alps', 'Bali', 'Patagonia'],
  Night: ['Tokyo', 'Las Vegas', 'Miami', 'Shanghai'],
  Custom: ['Your Vision', 'Studio', 'Dreamscape', 'Anywhere'],
};

const COLOR_PAIRS_BY_CATEGORY: Record<string, readonly [string, string][]> = {
  Luxury: [['#3a2a1a', '#0f0a05'], ['#2a2a3a', '#08080c'], ['#3a1c5c', '#0d0a1f']],
  Dubai: [['#3a1c5c', '#0d0a1f'], ['#3a2a1a', '#0f0a05']],
  Europe: [['#0f3a4a', '#071018'], ['#2a1a3a', '#080510'], ['#1a3a5a', '#06121f']],
  Jets: [['#1a2a4a', '#05070f'], ['#1a1a3a', '#050510']],
  Nature: [['#0f4a3a', '#05100b'], ['#1a3a5a', '#06121f'], ['#0f3a4a', '#071018']],
  Night: [['#1a1a3a', '#050510'], ['#2a1a3a', '#080510']],
  Custom: [['#3a1c5c', '#0d0a1f'], ['#1a2a4a', '#05070f']],
};

function seededBadge(i: number): SceneBadge {
  const r = i % 11;
  if (r === 0) return 'NEW';
  if (r === 4) return 'HOT';
  if (r === 7) return 'PRO';
  return null;
}

function generateExtraScenes(count: number): ExtraScene[] {
  const scenes: ExtraScene[] = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const emojis = EMOJI_BY_CATEGORY[category];
    const locations = LOCATIONS_BY_CATEGORY[category];
    const colorPairs = COLOR_PAIRS_BY_CATEGORY[category];
    const emoji = emojis[i % emojis.length];
    const location = locations[i % locations.length];
    const bgColors = colorPairs[i % colorPairs.length];
    scenes.push({
      id: `extra-${i}`,
      emoji,
      name: `${category} Scene ${i + 1}`,
      location,
      category,
      bgColors,
      badge: seededBadge(i),
      views: 500 + ((i * 137) % 45000),
    });
  }
  return scenes;
}

export const EXTRA_SCENES: ExtraScene[] = generateExtraScenes(100);

export type AnyScene = RealScene | ExtraScene;

export const ALL_SCENES: AnyScene[] = [...REAL_SCENES, ...EXTRA_SCENES];

export const FILTER_CATEGORIES = ['All', 'Luxury', 'Dubai', 'Europe', 'Jets', 'Nature', 'Night', 'Custom'] as const;

export function getSceneById(id: string): AnyScene | undefined {
  return ALL_SCENES.find((s) => s.id === id);
}

export function isRealScene(scene: AnyScene): scene is RealScene {
  return 'prompt' in scene;
}
