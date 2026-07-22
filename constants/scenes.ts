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
  /**
   * Documented path of the manually-provided reference image for this scene
   * (see docs/SCENES_README.md). Not resolved dynamically — an entry must
   * also be added to constants/sceneImages.ts once the file actually exists,
   * since Metro requires static require() paths.
   */
  exampleImage?: string;
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
  // --- The 5 scenes below use exact, unedited prompts supplied by the
  // project owner (see docs/PROMPTS.md) and do not use PROMPT_HEADER/FOOTER. ---
  {
    id: 'lamborghini_pov',
    emoji: '🏎️',
    name: 'Lamborghini Driving POV',
    location: 'Downtown Dubai',
    category: 'Luxury',
    bgColors: ['#101014', '#050506'],
    badge: 'HOT',
    views: 87400,
    description:
      'An unplanned, handheld-style shot from the driver seat of a matte black Lamborghini Huracán Evo at a red light in Downtown Dubai, luxury shopping bags visible on the passenger seat.',
    outfitDetails: 'Fitted black t-shirt, black tailored trousers, Audemars Piguet Royal Oak Offshore.',
    exampleImage: '/scenes/lamborghini-pov.jpg',
    prompt:
      'Use the uploaded reference image for the male subject. The facial identity must be reproduced 1:1 with absolutely no changes to bone structure, facial proportions, skin tone, hairline, facial hair density, or overall appearance. No beautification. No smoothing. No substitutions. Natural skin texture preserved. A completely unplanned vertical iPhone photo (9:16) taken from the passenger seat of a Lamborghini Huracán Evo at night in Downtown Dubai. Slight handheld tilt. Slight imperfect framing. Not centered. Looks like someone casually snapped it mid-drive at a red light. Exact car: Lamborghini Huracán Evo (matte black exterior, black Alcantara interior with contrast stitching, correct dashboard structure, no duplicated doors, correct single door per side). Camera angle: Shot from slightly above center console height. Driver clearly visible. Passenger seat partially visible with shopping bags. The male subject is in the driver seat, one hand resting loosely on the steering wheel, the other hand holding his phone mid-scroll. He is slightly smiling at the screen — subtle, confident, not exaggerated. Eyes focused on phone. Not looking at camera. Outfit: Fitted black short-sleeve t-shirt stretched across chest Black tailored trousers Luxury watch clearly visible (Audemars Piguet Royal Oak Offshore, accurate proportions) Natural brown arm hair visible No AirPods Passenger seat: Clearly visible luxury shopping bags casually placed, not staged. Brands must be readable and correct: Louis Vuitton (brown monogram bag) Dior (white bag with black logo) Chanel (black bag with white lettering) Apple Store bag (white with logo) Bags slightly leaning due to car movement. Not perfectly arranged. Handles slightly twisted. Natural placement. Interior details: Correct Lamborghini steering wheel with centered bull emblem Digital cluster visible but not glowing unnaturally Center console buttons correct Alcantara texture visible No extra panels No duplicate doors Outside the windshield: Downtown Dubai at night. Burj Khalifa visible in the distance but slightly off to the side. Traffic lights reflecting on windshield. Other cars slightly blurred from shallow focus. Warm street lighting reflecting on dashboard. Lighting: Mixed city light + dashboard glow. Uneven exposure. Soft light on face from phone screen. Mild iPhone night grain. Natural skin tone. No cinematic color grading. The image should feel like: Red light stop. Phone buzz. Bags on seat. Engine humming. City glowing. Low-key flex. Unplanned. Real.',
  },
  {
    id: 'dubai_jetski',
    emoji: '🛥️',
    name: 'Dubai Jetski',
    location: 'Dubai Marina',
    category: 'Luxury',
    bgColors: ['#0a1420', '#04070c'],
    badge: 'NEW',
    views: 52100,
    description:
      'Standing on a jet ski on calm night water with a superyacht and the Dubai skyline glowing behind, captured spontaneously from a nearby jet ski.',
    outfitDetails: 'Swim shorts only, natural physique, no accessories.',
    exampleImage: '/scenes/dubai-jetski.jpg',
    prompt:
      'Use the uploaded reference image for the male subject. The facial identity must be reproduced 1:1 with absolutely no changes to bone structure, facial proportions, skin tone, hairline, facial hair density, or overall appearance. No beautification. No smoothing. No substitutions. Natural skin texture preserved. A completely unplanned vertical iPhone photo (9:16) captured at night from another jet ski floating on calm water. Slight handheld instability. Slight tilt. Not centered. Slight digital grain from low light. Looks like a friend quickly lifted the phone to capture the moment. Distance composition: The camera is approximately 6–7 meters away from the subject. The male subject is standing upright on a black jet ski floating still on the water. Roughly 15 meters behind him there is a large luxury superyacht with full exterior lights on. Further in the distance, the Dubai skyline is clearly visible, including recognizable skyscraper silhouettes glowing in the night air. The subject is wearing only fitted swim shorts. Upper body completely visible. Face clearly visible. He is balanced confidently on the jet ski seat platform. One arm relaxed at his side. The other hand raised slightly outward making a clear hand gesture. Not exaggerated. Natural. Casual. Slight confident expression. Physique: Thick chest. Broad shoulders. Full arms. Visible abdominal definition. Strong quad structure. Natural muscle density — not exaggerated. Slight sheen from ocean water reflection. Environment details: Calm dark water with subtle reflections from yacht lights. Small ripples around the jet ski. The yacht behind has multiple deck levels illuminated with warm white lighting. Interior cabin glow visible. Soft blue and gold city lights from Dubai skyline reflecting across the water surface. Very slight humidity haze in the air. Jet ski details: Modern performance jet ski. Gloss black body. Handlebars visible. Front nose slightly angled toward camera. No distortion of proportions. Lighting: Mixed yacht light + city skyline glow. Uneven exposure typical of iPhone night shot. Slight grain. No spotlight effect. No cinematic grading. Realistic night contrast. The image should feel like: Late Dubai night. Water still. Engine off. Yacht behind. City glowing. Captured spontaneously. Real presence.',
  },
  {
    id: 'dubai_shopping_lambo',
    emoji: '🛍️',
    name: 'Dubai Shopping Bags in Lamborghini',
    location: 'Dubai Mall',
    category: 'Luxury',
    bgColors: ['#1c1408', '#08050a'],
    badge: 'HOT',
    views: 63800,
    description:
      'A wide, casual interior shot inside a Lamborghini Aventador SVJ parked outside Dubai Mall at night, luxury shopping bags on the passenger seat and floor.',
    outfitDetails: 'Rolex Daytona, luxury shopping bags (Louis Vuitton, Dior, Gucci).',
    exampleImage: '/scenes/dubai-shopping-lambo.jpg',
    prompt:
      'Use the uploaded reference image for the male subject. The facial identity must be reproduced exactly 1:1 with no changes to bone structure, facial proportions, skin tone, hairline, facial hair, or natural expression. No beautification. No smoothing. No substitutions. A natural, unplanned first-person vertical iPhone photo (9:16) captured while seated inside a Lamborghini Aventador SVJ parked outside Dubai Mall at night. The camera must be positioned slightly farther from the wrist than a typical close-up. The framing should capture a wide interior view — full steering wheel, most of the dashboard, center console, part of the passenger seat, and visible exterior environment through both the windshield and open scissor door. The wrist should not dominate the frame. The watch must be visible but not zoomed-in. Exact car: Lamborghini Aventador SVJ (correct hexagonal air vents, accurate digital cluster shape, exposed carbon fiber trim aligned properly, correct scissor door hinge mechanism with only the driver-side door open). No warped geometry. On the passenger seat and extending into the footwell are multiple luxury shopping bags: Louis Vuitton (monogram accurate) Dior (white bag, centered logo) Gucci (cream bag with green-red stripe detail) The bags should be clearly visible within the wider composition, not cropped out. They must sit naturally with slight wrinkles and imperfect handle positioning. The subject\'s left hand rests casually on the upper-left quadrant of the steering wheel. A Rolex Daytona (black dial, ceramic bezel) is visible but proportionally smaller within the frame due to the wider camera distance. Natural brown to light-brown wrist hair visible. The right hand holds the phone mid-scroll. The subject is actively looking at the phone screen. Outside the vehicle: Dubai Mall façade lighting Palm trees with warm uplighting Valet stand and cones Luxury vehicles parked nearby Faint Burj Khalifa lights visible in distance The scissor door is open upward, allowing more exterior lighting to spill into the cabin. Mixed lighting creates uneven highlights across the interior surfaces and subtle reflections on the watch crystal. Slight exposure imbalance between bright mall lights and darker interior. Mild smartphone grain consistent with low-light capture. Important: The composition must feel wide and environmental, not cropped tight. The interior, shopping bags, and exterior surroundings must all be clearly visible in a single balanced frame. No cinematic lighting. No artificial glow. No macro wrist close-up. No UI overlays. No symmetry correction. No AirPods or earbuds. The image must feel like the subject casually lifted his phone to capture the entire scene — not a close-up watch advertisement.',
  },
  {
    id: 'girlfriend_jet_bugatti',
    emoji: '✈️',
    name: 'Girlfriend, Private Jet and Bugatti',
    location: 'Private Airport',
    category: 'Jets',
    bgColors: ['#0d1420', '#05070c'],
    badge: 'PRO',
    views: 71200,
    description:
      'A private airport runway at night with a Gulfstream G700 and a two-tone Bugatti Chiron Sport, the subject standing between them with a companion close by his side.',
    outfitDetails: 'Balmain t-shirt, Dior B27 sneakers, Patek Philippe Nautilus.',
    exampleImage: '/scenes/girlfriend-jet-bugatti.jpg',
    prompt:
      'Use the uploaded reference image for the male subject. Match his facial structure, proportions, skin tone, hairline, facial hair, and overall appearance naturally and accurately. No beautification. No substitutions. Generate a highly realistic vertical iPhone photo (9:16) captured casually for Instagram Stories or TikTok slideshow. Slight handheld tilt. Imperfect framing like it was snapped quickly during movement. Location: Private airport runway at night. A large Gulfstream G700 jet parked behind with cabin lights glowing. Runway lights stretching into the distance. Exact car: Bugatti Chiron Sport (gloss black and deep blue two-tone exterior, signature C-shaped side profile correctly proportioned, black wheels). Correct factory proportions. Driver-side door open normally. Passenger side closed. The Chiron is parked directly in front of the jet stairs. Real runway texture. Slight reflection from runway lights on the paint. The male subject is standing between the open Bugatti door and the lowered jet stairs. Upper body fully visible. One hand holding his phone mid-scroll. Eyes locked on the screen. Calm expression despite chaos around him. A generated woman is extremely close to him, standing on his side and leaning into his shoulder slightly. One hand resting lightly on his chest. She is looking toward him, not at the camera. Her outfit matches runway luxury: Fitted black tailored blazer dress High designer heels Sleek straight hair Subtle diamond earrings catching runway lights Outfit (male): Black fitted Balmain t-shirt Dark tailored trousers White Dior B27 sneakers Patek Philippe Nautilus stainless steel Natural brown arm hair visible No AirPods Behind them, the jet engines are beginning to spool slightly, creating visible wind movement in clothing and hair. Not exaggerated — just enough motion to create energy. Slight blur from runway lights in distance. Interior visible through open door: Bugatti steering wheel with correct emblem Luxury leather interior with blue stitching Digital cluster visible naturally Lighting: Mixed runway floodlights and jet cabin glow. Uneven smartphone exposure. Slight grain. Real reflections across body panels. Subtle motion blur from wind. The image should feel like: Runway wind. Jet ready. Bugatti door open. Phone check. She close. Engines humming. Untouchable.',
  },
  {
    id: 'highrise_pool',
    emoji: '🏊',
    name: 'High-Rise Pool Relax',
    location: 'Miami',
    category: 'Lifestyle',
    bgColors: ['#1a2818', '#08100a'],
    badge: 'NEW',
    views: 44900,
    description:
      'Standing at the edge of a Miami high-rise rooftop infinity pool during golden hour, drink in hand, skyline in the distance.',
    outfitDetails: 'Louis Vuitton or Dior swim shorts, sunglasses.',
    exampleImage: '/scenes/highrise-pool.jpg',
    prompt:
      'Use the uploaded reference image for the male subject. The facial identity must be reproduced 1:1 with absolutely no changes to bone structure, facial proportions, skin tone, hairline, facial hair density, or overall appearance. No beautification. No smoothing. No substitutions. Natural skin texture preserved. A completely unplanned vertical iPhone photo (9:16) captured on a Miami high-rise rooftop pool during late afternoon golden hour. Slight handheld tilt. Slight imperfect framing. Looks like someone in the pool quickly lifted the phone to capture the moment. Not centered. Slight motion blur from movement. Camera distance: Approximately 2–3 meters away from the subject. The male subject is standing at the edge of the rooftop infinity pool, one foot slightly in the water. Upper body fully visible. Face clearly visible. He is holding a short glass with ice (clear drink) in one hand while casually adjusting his sunglasses with the other. Not looking at camera — eyes slightly toward the skyline. Natural expression. Physique: Thick chest. Broad shoulders. Full arms with natural vascularity. Clear abdominal definition. Strong quad structure visible. Natural summer tan. Slight water droplets on lower legs. Outfit: Luxury fitted swim shorts (Louis Vuitton or Dior — correct monogram placement).',
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

export const FILTER_CATEGORIES = [
  'All',
  'Luxury',
  'Dubai',
  'Europe',
  'Jets',
  'Nature',
  'Night',
  'Lifestyle',
  'Custom',
] as const;

export function getSceneById(id: string): AnyScene | undefined {
  return ALL_SCENES.find((s) => s.id === id);
}

export function isRealScene(scene: AnyScene): scene is RealScene {
  return 'prompt' in scene;
}
