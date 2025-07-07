export const chatFlowJson = {
  "content_creator": {
    "greeting": "👋 Hi what would you like to create today?",
    "types": [
      {
        "type": "Carousel",
        "options": [
          {
            "goal": "Awareness",
            "question": "What is your goal?",
            "followups": [
              {
                "question": "What’s the next step you want the person seeing your content to take?",
                "type": "select",
                "options": ["Follow you", "Comment a keyword", "DM you a message", "Join your email list", "Save the post", "Something else"]
              },
              {
                "question": "Any story or trend this can tie to?",
                "type": "text",
              }
            ],
          },
          {
            "goal": "Nurture",
            "question": "What is your goal?",
            "followups": [
              {
                "question": "What’s the next step for your audience after reading this?",
                "type": "select",
                "options": ["Comment a keyword", "Download a freebie", "Join your waitlist", "DM for more info"]
              },
              {
                "question": "Are you referencing a freebie here?",
                "type": "select",
                "options": ["Yes", "No"],
              },
              {
                "question": "Would you like to use a personal story or client experience to guide this?",
                "type": "text"
              }
            ],
          },
          {
            "goal": "Sale",
            "question": "What is your goal?",
            "followups": [
              {
                "question": "What are you selling? e.g., baby products ",
                "type": "select",
                "options": ["Baby products", "Digital marketing services", "Online course", "Coaching program", "Something else"],
                'isLast': false
              },
              {
                "question": "What kind of transformation does this offer promise?",
                "type": "select",
                "options": ["More time with family", "Less stress", "More sales", "Better health", "Something else"],
                'isLast': false
              },
              {
                "question": "Do you want to highlight social proof?",
                "type": "select",
                "options": ["Yes", "No"],
                'isLast': false
              },
              {
                "question": "Sent a Message ",
                "type": "text",
                'isLast': true
              },
            ],
          }
        ]
      },
      {
        "type": "Reel",
        "options": [
          {
            "goal": "Awareness",
            "question": "What is your goal?", // added
            "followups": [
              {
                "question": "Is this a talking video, b-roll with voiceover, or trending sound?",
                "type": "select",
                "options": ["Talking", "B-Roll", "Trending Sound", "Not sure yet"]
              },
              {
                "question": "What’s your hook or opening line?",
                "type": "text"
              },
            ],
          },
          {
            "goal": "Engagement",
            "question": "What is your goal?", // added
            "followups": [
              {
                "question": "Is this a talking video, b-roll with voiceover, or trending sound?",
                "type": "select",
                "options": ["Talking", "B-Roll", "Trending Sound", "Not sure yet"]
              },
              {
                "question": "What’s your hook or opening line?",
                "type": "text"
              },
            ],
          },
          {
            "goal": "Sales",
            "question": "What is your goal?", // added
            "followups": [
              {
                "question": "Is this a talking video, b-roll with voiceover, or trending sound?",
                "type": "select",
                "options": ["Talking", "B-Roll", "Trending Sound", "Not sure yet"]
              },
              {
                "question": "What’s your hook or opening line?",
                "type": "text"
              },
            ],
          }

        ]
      },
      {
        "type": "Email",
        "options": [
          {
            "goal": "Nurture",
            "question": "What is your goal?", // added
            "followups": [
              {
                "question": "Let’s narrow it down. What are you writing about?",
                "type": "select",
                "options": [
                  "A new offer or launch",
                  "A client win or testimonial",
                  "A personal story",
                  "A lesson or insight",
                  "Addressing objections",
                  "Teasing something coming soon",
                  "Delivering a freebie",
                  "Recapping a popular post",
                  "Driving to book a discovery call"
                ]
              },
              {
                "question": "What do you want them to do after reading?",
                "type": "select",
                "options": ["Click a link", "Hit reply", "DM you a keyword", "Book a call", "Share the email", "Download something"]
              },
              {
                "question": "What’s the tone?",
                "type": "select",
                "options": ["Honest and direct", "Warm and story-driven", "Punchy and persuasive", "Educational"]
              },
            ]
          },
          {
            "goal": "Launch / Sales",
            "question": "What is your goal?", // added
            "followups": [
              {
                "question": "Let’s narrow it down. What are you writing about?",
                "type": "select",
                "options": [
                  "A new offer or launch",
                  "A client win or testimonial",
                  "A personal story",
                  "A lesson or insight",
                  "Addressing objections",
                  "Teasing something coming soon",
                  "Delivering a freebie",
                  "Recapping a popular post",
                  "Driving to book a discovery call"
                ]
              },
              {
                "question": "What do you want them to do after reading?",
                "type": "select",
                "options": ["Click a link", "Hit reply", "DM you a keyword", "Book a call", "Share the email", "Download something"]
              },
              {
                "question": "What’s the tone?",
                "type": "select",
                "options": ["Honest and direct", "Warm and story-driven", "Punchy and persuasive", "Educational"]
              },
            ]
          },
          {
            "goal": " Freebie follow-up / Delivery",
            "question": "What is your goal?", // added
            "followups": [
              {
                "question": "Let’s narrow it down. What are you writing about?",
                "type": "select",
                "options": [
                  "A new offer or launch",
                  "A client win or testimonial",
                  "A personal story",
                  "A lesson or insight",
                  "Addressing objections",
                  "Teasing something coming soon",
                  "Delivering a freebie",
                  "Recapping a popular post",
                  "Driving to book a discovery call"
                ]
              },
              {
                "question": "What do you want them to do after reading?",
                "type": "select",
                "options": ["Click a link", "Hit reply", "DM you a keyword", "Book a call", "Share the email", "Download something"]
              },
              {
                "question": "What’s the tone?",
                "type": "select",
                "options": ["Honest and direct", "Warm and story-driven", "Punchy and persuasive", "Educational"]
              },
            ]
          },
          {
            "goal": "Re-engagement",
            "question": "What is your goal?", // added
            "followups": [
              {
                "question": "Let’s narrow it down. What are you writing about?",
                "type": "select",
                "options": [
                  "A new offer or launch",
                  "A client win or testimonial",
                  "A personal story",
                  "A lesson or insight",
                  "Addressing objections",
                  "Teasing something coming soon",
                  "Delivering a freebie",
                  "Recapping a popular post",
                  "Driving to book a discovery call"
                ]
              },
              {
                "question": "What do you want them to do after reading?",
                "type": "select",
                "options": ["Click a link", "Hit reply", "DM you a keyword", "Book a call", "Share the email", "Download something"]
              },
              {
                "question": "What’s the tone?",
                "type": "select",
                "options": ["Honest and direct", "Warm and story-driven", "Punchy and persuasive", "Educational"]
              },
            ]
          },
          {
            "goal": "Welcome / Intro",
            "question": "What is your goal?", // added
            "followups": [
              {
                "question": "Let’s narrow it down. What are you writing about?",
                "type": "select",
                "options": [
                  "A new offer or launch",
                  "A client win or testimonial",
                  "A personal story",
                  "A lesson or insight",
                  "Addressing objections",
                  "Teasing something coming soon",
                  "Delivering a freebie",
                  "Recapping a popular post",
                  "Driving to book a discovery call"
                ]
              },
              {
                "question": "What do you want them to do after reading?",
                "type": "select",
                "options": ["Click a link", "Hit reply", "DM you a keyword", "Book a call", "Share the email", "Download something"]
              },
              {
                "question": "What’s the tone?",
                "type": "select",
                "options": ["Honest and direct", "Warm and story-driven", "Punchy and persuasive", "Educational"]
              },
            ]
          },
          {
            "goal": "Something else",
            "question": "What is your goal?", // added
            "followups": [
              {
                "question": "Let’s narrow it down. What are you writing about?",
                "type": "select",
                "options": [
                  "A new offer or launch",
                  "A client win or testimonial",
                  "A personal story",
                  "A lesson or insight",
                  "Addressing objections",
                  "Teasing something coming soon",
                  "Delivering a freebie",
                  "Recapping a popular post",
                  "Driving to book a discovery call"
                ]
              },
              {
                "question": "What do you want them to do after reading?",
                "type": "select",
                "options": ["Click a link", "Hit reply", "DM you a keyword", "Book a call", "Share the email", "Download something"]
              },
              {
                "question": "What’s the tone?",
                "type": "select",
                "options": ["Honest and direct", "Warm and story-driven", "Punchy and persuasive", "Educational"]
              },
            ]
          }
        ]
      }
    ]
  }
};
