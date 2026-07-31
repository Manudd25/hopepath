export const dailyPrayers = [
  {
    verse: 'Lamentations 3:22-23',
    verseText:
      'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning.',
    reflection:
      'Whatever yesterday held — mistakes, grief, exhaustion — this morning is a fresh canvas of mercy. You do not have to earn today\'s compassion.',
    prayer:
      'Gracious God, thank You that Your mercies are new this morning. Meet me where I am, not where I think I should be. Give me enough grace for today only. Amen.',
  },
  {
    verse: 'Psalm 46:10',
    verseText: 'Be still, and know that I am God.',
    reflection:
      'Stillness is not laziness. In a world that demands constant motion, pausing to remember God\'s sovereignty is an act of faith.',
    prayer:
      'Lord, in the noise of my worries, help me be still. Remind me that You are God — and I am held. Amen.',
  },
  {
    verse: 'Romans 8:28',
    verseText:
      'And we know that in all things God works for the good of those who love him.',
    reflection:
      'This does not mean everything feels good. It means nothing is wasted in God\'s hands — even the seasons that break our hearts.',
    prayer:
      'Father, I cannot see how this pain could become good. But I trust that You can. Hold what I cannot understand. Amen.',
  },
  {
    verse: '2 Corinthians 12:9',
    verseText: 'My grace is sufficient for you, for my power is made perfect in weakness.',
    reflection:
      'Your weakness is not a disqualification from God\'s love. It may be exactly where His strength shows up most clearly.',
    prayer:
      'Jesus, in my weakness, be strong. I release the need to appear capable and receive Your sufficient grace. Amen.',
  },
  {
    verse: 'Psalm 34:18',
    verseText: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
    reflection:
      'God does not stand at a distance from your pain. He draws near to the brokenhearted — including you, right now.',
    prayer:
      'God who draws near, I am brokenhearted today. Stay close. Let me feel that I am not alone in this. Amen.',
  },
  {
    verse: 'Isaiah 41:10',
    verseText:
      'Do not fear, for I am with you; do not be dismayed, for I am your God.',
    reflection:
      'Fear and dismay are human responses to uncertainty. God\'s answer is not a lecture — it is His presence: "I am with you."',
    prayer:
      'Lord, when fear rises, remind me You are with me. Strengthen me and uphold me with Your righteous hand. Amen.',
  },
  {
    verse: 'Matthew 6:34',
    verseText:
      'Therefore do not worry about tomorrow, for tomorrow will worry about itself.',
    reflection:
      'Tomorrow has enough weight of its own. Today asks only for today\'s portion of faith, courage, and grace.',
    prayer:
      'Father, free me from borrowing trouble from tomorrow. Help me live fully in this one day You have given me. Amen.',
  },
]

export const dailySteps = [
  {
    spiritual: 'Read one Psalm — try Psalm 23 or Psalm 121',
    emotional: 'Take a 10-minute walk without your phone',
    practical: 'Send one job application or reach out to one contact',
  },
  {
    spiritual: 'Pray for 2 minutes — simply tell God how you feel',
    emotional: 'Write down three things you are grateful for today',
    practical: 'Organize one small area of your space',
  },
  {
    spiritual: 'Read Matthew 11:28-30 slowly, twice',
    emotional: 'Drink a full glass of water and stretch for 5 minutes',
    practical: 'Reply to one email you have been avoiding',
  },
  {
    spiritual: 'Memorize one short verse: "The Lord is my shepherd"',
    emotional: 'Rest for 15 minutes without guilt',
    practical: 'Make a simple list of tomorrow\'s top three priorities',
  },
  {
    spiritual: 'Listen to one worship song that brings you peace',
    emotional: 'Call or message one person who cares about you',
    practical: 'Review your budget or write one financial worry on paper',
  },
  {
    spiritual: 'Sit in silence for 3 minutes and breathe',
    emotional: 'Journal one fear and one hope',
    practical: 'Apply to one opportunity — job, course, or volunteer role',
  },
  {
    spiritual: 'Thank God for one specific blessing from this week',
    emotional: 'Do a 5-minute breathing exercise in Peace Corner',
    practical: 'Complete one small task you have been putting off',
  },
]

export function getDayIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const diff = Date.now() - start
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getTodaysPrayer() {
  return dailyPrayers[getDayIndex() % dailyPrayers.length]
}

export function getTodaysSteps() {
  return dailySteps[getDayIndex() % dailySteps.length]
}
