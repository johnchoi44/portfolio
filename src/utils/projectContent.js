// Upgrade only known legacy copy; preserve newer descriptions from the admin.
const legacyDescriptions = {
  "An AI-powered web app that intelligently tailors your resume to job opportunities using Google Gemini API": "I built a résumé generator that turns a stored work history and requested skills into a tailored Word document, using structured AI output and keyword-based fallback logic.",
  "A full-stack B2B marketplace connecting sellers and buyers with browsing, checkout, seller management, and customer support features.": "A team-built B2B marketplace covering product discovery, checkout, seller management, and customer support in one full-stack application.",
  "Platform for users to generate personalized voice outputs and music covers using advanced AI technologies.": "A web application for voice cloning and AI-generated music covers, bringing personalized audio creation into a browser-based workflow.",
  "Real-time messaging platform which match people based on their MBTI and interests.": "A real-time messaging application that matches people by personality type and shared interests, then gives them a place to connect.",
  "Developed genre-specific book recommendation system using Amazon book reviews.": "A genre-specific recommendation system using Amazon book reviews and Apache Spark to help readers discover relevant books.",
  "Analyzing and predicting crime severity across NYC using ML.": "A machine-learning project combining NYC crime data, visualization, and predictive modeling to investigate patterns in crime severity.",
  "Research project investigating the impact of social/technical changes on organizational behaviors.": "A research project using Twitter data collection and sentiment analysis to explore how social and technical changes relate to workplace behavior.",
  "Analyzed historical customer inquiries to model and develop a customer service chabot.": "I analyzed historical customer inquiries and developed a customer-service chatbot using SQL and the KakaoTalk API to address recurring questions.",
  "Analyzed real-world dataset provided by the AMA to design a platform to match a client to the appropriate attorney.": "A DataFest project analyzing a real-world dataset to inform a platform concept for matching clients with suitable attorneys."
};

export const polishProject = (project) => {
  const result = {
    ...project,
    description: legacyDescriptions[project.description] || project.description,
  };
  if (result.demo) {
    try {
      const url = new URL(result.demo);
      const placeholder = ['example.com', 'example.org', 'example.net'].some(
        domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      );
      if (!['http:', 'https:'].includes(url.protocol) || placeholder) delete result.demo;
    } catch {
      delete result.demo;
    }
  }
  return result;
};
