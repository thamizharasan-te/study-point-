/**
 * Standard Tamil for the built-in default content (English text → Tamil).
 * Used when the owner has not typed a Tamil version in /admin, so databases
 * seeded earlier still show Tamil. Anything not listed here falls back to
 * the English text.
 */
export const DEFAULT_TA: Record<string, string> = {
  // Home heading
  "Welcome to Study Point": "Study Point-க்கு வரவேற்கிறோம்",
  "Little Learners.": "குட்டிக் கற்றோர்.",
  Brighter: "ஒளிமயமான",
  "Tomorrows.": "நாளைகள்.",
  "A nurturing early years program and quality English education — all under one roof.":
    "அன்பான மழலையர் பராமரிப்புத் திட்டமும் தரமான ஆங்கிலக் கல்வியும் — ஒரே கூரையின் கீழ்.",

  // Nursery programmes
  Phonics: "ஒலிப்பியல் (Phonics)",
  "Letter sounds and early reading, taught step by step through songs and games.":
    "பாடல்கள், விளையாட்டுகள் மூலம் எழுத்தொலிகளையும் ஆரம்ப வாசிப்பையும் படிப்படியாகக் கற்பித்தல்.",
  "Creative Activities": "படைப்பாற்றல் செயல்பாடுகள்",
  "Drawing, colouring, crafts and music that let imagination grow.":
    "கற்பனை வளர உதவும் ஓவியம், வண்ணம் தீட்டுதல், கைவினை, இசை.",
  "Play Based Learning": "விளையாட்டு வழிக் கற்றல்",
  "Learning through blocks, puzzles and guided play, at each child's pace.":
    "ஒவ்வொரு பிள்ளையின் வேகத்துக்கும் ஏற்ப வண்ணத் துண்டுகள், புதிர்கள், வழிகாட்டப்பட்ட விளையாட்டு மூலம் கற்றல்.",
  "Social Skills": "சமூகத் திறன்கள்",
  "Sharing, taking turns and making friends in a caring group.":
    "அன்பான குழுவில் பகிர்தல், முறை வைத்தல், நண்பர்களை உருவாக்குதல்.",
  "Confidence Building": "தன்னம்பிக்கை வளர்ப்பு",
  "Speaking up, trying new things and feeling proud of small wins.":
    "தைரியமாகப் பேசுதல், புதியவற்றை முயலுதல், சிறு வெற்றிகளில் பெருமை கொள்ளுதல்.",

  // Class programmes
  English: "ஆங்கிலம்",
  "Reading, vocabulary and comprehension for confident everyday English.":
    "நம்பிக்கையான அன்றாட ஆங்கிலத்துக்கான வாசிப்பு, சொல்வளம், புரிதல்.",
  Grammar: "இலக்கணம்",
  "Clear, practical grammar lessons with plenty of examples and practice.":
    "ஏராளமான எடுத்துக்காட்டுகளுடனும் பயிற்சியுடனும் தெளிவான, நடைமுறை இலக்கணப் பாடங்கள்.",
  "Sound-based reading support for children who are building early literacy.":
    "ஆரம்ப எழுத்தறிவை வளர்க்கும் பிள்ளைகளுக்கான ஒலி அடிப்படையிலான வாசிப்பு ஆதரவு.",
  "Spoken English": "பேச்சு ஆங்கிலம்",
  "Speaking practice that builds fluency and removes the fear of speaking.":
    "சரளத்தை வளர்த்து பேசும் பயத்தைப் போக்கும் பேச்சுப் பயிற்சி.",
  "Writing Skills": "எழுத்துத் திறன்",
  "Sentences, paragraphs and creative writing, with friendly feedback.":
    "நட்பான கருத்துகளுடன் வாக்கியங்கள், பத்திகள், படைப்பெழுத்து.",
  "Small Groups": "சிறிய குழுக்கள்",
  "Small classes so every student gets the teacher's attention.":
    "ஒவ்வொரு மாணவருக்கும் ஆசிரியரின் கவனம் கிடைக்கும் சிறிய வகுப்புகள்.",
  "Exam Preparation": "தேர்வுத் தயாரிப்பு",
  "Focused revision and exam technique for school English exams.":
    "பாடசாலை ஆங்கிலத் தேர்வுகளுக்கான கவனம் செலுத்திய மீள்பார்வையும் தேர்வு நுட்பங்களும்.",

  // FAQ
  "What age group is the Nursery for?": "மழலையர் பள்ளி எந்த வயதினருக்கானது?",
  "Our Nursery is for children aged 3 to 5 years, with phonics, creative activities, play based learning, social skills and confidence building.":
    "எங்கள் மழலையர் பள்ளி 3 முதல் 5 வயதுப் பிள்ளைகளுக்கானது; ஒலிப்பியல், படைப்பாற்றல் செயல்பாடுகள், விளையாட்டு வழிக் கற்றல், சமூகத் திறன்கள், தன்னம்பிக்கை வளர்ப்பு ஆகியவை உள்ளன.",
  "What do Study Point Classes teach?": "Study Point வகுப்புகளில் என்ன கற்பிக்கப்படுகிறது?",
  "English, grammar, phonics, spoken English, writing skills and exam preparation, taught in small groups.":
    "ஆங்கிலம், இலக்கணம், ஒலிப்பியல், பேச்சு ஆங்கிலம், எழுத்துத் திறன், தேர்வுத் தயாரிப்பு — சிறிய குழுக்களில்.",
  "Are the groups small?": "குழுக்கள் சிறியவையா?",
  "Yes. We keep groups small so that teachers can give every child proper attention.":
    "ஆம். ஒவ்வொரு பிள்ளைக்கும் ஆசிரியர்கள் முறையான கவனம் செலுத்த குழுக்களைச் சிறியதாக வைக்கிறோம்.",
  "Where are your branches?": "உங்கள் கிளைகள் எங்கே உள்ளன?",
  "We have two branches, in Point Pedro and Vathiry. Addresses, phone numbers and maps are on the Contact page.":
    "எங்களுக்குப் பருத்தித்துறையிலும் வதிரியிலும் இரண்டு கிளைகள் உள்ளன. முகவரிகள், தொலைபேசி எண்கள், வரைபடங்கள் தொடர்புப் பக்கத்தில் உள்ளன.",
  "How can I enquire or enrol my child?": "என் பிள்ளையைச் சேர்க்க / விசாரிக்க எப்படி?",
  "Press Enquire Now, call us or send a WhatsApp message. We will get back to you and answer your questions.":
    "\"விசாரிக்க\" பொத்தானை அழுத்துங்கள், அழையுங்கள் அல்லது WhatsApp செய்தி அனுப்புங்கள். நாங்கள் தொடர்பு கொண்டு உங்கள் கேள்விகளுக்குப் பதிலளிப்போம்.",
  "What about fees, timings and available places?": "கட்டணம், நேரங்கள், கிடைக்கும் இடங்கள் பற்றி?",
  "These can differ by branch and class, so please contact your nearest branch and we will be happy to help.":
    "இவை கிளைக்கும் வகுப்புக்கும் ஏற்ப மாறலாம்; எனவே உங்கள் அருகிலுள்ள கிளையைத் தொடர்பு கொள்ளுங்கள், மகிழ்ச்சியுடன் உதவுவோம்.",

  // Counters
  "Happy Students": "மகிழ்ச்சியான மாணவர்கள்",
  "Years of Experience": "ஆண்டுகள் அனுபவம்",
  Branches: "கிளைகள்",
  "Parent Satisfaction": "பெற்றோர் திருப்தி",

  // Sample parent comments (hidden on the public site until real ones exist)
  "Sample parent comment: my child enjoys every class and looks forward to going.":
    "மாதிரிப் பெற்றோர் கருத்து: என் பிள்ளை ஒவ்வொரு வகுப்பையும் ரசித்து, செல்ல ஆவலாக இருக்கிறது.",
  "Sample parent comment: the teachers are caring and the environment is friendly.":
    "மாதிரிப் பெற்றோர் கருத்து: ஆசிரியர்கள் அன்பானவர்கள், சூழல் நட்பாக உள்ளது.",
  "Sample parent comment: we have seen real progress in confidence and English.":
    "மாதிரிப் பெற்றோர் கருத்து: தன்னம்பிக்கையிலும் ஆங்கிலத்திலும் உண்மையான முன்னேற்றத்தைக் கண்டோம்.",

  // Branch details
  "Point Pedro, Northern Province, Sri Lanka": "பருத்தித்துறை, வட மாகாணம், இலங்கை",
  "Vathiry, Northern Province, Sri Lanka": "வதிரி, வட மாகாணம், இலங்கை",
  "Please call us for class timings": "வகுப்பு நேரங்களுக்கு எங்களை அழையுங்கள்",
};
