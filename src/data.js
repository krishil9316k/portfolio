// Everything the site shows lives here, so adding a project or a social is one edit.
const JSD = 'https://raw.githubusercontent.com/krishil9316k/krishil9316k.io/main/';

export const SOCIALS = [
  { name: 'GitHub', handle: '@krishil9316k', url: 'https://github.com/krishil9316k' },
  { name: 'LinkedIn', handle: 'Krishil Renuka', url: 'https://www.linkedin.com/in/krishil-renuka-41b87442a' },
  { name: 'Ovrix', handle: 'ovrix.in', url: 'https://www.ovrix.in' },
  // Set the url once the account exists; until then it shows as "soon".
  { name: 'Instagram', handle: '@krishilbuilds', url: 'https://www.instagram.com/krishilbuilds' },
  { name: 'YouTube', handle: '@krishilbuilds', url: 'https://www.youtube.com/@krishilbuilds' },
];

export const EMAIL = 'krishil@ovrix.in';

// Flagship work: what is running right now.
export const FLAGSHIP = [
  {
    id: 'ovrix',
    name: 'Ovrix',
    kind: 'AI studio · Live',
    line: 'My AI studio, run by a team of agents.',
    body: 'A Manager agent reads every client brief and hands it to 8 specialist agents. Support, Billing and a Watchdog look after clients and check every site every 30 minutes. I approve the big calls from a Discord control room.',
    stack: ['Vercel functions', 'Gemini', 'Supabase', 'Discord'],
    url: 'https://www.ovrix.in',
    cta: 'Visit ovrix.in',
    art: 'agents',
  },
  {
    id: 'kaapo',
    name: 'Kaapo',
    kind: 'Product · Live',
    line: 'A video editor you just talk to.',
    body: 'Drop in a reel and type what you want: "cut the pauses", "add captions", "make it 9:16". Kaapo writes hooks and captions in English, Hindi and Gujarati.',
    stack: ['JavaScript', 'Gemini', 'Canvas'],
    url: 'https://www.ovrix.in/kaapo',
    cta: 'Open Kaapo',
    art: 'timeline',
  },
  {
    id: 'godview',
    name: 'God View',
    kind: 'Experiment · Live',
    line: 'The whole planet, live, in 3D.',
    body: 'Real aircraft, ships, public webcams and earthquakes on sharp satellite imagery. Every object is a 3D model I made in code, gliding on its real speed and heading. Click a plane to see a photo of that exact aircraft.',
    stack: ['Three.js', 'globe.gl', 'ADS-B', 'AIS', 'USGS'],
    url: 'https://god-view-bay.vercel.app',
    cta: 'Open God View',
    art: 'live',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    kind: 'AI agent · Personal',
    line: 'My own Jarvis. She talks, sees and remembers.',
    body: 'A voice assistant on my PC and phone that speaks English, Hindi and Gujarati, sees my screen and webcam, controls smart home devices, runs Windows automations and keeps long-term memory.',
    stack: ['Python', 'Flutter', 'LiveKit', 'Gemini Live', 'SQLite'],
    url: 'https://coruscating-kataifi-45e911.netlify.app',
    cta: 'Ruby details',
    art: 'orb',
  },
  {
    id: 'saathi',
    name: 'Saathi',
    kind: 'Product · Pilot',
    line: 'Grandparents order anything by just chatting.',
    body: 'A WhatsApp assistant for parents and grandparents. They type or speak what they need; a family guardian approves the payment from a shared wallet.',
    stack: ['WhatsApp', 'AI', 'UPI'],
    url: null,
    cta: null,
    art: 'chat',
  },
];

