/**
 * All fixed website text (English). Tamil lives in ./ta.ts and must have the
 * same shape. Text the owner edits in /admin (hero, programmes, FAQ, branch
 * details …) is stored in the database instead.
 */
export const en = {
  localeName: "English",
  switchTo: { label: "தமிழ்", aria: "Read this page in Tamil" },

  nav: {
    items: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About Us" },
      { href: "/nursery", label: "Early Years" },
      { href: "/classes", label: "Study Point Classes" },
      { href: "/gallery", label: "Gallery" },
      { href: "/contact", label: "Contact" },
    ],
    enquire: "Enquire Now",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    main: "Main",
    mobile: "Mobile",
    skip: "Skip to content",
    homeLink: "Study Point — home",
  },

  brand: { tagline: "We make great learners" },
  topbar: { aria: "Quick contact", tagline: "Kindergarten & English Classes", whatsapp: "WhatsApp us" },
  announcements: { aria: "Announcements" },

  hero: {
    exploreEarly: "Explore Early Years (3 – 5 Years)",
    discoverClasses: "Discover Study Point Classes",
    badge: ["Happy", "Learners", "Brighter", "Tomorrows"],
    imageAlt: "Smiling Study Point children learning together",
  },

  features: {
    aria: "Highlights",
    items: [
      { title: "Quality Education", text: "Strong foundation for life" },
      { title: "Caring Environment", text: "Safe, supportive and friendly" },
      { title: "Experienced Teachers", text: "Guiding every step" },
      { title: "Holistic Development", text: "Learn • Play • Grow" },
    ],
  },

  cards: {
    aria: "Our programs",
    nursery: {
      eyebrow: "Kindergarten / Early Years",
      title: "A Happy Place to Learn & Grow",
      age: "Ages 3 – 5 Years",
      text: "Through play, creativity and guided learning, we help children build confidence, curiosity and essential skills for a bright future.",
      learnMore: "Learn More",
      about: " about our Early Years programme",
      imageAlt: "A Study Point kindergarten child at play",
    },
    classes: {
      eyebrow: "Study Point Classes",
      title: "Learn Today. Lead Tomorrow.",
      tagline: "English | Grammar | Spoken English and more",
      text: "We help students build strong language skills, confidence and communication for school, higher studies and real life.",
      learnMore: "Learn More",
      about: " about Study Point Classes",
      imageAlt: "A Study Point student learning in class",
    },
  },

  why: {
    kicker: "Why choose Study Point?",
    title: "More Than Just Classes",
    subtitle: "We nurture confident, creative and independent learners for a brighter tomorrow.",
    items: [
      { title: "Caring & Qualified Teachers", text: "Guiding every child with patience and support." },
      { title: "Safe & Friendly Environment", text: "A place where children feel at home." },
      { title: "Well-Structured Programs", text: "Designed for each stage of learning." },
      { title: "Focus on Overall Development", text: "Building confidence for life beyond the classroom." },
    ],
    quote: "Every child is a story waiting to be a success.",
    imageAlt: "A Study Point child reading a book",
  },

  join: {
    kicker: "Getting started",
    title: "How to Join Study Point",
    step: "Step {n}: ",
    steps: [
      { title: "Send an enquiry", text: "Fill in the short form, call or WhatsApp us." },
      { title: "We get in touch", text: "We answer your questions and suggest the right programme." },
      { title: "Visit your nearest branch", text: "Meet our teachers and see the classroom." },
      { title: "Start learning", text: "Your child joins and begins a happy learning journey." },
    ],
  },

  stats: { aria: "Study Point in numbers" },
  updates: { eyebrow: "Stay connected", title: "Visit Our Updates", text: "Follow Study Point for news, photos and announcements.", on: "Study Point on {name}" },
  preview: { eyebrow: "Our Gallery", title: "Moments of Learning, Joy and Growth", viewGallery: "See All Photos" },
  testimonials: { eyebrow: "Parents' Love", title: "What Parents Say About Us" },
  faq: { title: "Frequently Asked Questions" },
  cta: {
    title: "Give Your Child the Best Start Today!",
    text: "Join the Study Point family and be part of a brighter future.",
  },

  footer: {
    about: "A nurturing kindergarten and English tuition centre in Point Pedro and Vathiry, Sri Lanka.",
    quickLinks: "Quick links",
    branches: "Our branches",
    rights: "© {year} Study Point. All rights reserved.",
    aria: "Footer",
  },

  whatsapp: {
    message: "Hello Study Point, I would like to know more.",
    chat: "Chat with us on WhatsApp",
    chatWith: "Chat with {name}",
    close: "Close WhatsApp options",
    choose: "Choose a branch to chat with",
  },

  form: {
    parent: "Parent / guardian name *",
    phone: "Phone / WhatsApp number *",
    child: "Child's name",
    age: "Child's age",
    agePlaceholder: "e.g. 4 years",
    interest: "Interested in",
    interests: ["Kindergarten (3–5 years)", "Study Point Classes", "Not sure yet"],
    branch: "Preferred branch",
    anyBranch: "Either branch",
    message: "Message (optional)",
    send: "Send Enquiry",
    sending: "Sending…",
    thanks: "Thank you!",
    received: "We have received your enquiry and will contact you very soon.",
    another: "Send another enquiry",
    modalTitle: "Enquire Now",
    modalText: "Tell us a little and we'll get back to you.",
    close: "Close enquiry form",
    errors: {
      name: "Please enter your name.",
      phone: "Please enter a valid phone number.",
      generic: "Something went wrong. Please try again.",
      invalid: "Invalid request.",
      unavailable: "Enquiries are not available right now. Please call or WhatsApp us.",
      tooMany: "You have sent several enquiries already. Please try again later or call us.",
    },
  },

  gallery: {
    filter: "Filter by album",
    all: "All",
    open: "Open photo: ",
    viewer: "Photo viewer",
    closeViewer: "Close photo viewer",
    prev: "Previous photo",
    next: "Next photo",
    none: "No photos yet — please check back soon.",
    albums: { Nursery: "Kindergarten", Kindergarten: "Kindergarten", Classes: "Classes", Activities: "Activities", Events: "Events", Campus: "Campus", General: "General" } as Record<string, string>,
  },

  branch: {
    openMaps: "Open in Maps",
    whatsapp: "WhatsApp",
    mapTitle: "Map showing the {name} branch",
  },

  pages: {
    about: {
      metaTitle: "About Us",
      metaDescription:
        "Learn about Study Point — a caring kindergarten and English tuition centre serving families in Point Pedro and Vathiry, Sri Lanka.",
      title: "About Study Point",
      subtitle: "A kindergarten and English learning centre where little learners grow into confident, capable students.",
      storyTitle: "Our story",
      story1:
        "Study Point brings an early years kindergarten and quality English education together under one roof, so families in {branches} can find caring, well-structured learning close to home.",
      story2:
        "Our Kindergarten (ages 3 to 5) builds a strong foundation through phonics, creative activities and play-based learning. Study Point Classes help older children grow in English — grammar, spoken English, writing skills and exam preparation — in small groups.",
      story3: "We believe every child is a story waiting to be a success, and we are here to help write it.",
      ourKindergarten: "Our Kindergarten",
      ourClasses: "Our Classes",
      and: " and ",
      valuesTitle: "What we stand for",
      values: [
        { title: "Care first", text: "Every child is welcomed warmly and treated with patience and kindness." },
        { title: "Learning through joy", text: "Play, stories and activities make learning something children look forward to." },
        { title: "Small groups", text: "Small classes mean teachers know each child and can support them properly." },
        { title: "A safe place", text: "A friendly, supervised environment that parents can trust." },
      ],
      visitTitle: "Visit us in Point Pedro or Vathiry",
      visitText: "Come and see our classrooms, meet our teachers and ask anything you like.",
      findBranches: "Find our branches",
      imageAlt: "Study Point students in the classroom",
    },
    nursery: {
      metaTitle: "Kindergarten (Ages 3–5)",
      metaDescription:
        "Study Point Kindergarten for children aged 3 to 5 in Point Pedro and Vathiry: phonics, creative activities, play based learning, social skills and confidence building.",
      title: "Early Years · 3 – 5 Years",
      subtitle:
        "A happy place to learn, play and grow! A strong foundation through play-based learning, creativity and structured early years activities.",
      learnTitle: "What your child will learn",
      gentleTitle: "A gentle start to school life",
      gentle1:
        "Young children learn best when they feel safe and happy. Our kindergarten days mix songs, stories, hands-on play and simple early literacy activities.",
      gentle2:
        "Teachers keep groups small, celebrate every small step and keep parents informed about how their child is growing.",
      imageAlt: "Kindergarten children playing with colourful blocks",
    },
    classes: {
      metaTitle: "Study Point Classes — English, Spoken English & Exam Preparation",
      metaDescription:
        "English, grammar, phonics, spoken English, writing skills and exam preparation in small groups at Study Point, Point Pedro and Vathiry.",
      title: "Study Point Classes",
      subtitle:
        "Learn Today. Lead Tomorrow. English, Grammar, Phonics, Spoken English, Writing Skills, Exam Preparation and more.",
      teachTitle: "What we teach",
      smallTitle: "Small groups, real progress",
      small1:
        "Our classes are kept small so every student is seen, heard and encouraged. Lessons mix clear teaching with plenty of speaking, reading and writing practice.",
      small2: "We track each student's progress and help them prepare calmly for school exams.",
      imageAlt: "A student reading during a Study Point class",
    },
    gallery: {
      metaTitle: "Gallery",
      metaDescription: "Photos of learning, play and activities at Study Point kindergarten and classes in Point Pedro and Vathiry.",
      title: "Our Learning Moments",
      subtitle: "A look at everyday learning, play and fun at Study Point.",
      sample: "Placeholder photos — real photos coming soon",
    },
    contact: {
      metaTitle: "Contact Us — Point Pedro & Vathiry",
      metaDescription:
        "Contact Study Point: addresses, phone numbers, opening hours and maps for our Point Pedro and Vathiry branches, plus an online enquiry form.",
      title: "Contact Us",
      subtitle: "We would love to hear from you. Visit a branch, call, WhatsApp or send an enquiry.",
      follow: "Follow us",
      formTitle: "Send us an enquiry",
      formText: "Fill in the form and we will contact you.",
    },
    home: {
      metaTitle: "Study Point — Kindergarten & English Classes in Point Pedro and Vathiry",
      metaDescription:
        "Study Point is a kindergarten (ages 3–5) and English tuition centre in Point Pedro and Vathiry, Sri Lanka. Phonics, spoken English, grammar, writing and exam preparation in small, caring groups.",
      ogTitle: "Study Point — Little Learners. Brighter Tomorrows.",
      ogDescription: "Kindergarten for ages 3–5 and English classes in Point Pedro and Vathiry, Sri Lanka.",
    },
  },

  /** Branch names as shown to visitors (the database keeps English names). */
  branchNames: { "point-pedro": "Point Pedro", vathiry: "Vathiry" } as Record<string, string>,
};

export type Dict = typeof en;
