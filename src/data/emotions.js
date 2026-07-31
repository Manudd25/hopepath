export const emotions = [
  {
    id: 'afraid-future',
    label: "I'm afraid of the future",
    verse: 'Jeremiah 29:11',
    verseText:
      '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
    reflection:
      'You are not failing because your future is unclear. God walks with you one day at a time — not asking you to carry tomorrow today.',
    prayer: 'Lord, guide me one step at a time. When fear rises, remind me that You hold my future gently.',
    smallStep: 'Focus only on today. Write down one thing you can do in the next hour.',
  },
  {
    id: 'lost',
    label: 'I feel lost',
    verse: 'Psalm 23:3',
    verseText: 'He restores my soul. He guides me along the right paths for his name\'s sake.',
    reflection:
      'Feeling lost does not mean you are abandoned. Sometimes the path forward is hidden so we learn to trust the Shepherd, not the map.',
    prayer: 'Jesus, You are the way. When I cannot see the road, walk beside me and let me feel Your presence.',
    smallStep: 'Name one person you could text today — even just to say hello.',
  },
  {
    id: 'overwhelmed',
    label: "I'm overwhelmed",
    verse: 'Matthew 11:28',
    verseText:
      'Come to me, all you who are weary and burdened, and I will give you rest.',
    reflection:
      'Overwhelm is not weakness — it is a signal that you have been carrying too much alone. You are allowed to set something down.',
    prayer: 'Lord, I bring You my heavy load. Teach me what can wait and what truly matters today.',
    smallStep: 'Choose one task and do only that for the next 20 minutes. Everything else can wait.',
  },
  {
    id: 'financial-stress',
    label: "I'm financially stressed",
    verse: 'Philippians 4:19',
    verseText: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',
    reflection:
      'Financial pressure can feel like drowning. God sees your practical needs — and your fear about them — with compassion, not judgment.',
    prayer: 'Provider God, calm my anxious heart. Show me one wise step I can take today and help me trust You with what I cannot control.',
    smallStep: 'List every bill and expense on paper. Clarity often reduces the panic of the unknown.',
  },
  {
    id: 'alone',
    label: 'I feel alone',
    verse: 'Deuteronomy 31:8',
    verseText:
      'The Lord himself goes before you and will be with you; he will never leave you nor forsake you.',
    reflection:
      'Loneliness is real and painful — and it does not mean you are unloved. You are seen, even in the quiet hours when no one else is near.',
    prayer: 'Father, in this loneliness, let me sense Your nearness. Open a door for connection when I am ready.',
    smallStep: 'Step outside for five minutes — sunlight, air, and movement can gently remind you that life continues.',
  },
  {
    id: 'starting-over',
    label: "I'm starting over",
    verse: 'Isaiah 43:19',
    verseText:
      'See, I am doing a new thing! Now it springs up; do you not perceive it?',
    reflection:
      'Starting over is not starting from nothing. You carry wisdom, resilience, and scars that have taught you how to endure.',
    prayer: 'God of new beginnings, give me courage for this fresh chapter. Help me release what I cannot change.',
    smallStep: 'Write one sentence about what you hope this new season could hold — no pressure, just possibility.',
  },
  {
    id: 'need-peace',
    label: 'I need peace',
    verse: 'John 14:27',
    verseText:
      'Peace I leave with you; my peace I give you. I do not give to you as the world gives.',
    reflection:
      'Peace is not the absence of problems — it is the presence of God in the middle of them. You can breathe here.',
    prayer: 'Prince of Peace, quiet the storm inside me. Let Your peace guard my heart and mind today.',
    smallStep: 'Visit the Peace Corner on this site for a 5-minute breathing exercise.',
  },
  {
    id: 'exhausted',
    label: 'I feel emotionally exhausted',
    verse: 'Psalm 62:1',
    verseText: 'Truly my soul finds rest in God; my salvation comes from him.',
    reflection:
      'Emotional exhaustion is your soul asking for rest — not your character failing. You have been strong for a long time.',
    prayer: 'Lord, I am tired in ways words cannot explain. Hold me in this weariness and renew my strength gently.',
    smallStep: 'Give yourself permission to rest for 15 minutes without guilt — no phone, no productivity.',
  },
]

export const emotionPreview = emotions.map(({ id, label }) => ({ id, label }))
