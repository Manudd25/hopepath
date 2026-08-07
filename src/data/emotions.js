export const emotions = [
  {
    id: 'afraid-future',
    label: "I'm afraid of the future",
    stepCategory: 'emotional',
    verse: 'Jeremiah 29:11',
    verseText:
      '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
    reflection:
      "Not knowing what comes next doesn't mean you've failed. You don't need to solve the whole future today — only to show up for this moment.",
    prayer:
      'Lord, guide me one step at a time. When fear rises, remind me that You hold my future gently.',
    smallStep: 'Focus only on today. Write down one thing you can do in the next hour.',
  },
  {
    id: 'lost',
    label: 'I feel lost',
    stepCategory: 'emotional',
    verse: 'Psalm 23:3',
    verseText:
      "He restores my soul. He guides me along the right paths for his name's sake.",
    reflection:
      "Feeling lost doesn't mean you have failed. Sometimes you don't need to see the entire path ahead — only the next small step.",
    prayer:
      'Jesus, You are the way. When I cannot see the road, walk beside me and let me feel Your presence.',
    smallStep: 'Name one person you could text today — even just to say hello.',
  },
  {
    id: 'overwhelmed',
    label: "I'm overwhelmed",
    stepCategory: 'emotional',
    verse: 'Matthew 11:28',
    verseText:
      'Come to me, all you who are weary and burdened, and I will give you rest.',
    reflection:
      'Overwhelm is not weakness — it is a signal that you have been carrying too much. You are allowed to set something down.',
    prayer:
      'Lord, I bring You my heavy load. Teach me what can wait and what truly matters today.',
    smallStep:
      'Choose one task and do only that for the next 20 minutes. Everything else can wait.',
  },
  {
    id: 'financial-stress',
    label: "I'm financially stressed",
    stepCategory: 'practical',
    verse: 'Philippians 4:19',
    verseText:
      'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',
    reflection:
      "Financial pressure can feel heavy and frightening. You are allowed to feel that weight — and you don't have to carry every worry at once.",
    prayer:
      'Provider God, calm my anxious heart. Show me one wise step I can take today and help me trust You with what I cannot control.',
    smallStep:
      'List every bill and expense on paper. Clarity often reduces the panic of the unknown.',
  },
  {
    id: 'alone',
    label: 'I feel alone',
    stepCategory: 'emotional',
    verse: 'Deuteronomy 31:8',
    verseText:
      'The Lord himself goes before you and will be with you; he will never leave you nor forsake you.',
    reflection:
      'Loneliness is real and painful. It does not mean you are unloved or unseen — even in quiet hours when no one else is near.',
    prayer:
      'Father, in this loneliness, let me sense Your nearness. Open a door for connection when I am ready.',
    smallStep:
      'Step outside for five minutes — sunlight, air, and movement can gently remind you that life continues.',
  },
  {
    id: 'starting-over',
    label: "I'm starting over",
    stepCategory: 'emotional',
    verse: 'Isaiah 43:19',
    verseText:
      'See, I am doing a new thing! Now it springs up; do you not perceive it?',
    reflection:
      'Starting over is not starting from nothing. You carry wisdom, resilience, and everything you have lived through so far.',
    prayer:
      'God of new beginnings, give me courage for this fresh chapter. Help me release what I cannot change.',
    smallStep:
      'Write one sentence about what you hope this new season could hold — no pressure, just possibility.',
  },
  {
    id: 'need-peace',
    label: 'I need peace',
    stepCategory: 'emotional',
    verse: 'John 14:27',
    verseText:
      'Peace I leave with you; my peace I give you. I do not give to you as the world gives.',
    reflection:
      'Peace is not the absence of every problem. It can begin with one slow breath, one quiet moment, one gentle pause.',
    prayer:
      'Prince of Peace, quiet the storm inside me. Let Your peace guard my heart and mind today.',
    smallStep: 'Visit the Peace Corner on this site for a 5-minute breathing exercise.',
  },
  {
    id: 'exhausted',
    label: 'I feel emotionally exhausted',
    stepCategory: 'emotional',
    verse: 'Psalm 62:1',
    verseText: 'Truly my soul finds rest in God; my salvation comes from him.',
    reflection:
      'Emotional exhaustion is your body and heart asking for rest — not your character failing. You have been strong for a long time.',
    prayer:
      'Lord, I am tired in ways words cannot explain. Hold me in this weariness and renew my strength gently.',
    smallStep:
      'Give yourself permission to rest for 15 minutes without guilt — no phone, no productivity.',
  },
]

export const emotionPreview = emotions.map(({ id, label }) => ({ id, label }))

export function getFeelingStepId(emotionId) {
  return `feeling-${emotionId}`
}
