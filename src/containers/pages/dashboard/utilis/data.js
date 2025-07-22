export const chatFlowJson = {
  content_creator: {
    greeting: "Hi what would you like to create today?",
    types: [
      {
        type: "Carousel",
        followup: {
          message: "Please share the content topic and any key details you'd like us to include for your chosen format  for Carousel",
          type: "text"
        }
      },
      {
        type: "Reel",
        followup: {
          message: "Please share the content topic and any key details you'd like us to include for your chosen format  for Reel",
          type: "text"
        }
      },
      {
        type: "Email",
        followup: {
          message: "Please share the content topic and any key details you'd like us to include for your chosen format  for Email",
          type: "text"
        }
      }
    ]
  }
};