// The full index. cat: ai | web | bot | hw
export const WORK = [
  { t: 'Agent Office', cat: 'ai', d: 'My day runs here: Ruby and her agents plan my schedule, prepare checklists and remind me on my phone.', tags: ['Claude', 'Agents'] },
  { t: 'Chhotti GPT', cat: 'ai', d: 'My own ChatGPT-style assistant with streaming replies.', tags: ['Gemini', 'Streaming'] },
  { t: 'AI Waste Segregator', cat: 'hw', d: 'A webcam model sorts biodegradable from non-biodegradable waste and an Arduino tips the flap into the right bin.', tags: ['OpenCV', 'TensorFlow', 'Arduino'], video: JSD + 'waste-segregator.mp4' },
  { t: 'Shop Manager', cat: 'web', d: 'Sales, expenses, stock alerts and profit charts for my print and stationery shop, KRISHIL edu hub.', tags: ['JavaScript', 'Inventory'], url: 'https://claude.ai/artifact/HEBgxCWhwWECNMxs9g6DxD' },
  { t: 'ID Card Tool', cat: 'web', d: 'Turns a student Excel sheet into print-ready school ID cards in minutes. 12 templates, auto photo matching, cut guides.', tags: ['SheetJS', 'Print CSS'] },
  { t: 'Campus Bus Tracking', cat: 'web', d: 'A fleet platform that turns the driver’s phone into the GPS. Live map, ETA with the Haversine formula, SOS alerts.', tags: ['Leaflet', 'Firebase'], url: 'https://github.com/krishil9316k/enterprise-fleet-bus-tracker-or-realtime-campus-fleet-system', video: JSD + 'VECTRA.mp4' },
  { t: 'God Father', cat: 'bot', d: 'An all-in-one Discord security bot that guards and moderates a whole server.', tags: ['Discord.js', 'Security'] },
  { t: 'Haven Imperium', cat: 'bot', d: 'A community engine: tickets, temporary voice rooms, levels and a full tycoon economy.', tags: ['Node.js', 'SQLite'] },
  { t: 'Ruby Discord Bot', cat: 'bot', d: 'Runs the tickets, product checks and leaderboards for my editing and bot business.', tags: ['Node.js', 'discord-player'] },
  { t: 'Jivanroshni', cat: 'bot', d: 'Streams HD music from Spotify and SoundCloud links into voice channels, with Bassboost and Nightcore.', tags: ['Discord.js', 'FFmpeg'] },
  { t: 'Hand Motion Car', cat: 'hw', d: 'A car you drive by tilting your hand.', tags: ['C++', 'Arduino Nano'], img: 'assets/hand-motion.webp', video: JSD + 'hand-motion.mp4' },
  { t: 'Smart Stick', cat: 'hw', d: 'A walking stick for blind people. Ultrasonic sensors warn about obstacles ahead.', tags: ['C++', 'Arduino UNO'], img: 'assets/smart-stick.webp', video: JSD + 'smart-stick.mp4' },
  { t: '6-DOF Robotic Arm', cat: 'hw', d: 'Forward and inverse kinematics written from scratch, with a live simulation and safety limits.', tags: ['Python', 'Kinematics'] },
  { t: 'Floor Cleaning Robot', cat: 'hw', d: 'An early robot that drives cleaning routes and steers around obstacles.', tags: ['Arduino', 'Motors'], img: 'assets/floor-cleaner.webp' },
  { t: 'Robo Car', cat: 'hw', d: 'Where it started: a car I wired by hand on the floor at home, to learn how motor drivers work.', tags: ['H-bridge', 'Chassis'], img: 'assets/robo-car.webp' },
  { t: 'IoT Weather Station', cat: 'hw', d: 'An ESP32 with a DHT22 sensor that streams temperature and humidity to the cloud.', tags: ['ESP32', 'ThingSpeak'] },
];

export const CATS = { all: 'All', ai: 'AI & agents', web: 'Web & tools', bot: 'Bots', hw: 'Robotics' };

