export const chatFlowJson = {
  content_creator: {
    greeting: ",what would you like to create today?",
    types: [
      {
        type: "Carousel",
        followup: {
          message: "Awesome! Let’s create a scroll-stopping Carousel. 🎠",
          type: "text"
        }
      },
      {
        type: "Reel",
        followup: {
          message: "Great! Let’s make a Reel that grabs attention right away. 🎬",
          type: "text"
        }
      },
      {
        type: "Email",
        followup: {
          message: "Nice! Let’s craft an Email your audience will want to open. 📧",
          type: "text"
        }
      }
    ]
  }
};
