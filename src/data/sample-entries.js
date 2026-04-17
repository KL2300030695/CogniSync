/**
 * Sample journal entries for demo/showcase purposes
 */

const now = new Date();
const daysAgo = (n) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  d.setHours(10 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60));
  return d.toISOString();
};

export const SAMPLE_ENTRIES = [
  {
    id: 'demo_1',
    timestamp: daysAgo(13),
    messages: [
      { role: 'maya', text: "Good morning! How are you feeling today? ☀️" },
      { role: 'patient', text: "I had a nice breakfast. Margaret made pancakes. She always makes them so well." },
      { role: 'maya', text: "How lovely! Margaret sounds like a wonderful cook. What kind of pancakes did she make? 🌸" },
      { role: 'patient', text: "Blueberry ones. They remind me of when the children were little. We used to pick berries together in the summer." },
      { role: 'maya', text: "What a beautiful memory! Picking berries with the children sounds so special. Where did you used to go berry picking?" },
      { role: 'patient', text: "There was a farm, I think near the lake. The kids would eat more than they put in the basket!" },
    ],
    sentiment: { score: 0.82, emotion: 'happy', keywords: ['Margaret', 'pancakes', 'blueberry', 'children', 'berries', 'lake', 'farm'], clarity: 78, concerns: [], summary: 'Patient recalled happy family memories with clarity.' },
  },
  {
    id: 'demo_2',
    timestamp: daysAgo(11),
    messages: [
      { role: 'maya', text: "Hello! It's so nice to talk with you again. What's been on your mind today? 💛" },
      { role: 'patient', text: "I was looking at photos. There's one of my wedding day. I looked so young." },
      { role: 'maya', text: "How wonderful! Your wedding day must have been such a special occasion. Can you tell me what you remember about it?" },
      { role: 'patient', text: "It was June. Hot day. My dress had these tiny pearls. Robert looked so handsome in his suit. My mother was crying in the front row." },
      { role: 'maya', text: "That's such a vivid and beautiful memory! Tiny pearls on the dress and Robert in his suit — how romantic. What was the music like? 🎵" },
      { role: 'patient', text: "We had a band. They played our song... I can't remember the name now. But it was lovely." },
    ],
    sentiment: { score: 0.75, emotion: 'nostalgic', keywords: ['wedding', 'photos', 'Robert', 'dress', 'pearls', 'mother', 'band', 'June'], clarity: 82, concerns: [], summary: 'Patient recalled vivid wedding day details with strong emotional connection.' },
  },
  {
    id: 'demo_3',
    timestamp: daysAgo(9),
    messages: [
      { role: 'maya', text: "Good afternoon! How has your day been so far? 🌸" },
      { role: 'patient', text: "A bit tired today. I didn't sleep well. Had strange dreams." },
      { role: 'maya', text: "I'm sorry to hear that. Strange dreams can be unsettling. Would you like to tell me about them, or shall we talk about something nice instead?" },
      { role: 'patient', text: "Let's talk about something nice. I miss my garden. I used to grow roses." },
      { role: 'maya', text: "Oh, roses are beautiful! What colors were your roses? I bet your garden was gorgeous! 🌹" },
      { role: 'patient', text: "Red ones and yellow ones. The yellow ones smelled the best. I won a prize once at the fair." },
    ],
    sentiment: { score: 0.58, emotion: 'nostalgic', keywords: ['tired', 'dreams', 'garden', 'roses', 'red', 'yellow', 'prize', 'fair'], clarity: 72, concerns: [], summary: 'Patient was tired but brightened when discussing beloved garden memories.' },
  },
  {
    id: 'demo_4',
    timestamp: daysAgo(7),
    messages: [
      { role: 'maya', text: "Hello! Lovely to see you. What would you like to talk about today? ☀️" },
      { role: 'patient', text: "I'm not sure. Things feel fuzzy today. I couldn't find my glasses this morning." },
      { role: 'maya', text: "That's perfectly okay — we all have days like that. No rush at all. Did you find your glasses eventually?" },
      { role: 'patient', text: "Margaret found them. They were on my head!" },
      { role: 'maya', text: "Ha! That happens to the best of us! Margaret seems like a great helper. What else have you two been up to?" },
      { role: 'patient', text: "She took me to the park. The birds were singing. It was peaceful." },
    ],
    sentiment: { score: 0.62, emotion: 'calm', keywords: ['fuzzy', 'glasses', 'Margaret', 'park', 'birds', 'peaceful'], clarity: 65, concerns: [], summary: 'Patient had some confusion but found peace during a park visit.' },
  },
  {
    id: 'demo_5',
    timestamp: daysAgo(5),
    messages: [
      { role: 'maya', text: "Good morning! What a beautiful day. Anything special happening? 💛" },
      { role: 'patient', text: "My granddaughter Sarah visited yesterday! She brought me cookies she baked herself." },
      { role: 'maya', text: "That's wonderful! Sarah sounds like such a sweet granddaughter. What kind of cookies did she bake? 🍪" },
      { role: 'patient', text: "Chocolate chip. They were a bit burnt on the bottom but I told her they were perfect. She's only eight." },
      { role: 'maya', text: "Oh, that is so adorable! What a kind thing to say. I bet Sarah was so proud. What else did you do together?" },
      { role: 'patient', text: "We drew pictures. She drew me with a big crown. She said I'm her queen." },
    ],
    sentiment: { score: 0.92, emotion: 'happy', keywords: ['Sarah', 'granddaughter', 'cookies', 'chocolate chip', 'drew pictures', 'crown', 'queen'], clarity: 85, concerns: [], summary: 'Patient was joyful discussing visit from granddaughter Sarah.' },
  },
  {
    id: 'demo_6',
    timestamp: daysAgo(3),
    messages: [
      { role: 'maya', text: "Hello! How are you today? I hope you've had a good morning. 🌸" },
      { role: 'patient', text: "I feel a bit confused today. I thought it was Monday but Margaret says it's Wednesday." },
      { role: 'maya', text: "That's completely okay — the days can blur together sometimes. The important thing is that today is yours to enjoy. What sounds nice right now?" },
      { role: 'patient', text: "Maybe some music. I like the old songs. Frank Sinatra." },
      { role: 'maya', text: "Frank Sinatra — what wonderful taste! 'Fly Me to the Moon' is such a classic. Do you have a favorite Sinatra song? 🎵" },
      { role: 'patient', text: "My Way. Robert and I used to dance to it in the kitchen. He would spin me around." },
    ],
    sentiment: { score: 0.55, emotion: 'nostalgic', keywords: ['confused', 'Monday', 'Wednesday', 'music', 'Frank Sinatra', 'Robert', 'dancing', 'kitchen'], clarity: 60, concerns: ['Temporal disorientation mentioned'], summary: 'Patient showed mild temporal confusion but found comfort in music memories.' },
  },
  {
    id: 'demo_7',
    timestamp: daysAgo(1),
    messages: [
      { role: 'maya', text: "Good afternoon! It's so nice to chat with you again. How are things today? ☀️" },
      { role: 'patient', text: "Good day today. Had tea with Margaret and we watched the birds outside." },
      { role: 'maya', text: "How peaceful! Watching birds with a cup of tea sounds absolutely lovely. What kind of birds did you see?" },
      { role: 'patient', text: "Little ones. Sparrows I think. And a robin with a red breast. They were splashing in the birdbath." },
      { role: 'maya', text: "What a delightful scene! I can picture the robin splashing away. Do you enjoy birdwatching often?" },
      { role: 'patient', text: "Robert used to know all the birds. He had a book about them. Maybe I'll look at it tomorrow." },
    ],
    sentiment: { score: 0.72, emotion: 'content', keywords: ['tea', 'Margaret', 'birds', 'sparrows', 'robin', 'birdbath', 'Robert', 'book'], clarity: 76, concerns: [], summary: 'Patient had a content day observing nature and recalling shared hobby with Robert.' },
  },
];

/**
 * Load sample entries into localStorage if empty
 */
export function loadSampleData() {
  const existing = localStorage.getItem('cognisync_journal_entries');
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem('cognisync_journal_entries', JSON.stringify(SAMPLE_ENTRIES));
    return true;
  }
  return false;
}

export function hasSampleData() {
  try {
    const entries = JSON.parse(localStorage.getItem('cognisync_journal_entries') || '[]');
    return entries.some(e => e.id?.startsWith('demo_'));
  } catch {
    return false;
  }
}