// How a day runs. These are real routines from my agent setup.
export const DAY = [
  ['07:00', 'Ruby', 'Writes today’s plan and sends it to my phone'],
  ['Every 30 min', 'Watchdog', 'Checks every site I run and alerts me if one is down'],
  ['On every brief', 'Manager', 'Reads the client brief and assigns the right specialist'],
  ['On every message', 'Support', 'Drafts the reply for me to approve'],
  ['21:00', 'Ruby', 'Drafts tonight’s build-log story from what I shipped'],
  ['While I sleep', 'All agents', 'Keep working'],
];

export const STACK = ['Python', 'JavaScript', 'Node.js', 'Three.js', 'Flutter', 'Gemini', 'Claude', 'LiveKit', 'Supabase', 'Firebase', 'Vercel', 'C++', 'Arduino', 'ESP32', 'OpenCV', 'Discord.js'];

export const CERTS = [
  ['AI Tools Certification', 'BE10X', '2025'],
  ['Basic Robotic Behaviors and Odometry', 'University of Colorado Boulder · Coursera', '2026'],
  ['Robotic Path Planning and Task Execution', 'University of Colorado Boulder · Coursera', '2026'],
];

// My AI team: every agent I have built, as registered in my Agent Office.
// s: live | soon | paused
export const TEAM = {
  head: { n: 'Ruby', r: 'My secretary. Takes roll call every 3 hours, hands out tasks and checks the work before it reaches me.' },
  depts: [
    { name: 'Home Office', note: 'My day', agents: [
      { n: 'Scheduler', r: 'Plans my day and week, keeps every deadline', s: 'live' },
      { n: 'Researcher', r: 'Looks things up and gives one clear recommendation', s: 'live' },
      { n: 'Writer', r: 'Drafts emails, messages and documents', s: 'live' },
      { n: 'Coder', r: 'Writes scripts, fixes errors, automates chores', s: 'live' },
      { n: 'Admin', r: 'Cleans files and data, never deletes without asking', s: 'live' },
    ] },
    { name: 'KRISHIL edu hub', note: 'My shop', agents: [
      { n: 'Shop Manager', r: 'Enters bills into stock, closes the day, weekly reports', s: 'live' },
      { n: 'Instagram', r: 'Weekly shop posts and captions in Gujarati and English', s: 'soon' },
    ] },
    { name: 'Ovrix', note: 'My AI studio', agents: [
      { n: 'Manager', r: 'Reads every client brief within a minute and picks the specialist', s: 'live' },
      { n: 'Video Editing', r: 'Edit plan, timeline and quote', s: 'live' },
      { n: 'AI Films', r: 'Story, scene list and tools', s: 'live' },
      { n: 'AI Ads', r: 'Hook, script and scenes', s: 'live' },
      { n: 'Website', r: 'Pages, stack and timeline', s: 'live' },
      { n: 'Custom Bots', r: 'WhatsApp, Telegram and AI chatbots', s: 'live' },
      { n: 'Discord Bots', r: 'Commands, moderation and hosting', s: 'live' },
      { n: 'Discord Servers', r: 'Channels, roles and onboarding', s: 'live' },
      { n: 'Hosting', r: 'Hosting and monthly maintenance plans', s: 'live' },
      { n: 'Support', r: 'Drafts client replies for me to approve', s: 'live' },
      { n: 'Watchdog', r: 'Checks every site every 30 minutes', s: 'live' },
      { n: 'Billing', r: 'Payment prompts; never marks anything paid itself', s: 'paused' },
    ] },
    { name: 'KRISHIL Studio', note: 'Shop social media + WhatsApp', agents: [
      { n: 'Studio Manager', r: 'Takes every upload and routes it to the right system', s: 'live' },
      { n: 'Instagram Poster', r: 'Edits and captions posts for the shop page', s: 'live' },
      { n: 'WhatsApp Updates', r: 'Prepares updates for regular customers, I send in 2 taps', s: 'live' },
      { n: 'Customer Replies', r: 'Answers the shop WhatsApp with xerox rates and pickup times, I approve each reply', s: 'soon' },
    ] },
  ],
};
