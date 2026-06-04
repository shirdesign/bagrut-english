import type { ReadingPassage, SentenceCompletion } from "@/lib/types";

/**
 * Bagrut-style reading passages with comprehension questions.
 * Each passage uses vocabulary from the Module E word list.
 */
export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "r1",
    title: "The Power of Habit",
    level: 4,
    text: `Many people believe that success comes from talent, but research shows that habits are far more important. A recent study at MIT investigated how the brain creates habits. The findings were surprising: about 40% of our daily actions are habits, not conscious decisions.

Habits develop in three stages. First, there is a cue — something that triggers the behavior. Next comes the routine — the action itself. Finally, there is a reward, which makes the brain remember the cycle. Once this loop is established, it is hard to break.

The good news is that bad habits can be changed. Experts recommend keeping the same cue and reward, but replacing the routine. For example, if stress (the cue) makes you eat sweets (the routine) for comfort (the reward), you can replace eating with a short walk. The walk still provides comfort and breaks the negative cycle.

Successful people understand the power of habits. They do not rely on motivation, which can disappear. Instead, they build small daily routines that lead to big results over time.`,
    questions: [
      {
        q: "According to the study, what percentage of our daily actions are habits?",
        options: ["About 25%", "About 40%", "About 60%", "About 80%"],
        answer: 1,
        explanation: "The text says 'about 40% of our daily actions are habits'.",
      },
      {
        q: "What are the three stages of habit formation?",
        options: [
          "Thinking, acting, remembering",
          "Cue, routine, reward",
          "Plan, do, review",
          "Want, try, succeed",
        ],
        answer: 1,
      },
      {
        q: "What do experts recommend for changing bad habits?",
        options: [
          "Stop the cue completely",
          "Remove the reward",
          "Replace the routine while keeping the cue and reward",
          "Use willpower only",
        ],
        answer: 2,
      },
      {
        q: "What is the main message of the passage?",
        options: [
          "Talent is more important than habits",
          "Motivation is the key to success",
          "Building good habits leads to long-term success",
          "Stress causes most bad habits",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: "r2",
    title: "Cyberbullying: A Modern Challenge",
    level: 4,
    text: `Cyberbullying has become a serious problem in recent years. Unlike traditional bullying, which usually happens at school, cyberbullying can occur anywhere and at any time. A teenager might receive cruel messages on a Saturday night, in their own bedroom, with no escape.

Studies show that cyberbullying can have severe consequences. Victims often experience anxiety, depression, and, in extreme cases, may even consider suicide. The fact that hurtful messages can be shared with thousands of people in seconds makes the problem worse.

Schools and parents are working to address this issue. Many schools have introduced digital citizenship programs, which teach students about respectful online behavior. Parents are encouraged to have open conversations with their children about their online experiences, without judging them.

Experts also stress the importance of bystanders — people who witness cyberbullying. When a bystander defends the victim or reports the bully, the bullying often stops. Therefore, fighting cyberbullying is not just the responsibility of victims and authorities, but of everyone in the digital community.`,
    questions: [
      {
        q: "How is cyberbullying different from traditional bullying?",
        options: [
          "It is less harmful",
          "It can happen anywhere, at any time",
          "It only affects adults",
          "It is easier to stop",
        ],
        answer: 1,
      },
      {
        q: "What is one consequence of cyberbullying mentioned in the text?",
        options: [
          "Better digital skills",
          "Stronger friendships",
          "Anxiety and depression",
          "Higher grades",
        ],
        answer: 2,
      },
      {
        q: "What do digital citizenship programs teach?",
        options: [
          "How to use social media for business",
          "How to code websites",
          "Respectful online behavior",
          "How to hide identity online",
        ],
        answer: 2,
      },
      {
        q: "Who, according to the article, can help stop cyberbullying?",
        options: [
          "Only the victims",
          "Only schools and the police",
          "Only the parents",
          "Everyone, including bystanders",
        ],
        answer: 3,
      },
    ],
  },
  {
    id: "r3",
    title: "Saving Our Oceans",
    level: 5,
    text: `The world's oceans are in serious trouble. Pollution, overfishing, and climate change have caused considerable damage to marine ecosystems. Scientists warn that if current trends continue, many species could disappear within decades.

Plastic pollution is perhaps the most visible threat. Every year, millions of tons of plastic end up in the sea. This waste does not simply disappear — it breaks down into tiny pieces called microplastics, which are eaten by fish and eventually reach our plates. Researchers have found microplastics in human blood, raising serious health concerns.

Overfishing is another significant problem. Modern fishing fleets can catch enormous quantities in a short time, leaving entire populations unable to recover. The disappearance of one species can affect the entire food chain, leading to unexpected consequences.

Yet there are reasons for cautious hope. Marine protected areas — regions where fishing is limited or banned — have proven effective. In some places, fish populations have doubled within a few years. Innovative technologies, such as biodegradable packaging and ocean-cleaning robots, also offer promising solutions. The challenge now is to act quickly, before the damage becomes irreversible.`,
    questions: [
      {
        q: "What does the article identify as the most visible ocean threat?",
        options: ["Climate change", "Overfishing", "Plastic pollution", "Oil spills"],
        answer: 2,
      },
      {
        q: "Why is overfishing considered a serious problem?",
        options: [
          "Fish prices become too high",
          "Fish populations cannot recover, affecting the whole food chain",
          "Fishermen lose their jobs",
          "It pollutes the water",
        ],
        answer: 1,
      },
      {
        q: "What evidence shows that marine protected areas can work?",
        options: [
          "Tourism has increased",
          "Fish populations have doubled in some places",
          "Fishing is now illegal everywhere",
          "Microplastics have disappeared",
        ],
        answer: 1,
      },
      {
        q: "What is the author's overall tone?",
        options: [
          "Completely hopeless",
          "Indifferent",
          "Worried but hopeful",
          "Angry at fishermen",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: "r4",
    title: "The Rise of Remote Work",
    level: 4,
    text: `Until recently, most professional jobs required workers to come to an office every day. But the global pandemic changed everything. Companies were suddenly forced to allow employees to work from home, and many discovered that productivity did not decrease — in fact, it often increased.

Remote work offers significant advantages. Employees save time and money on transportation, and they have more flexibility in balancing work and family life. Companies, in turn, can hire talented people from anywhere in the world, not just from their local region. They can also save on office space.

However, remote work also has disadvantages. Some workers feel isolated and miss the social interactions of the office. New employees, in particular, find it harder to learn the company culture and to build relationships with colleagues. Maintaining a healthy work-life balance can be tricky when your living room becomes your office.

Many experts believe the future is hybrid: a combination of office and home work. This approach gives employees flexibility while still providing some face-to-face interaction. The traditional 9-to-5 office job may soon become a thing of the past.`,
    questions: [
      {
        q: "What did companies discover during the pandemic?",
        options: [
          "Employees were less productive at home",
          "Productivity often increased with remote work",
          "Office work is essential for success",
          "Employees prefer working alone",
        ],
        answer: 1,
      },
      {
        q: "Which is an advantage of remote work for companies?",
        options: [
          "More expensive offices",
          "Hiring globally and saving on office space",
          "Stricter work hours",
          "More face-to-face meetings",
        ],
        answer: 1,
      },
      {
        q: "What is a challenge mentioned for new employees?",
        options: [
          "They earn less money",
          "They can't use computers",
          "They find it harder to learn the company culture",
          "They have to travel more",
        ],
        answer: 2,
      },
      {
        q: "What does the author suggest about the future of work?",
        options: [
          "Everyone will return to the office",
          "All work will be from home",
          "A hybrid approach is most likely",
          "Robots will replace workers",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: "r5",
    title: "The Surprising Science of Sleep",
    level: 5,
    text: `For many years, scientists viewed sleep as a passive activity — a time when the body and brain shut down. But recent research has revealed that sleep is one of the most active and essential periods of our lives.

During sleep, the brain consolidates memories from the day, processing what we have learned and storing it for future use. This is why students who get enough sleep before an exam tend to perform better than those who stay up late studying. Sleep also enables the brain to clear out toxic substances that accumulate during the day. A lack of sleep, therefore, can have serious consequences for both memory and mental health.

The body benefits from sleep as well. Hormones released during deep sleep support physical growth in children and tissue repair in adults. The immune system becomes stronger, helping us fight infections. People who consistently sleep less than six hours per night are more likely to develop serious illnesses, including heart disease and diabetes.

Despite this knowledge, modern life often interferes with healthy sleep. Bright screens, late-night work, and stress all reduce sleep quality. Experts recommend setting a regular sleep schedule, avoiding screens before bed, and creating a quiet, dark environment. Investing in better sleep is, essentially, investing in better health.`,
    questions: [
      {
        q: "Why did scientists once think sleep was unimportant?",
        options: [
          "They believed it was a passive activity",
          "They had no equipment to study it",
          "They thought only children needed sleep",
          "They thought it caused illness",
        ],
        answer: 0,
      },
      {
        q: "Why might students who sleep well do better on exams?",
        options: [
          "They have more time to study",
          "Their brains consolidate memories during sleep",
          "Sleep makes them feel happy",
          "They wake up with new ideas",
        ],
        answer: 1,
      },
      {
        q: "What physical benefit of sleep is mentioned?",
        options: [
          "Faster running speed",
          "Better eyesight",
          "A stronger immune system",
          "Lower blood pressure only",
        ],
        answer: 2,
      },
      {
        q: "What is one expert recommendation for better sleep?",
        options: [
          "Drink coffee before bed",
          "Sleep with the lights on",
          "Avoid screens before bed",
          "Sleep at different times each day",
        ],
        answer: 2,
      },
    ],
  },
  {
    id: "r-uni-1",
    title: "How to Read an Academic Article (אנסין)",
    level: 6,
    text: `University students read many academic articles, and at first this can feel difficult. However, there is a method that makes the process much easier. The key idea is that you do not have to read every word from start to finish.

A good first step is to read the abstract. The abstract is a short summary at the beginning of the article. It tells you the main question of the research, the method the writers used, and the most important results. After the abstract, look at the headings and any charts. This gives you a general approach to the text before you read the details.

The next step is to find the writer's main argument. Academic writers usually state their main point clearly, often at the end of the introduction. When you know the argument, the rest of the article is easier to follow, because every paragraph adds evidence to support that point.

Finally, do not assume that you must agree with everything. Good readers ask questions: Is the evidence strong? Could there be another explanation? This kind of careful, active reading is a significant part of success at university, and it develops with practice.`,
    questions: [
      {
        q: "According to the passage, what should you read first?",
        options: ["The conclusion", "The abstract", "The charts", "The references"],
        answer: 1,
        explanation: "The text says 'A good first step is to read the abstract.'",
      },
      {
        q: "Where do academic writers usually state their main argument?",
        options: [
          "In the title",
          "At the end of the introduction",
          "In the abstract only",
          "In the last sentence of the article",
        ],
        answer: 1,
      },
      {
        q: "What does the writer mean by 'active reading'?",
        options: [
          "Reading every word from start to finish",
          "Reading quickly without stopping",
          "Asking questions about the evidence",
          "Reading out loud",
        ],
        answer: 2,
        explanation: "Active reading means asking questions, e.g. 'Is the evidence strong?'",
      },
      {
        q: "What is the main purpose of the passage?",
        options: [
          "To explain a useful method for reading academic articles",
          "To describe how articles are written",
          "To compare universities",
          "To argue that reading is not important",
        ],
        answer: 0,
      },
    ],
  },
];

export const SENTENCE_COMPLETIONS: SentenceCompletion[] = [
  {
    id: "s1",
    sentence: "The teacher gave us useful __ on our essays.",
    answer: "feedback",
    distractors: ["furniture", "feature", "freedom"],
    hint: "משוב",
    minLevel: 4,
  },
  {
    id: "s2",
    sentence: "Air pollution is a major __ in big cities.",
    answer: "problem",
    distractors: ["solution", "habit", "vacation"],
    hint: "בעיה",
    minLevel: 3,
  },
  {
    id: "s3",
    sentence: "We need to __ paper to protect the environment.",
    answer: "recycle",
    distractors: ["destroy", "burn", "throw"],
    hint: "למחזר",
    minLevel: 4,
  },
  {
    id: "s4",
    sentence: "Despite the rain, we had an __ day at the beach.",
    answer: "enjoyable",
    distractors: ["unfortunate", "unhealthy", "unknown"],
    hint: "מהנה",
    minLevel: 4,
  },
  {
    id: "s5",
    sentence: "The doctor will __ a new treatment for the disease.",
    answer: "recommend",
    distractors: ["regret", "remove", "respect"],
    hint: "להמליץ",
    minLevel: 4,
  },
  {
    id: "s6",
    sentence: "It is __ that he will arrive on time.",
    answer: "likely",
    distractors: ["loudly", "lonely", "lovely"],
    hint: "סביר",
    minLevel: 4,
  },
  {
    id: "s7",
    sentence: "She gave a __ performance at the concert.",
    answer: "spectacular",
    distractors: ["spectacles", "spectator", "specific"],
    hint: "מרהיבה",
    minLevel: 5,
  },
  {
    id: "s8",
    sentence: "The witness gave __ evidence to the police.",
    answer: "reliable",
    distractors: ["readable", "remarkable", "removable"],
    hint: "אמין",
    minLevel: 4,
  },
  {
    id: "s9",
    sentence: "The scientists made an important __ about the virus.",
    answer: "discovery",
    distractors: ["delivery", "defeat", "destruction"],
    hint: "תגלית",
    minLevel: 4,
  },
  {
    id: "s10",
    sentence: "He couldn't __ the heavy box by himself.",
    answer: "lift",
    distractors: ["live", "left", "list"],
    hint: "להרים",
    minLevel: 3,
  },
  {
    id: "s11",
    sentence: "The students __ in a debate about climate change.",
    answer: "participated",
    distractors: ["prevented", "produced", "protested"],
    hint: "השתתפו",
    minLevel: 4,
  },
  {
    id: "s12",
    sentence: "Honesty is an important __ for any leader.",
    answer: "characteristic",
    distractors: ["calendar", "chance", "challenge"],
    hint: "תכונה",
    minLevel: 4,
  },
  {
    id: "s13",
    sentence: "The factory will __ 1,000 cars per month.",
    answer: "produce",
    distractors: ["promote", "protect", "prevent"],
    hint: "לייצר",
    minLevel: 4,
  },
  {
    id: "s14",
    sentence: "We must __ from our mistakes if we want to grow.",
    answer: "learn",
    distractors: ["leave", "lend", "lift"],
    hint: "ללמוד",
    minLevel: 3,
  },
  {
    id: "s15",
    sentence: "The hotel offers excellent __ to all its guests.",
    answer: "service",
    distractors: ["surface", "secret", "section"],
    hint: "שירות",
    minLevel: 3,
  },
  {
    id: "s16",
    sentence: "She has an __ talent for music.",
    answer: "extraordinary",
    distractors: ["expensive", "explosive", "extensive"],
    hint: "יוצא דופן",
    minLevel: 5,
  },
  {
    id: "s17",
    sentence: "I __ apologize for being late.",
    answer: "sincerely",
    distractors: ["silently", "simply", "slightly"],
    hint: "בכנות",
    minLevel: 5,
  },
  {
    id: "s18",
    sentence: "The new law will __ the working conditions.",
    answer: "improve",
    distractors: ["impress", "import", "increase"],
    hint: "לשפר",
    minLevel: 4,
  },
  {
    id: "s19",
    sentence: "His __ to the project was very important.",
    answer: "contribution",
    distractors: ["confusion", "connection", "construction"],
    hint: "תרומה",
    minLevel: 5,
  },
  {
    id: "s20",
    sentence: "We had a heated __ about politics.",
    answer: "discussion",
    distractors: ["distance", "discovery", "decision"],
    hint: "דיון",
    minLevel: 4,
  },

  // ===== אוניברסיטה — אנגלית בסיסי אקדמית (minLevel 6), מילים מרשימת המבחן =====
  {
    id: "u-s1",
    sentence: "Regular exercise can __ many diseases.",
    answer: "prevent",
    distractors: ["provide", "prefer", "improve"],
    hint: "למנוע",
    minLevel: 6,
  },
  {
    id: "u-s2",
    sentence: "We must protect the __ for future generations.",
    answer: "environment",
    distractors: ["emergency", "experience", "education"],
    hint: "סביבה",
    minLevel: 6,
  },
  {
    id: "u-s3",
    sentence: "She practices every day to __ her English.",
    answer: "improve",
    distractors: ["prevent", "provide", "prefer"],
    hint: "לשפר",
    minLevel: 6,
  },
  {
    id: "u-s4",
    sentence: "After many tries, he __ succeeded.",
    answer: "eventually",
    distractors: ["recently", "obviously", "unfortunately"],
    hint: "בסופו של דבר",
    minLevel: 6,
  },
  {
    id: "u-s5",
    sentence: "The school will __ free books to all students.",
    answer: "provide",
    distractors: ["prevent", "prefer", "improve"],
    hint: "לספק",
    minLevel: 6,
  },
  {
    id: "u-s6",
    sentence: "You must __ which university to attend.",
    answer: "decide",
    distractors: ["notify", "supervise", "calculate"],
    hint: "להחליט",
    minLevel: 6,
  },
];
