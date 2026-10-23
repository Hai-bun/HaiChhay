// Multi-language support for Wedding Invitation

export type Language = 'en' | 'km';

export interface Translations {
  // Common
  save: string;
  share: string;
  cancel: string;
  submit: string;
  loading: string;
  
  // Hero Section
  welcomeGuest: string;
  weInviteYou: string;
  countingDown: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  
  // Couple Section
  theCouple: string;
  groomFamily: string;
  brideFamily: string;
  sonOf: string;
  daughterOf: string;
  
  // Location Section
  eventLocation: string;
  getDirections: string;
  locationTagline: string;
  locationHeading: string;
  locationTagline2: string;
  locationFooter: string;
  
  // Gallery Section
  ourStory: string;
  photoGallery: string;

  // Story & Schedule Sections
  weddingSchedule: string;
  
  // RSVP Section
  rsvpTitle: string;
  rsvpSubtitle: string;
  yourName: string;
  enterName: string;
  willYouAttend: string;
  yesAttending: string;
  noNotAttending: string;
  blessingMessage: string;
  sendWishes: string;
  submitRsvp: string;
  rsvpSuccess: string;
  rsvpSuccessMessage: string;
  wishesTitle: string;
  wishesAttending: string;
  wishesNotAttending: string;
  
  // Gift Section
  weddingGift: string;
  giftMessage: string;
  scanQR: string;
  
  // Footer
  invitationUnavailableTitle: string;
  invitationUnavailableBody: string;
  thankYouTitle: string;
  thankYou: string;
  madeWithLove: string;

  // Save the date
  markYourCalendar: string;
  saveTheDate: string;
  saveTheDateText: string;

  // Header navigation
  navHome: string;
  navCouple: string;
  navStory: string;
  navLocation: string;
  navSchedule: string;
  navSaveDate: string;
  navGallery: string;
  navGift: string;
  navRsvp: string;
  
  // Welcome Popup
  welcomeTitle: string;
  openInvitation: string;
  dearGuest: string;

  // Film Reel Template
  chapter: string;
  soundOn: string;
  soundOff: string;
  playFilm: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    save: 'Save',
    share: 'Share',
    cancel: 'Cancel',
    submit: 'Submit',
    loading: 'Loading...',
    
    // Hero Section
    welcomeGuest: 'Welcome',
    weInviteYou: 'We joyfully invite you to celebrate',
    countingDown: 'Counting down to our special day',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    
    // Couple Section
    theCouple: 'The Couple',
    groomFamily: 'Groom\'s Family',
    brideFamily: 'Bride\'s Family',
    sonOf: 'Son of',
    daughterOf: 'Daughter of',
    
    // Location Section
    eventLocation: 'Event Location',
    getDirections: 'Get Directions',
    locationTagline: 'Where we will become one',
    locationHeading: 'Location',
    locationTagline2: 'Where we begin our forever',
    locationFooter: "We can't wait to celebrate our love with you.",
    
    // Gallery Section
    ourStory: 'Our Story',
    photoGallery: 'Photo Gallery',

    // Story & Schedule Sections
    weddingSchedule: 'Wedding Day Schedule',
    
    // RSVP Section
    rsvpTitle: 'RSVP',
    rsvpSubtitle: 'Please let us know if you will be joining us',
    yourName: 'Your Name',
    enterName: 'Enter your name',
    willYouAttend: 'Will you attend?',
    yesAttending: 'Yes, I will attend',
    noNotAttending: 'Sorry, I cannot attend',
    blessingMessage: 'Blessing Message',
    sendWishes: 'Send your wishes to the couple...',
    submitRsvp: 'Submit RSVP',
    rsvpSuccess: 'Thank You!',
    rsvpSuccessMessage: 'Your response has been recorded. We look forward to celebrating with you!',
    wishesTitle: 'Wishes from our guests',
    wishesAttending: 'Attending',
    wishesNotAttending: 'Cannot attend',
    
    // Gift Section
    weddingGift: 'Wedding Gift',
    giftMessage: 'Your presence is our greatest gift. However, if you wish to bless us with a gift, you may scan the KHQR code below.',
    scanQR: 'Scan the QR code to send a gift',
    
    // Footer
    invitationUnavailableTitle: 'This invitation is no longer available',
    invitationUnavailableBody: 'This link has been removed by the hosts. If you think this is a mistake, please contact them for a new invitation.',
    thankYouTitle: 'With Gratitude and Apologies',
    thankYou:
      'We are deeply grateful to every honoured guest, from Samdech, Excellencies and distinguished dignitaries to our dear relatives and friends, who will grace our wedding celebration with their presence. Please forgive us for not being able to deliver each invitation in person. With our highest respect.',
    madeWithLove: 'Made with love',

    // Save the date
    markYourCalendar: 'Mark your calendar',
    saveTheDate: 'Save the Date',
    saveTheDateText: "We can't wait to celebrate with you.",

    // Header navigation
    navHome: 'Home',
    navCouple: 'Couple',
    navStory: 'Story',
    navLocation: 'Location',
    navSchedule: 'Schedule',
    navSaveDate: 'Save the Date',
    navGallery: 'Gallery',
    navGift: 'Gift',
    navRsvp: 'RSVP',
    
    // Welcome Popup
    welcomeTitle: 'You are Invited',
    openInvitation: 'Open the Invitation',
    dearGuest: 'Dear',

    // Film Reel Template
    chapter: 'Chapter',
    soundOn: 'Turn on sound',
    soundOff: 'Mute',
    playFilm: 'Play film',
  },
  km: {
    // Common
    save: 'រក្សាទុក',
    share: 'ចែករំលែក',
    cancel: 'បោះបង់',
    submit: 'ផ្ញើ',
    loading: 'កំពុងផ្ទុក...',
    
    // Hero Section
    welcomeGuest: 'សូមស្វាគមន៍',
    weInviteYou: 'យើងខ្ញុំសូមអញ្ជើញលោកអ្នកចូលរួមអបអរសាទរ',
    countingDown: 'រាប់ថយក្រោយដល់ថ្ងៃពិសេសរបស់យើង',
    days: 'ថ្ងៃ',
    hours: 'ម៉ោង',
    minutes: 'នាទី',
    seconds: 'វិនាទី',
    
    // Couple Section
    theCouple: 'គូស្រករ',
    groomFamily: 'គ្រួសារកូនកំឡោស',
    brideFamily: 'គ្រួសារកូនក្រមុំ',
    sonOf: 'កូនប្រុសរបស់',
    daughterOf: 'កូនស្រីរបស់',
    
    // Location Section
    eventLocation: 'ទីតាំងពិធី',
    getDirections: 'បង្ហាញផ្លូវ',
    locationTagline: 'ទីកន្លែងដែលយើងទាំងពីរនឹងក្លាយជាមួយគ្នា',
    locationHeading: 'ទីតាំង',
    locationTagline2: 'ទីកន្លែងដែលយើងចាប់ផ្តើមអនាគតជារៀងរហូត',
    locationFooter: 'យើងរង់ចាំអបអរសាទរក្តីស្រឡាញ់របស់យើងជាមួយលោកអ្នក។',
    
    // Gallery Section
    ourStory: 'រឿងរ៉ាវរបស់យើង',
    photoGallery: 'វិចិត្រសាល',

    // Story & Schedule Sections
    weddingSchedule: 'កម្មវិធីថ្ងៃមង្គលការ',
    
    // RSVP Section
    rsvpTitle: 'បញ្ជាក់ការចូលរួម',
    rsvpSubtitle: 'សូមប្រាប់យើងខ្ញុំថាតើលោកអ្នកនឹងចូលរួមជាមួយយើងទេ',
    yourName: 'ឈ្មោះរបស់អ្នក',
    enterName: 'បញ្ចូលឈ្មោះរបស់អ្នក',
    willYouAttend: 'តើអ្នកនឹងចូលរួមទេ?',
    yesAttending: 'បាទ/ចាស ខ្ញុំនឹងចូលរួម',
    noNotAttending: 'សូមអភ័យទោស ខ្ញុំមិនអាចចូលរួមបានទេ',
    blessingMessage: 'សារពរជ័យ',
    sendWishes: 'ផ្ញើពាក្យអបអរសាទរទៅគូស្រករ...',
    submitRsvp: 'ផ្ញើការឆ្លើយតប',
    rsvpSuccess: 'អរគុណ!',
    rsvpSuccessMessage: 'ការឆ្លើយតបរបស់អ្នកត្រូវបានកត់ត្រា។ យើងទន្ទឹងរង់ចាំអបអរសាទរជាមួយអ្នក!',
    wishesTitle: 'ពាក្យជូនពរពីភ្ញៀវ',
    wishesAttending: 'ចូលរួម',
    wishesNotAttending: 'មិនអាចចូលរួម',
    
    // Gift Section
    weddingGift: 'អំណោយអាពាហ៍ពិពាហ៍',
    giftMessage: 'វត្តមានរបស់អ្នកគឺជាអំណោយដ៏ធំបំផុតរបស់យើង។ ប៉ុន្តែប្រសិនបើអ្នកចង់ពរជ័យយើងជាមួយអំណោយ សូមស្កេន KHQR ខាងក្រោម។',
    scanQR: 'ស្កេន QR ដើម្បីផ្ញើអំណោយ',
    
    // Footer
    invitationUnavailableTitle: 'សំបុត្រអញ្ជើញនេះលែងមានទៀតហើយ',
    invitationUnavailableBody: 'តំណនេះត្រូវបានម្ចាស់កម្មវិធីលុបចេញ។ ប្រសិនបើអ្នកគិតថាមានកំហុស សូមទាក់ទងម្ចាស់កម្មវិធីដើម្បីសុំសំបុត្រអញ្ជើញថ្មី។',
    thankYouTitle: 'សូមអរគុណ និងសូមអភ័យទោស',
    thankYou:
      'យើងខ្ញុំទាំងពីរ សូមថ្លែងអំណរគុណ យ៉ាងជ្រាលជ្រៅ ចំពោះវត្តមាន ដ៏ឧត្តុង្គឧត្តមរបស់ សម្តេច ឯកឧត្តម លោកជំទាវ លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា លោក លោកស្រី អ្នកនាង កញ្ញា ដែលបាន អញ្ជើញចូលរួមជាកិត្តិយស ក្នុងពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍ របស់យើងខ្ញុំ នាពេលខាងមុខនេះ។ យើងខ្ញុំសូមការខន្តីអភ័យទោស ដែលពុំបានជូនលិខិតអញ្ជើញ ដោយផ្ទាល់ ។ ដោយការវកិច្ចដ៏ខ្ពង់ខ្ពស់ពីយើងខ្ញុំ។',
    madeWithLove: 'បង្កើតដោយក្តីស្រលាញ់',

    // Save the date
    markYourCalendar: 'សូមកត់ត្រាទុកថ្ងៃ',
    saveTheDate: 'កត់ចំណាំថ្ងៃនេះទុក',
    saveTheDateText: 'យើងរង់ចាំអបអរសាទរជាមួយលោកអ្នក។',

    // Header navigation
    navHome: 'ទំព័រដើម',
    navCouple: 'គូស្រករ',
    navStory: 'រឿងរបស់យើង',
    navLocation: 'ទីតាំង',
    navSchedule: 'កាលវិភាគ',
    navSaveDate: 'កក់ទុកថ្ងៃ',
    navGallery: 'វិចិត្រសាល',
    navGift: 'អំណោយ',
    navRsvp: 'ចូលរួម',
    
    // Welcome Popup
    welcomeTitle: 'អ្នកត្រូវបានអញ្ជើញ',
    openInvitation: 'បើកធៀប',
    dearGuest: 'ជូនចំពោះ',

    // Film Reel Template
    chapter: 'ជំពូក',
    soundOn: 'បើកសំឡេង',
    soundOff: 'បិទសំឡេង',
    playFilm: 'ចាក់វីដេអូ',
  },
};

// Get stored language or default to English
export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'km';
  const stored = localStorage.getItem('wedding_language');
  // Khmer unless the guest explicitly chose English.
  return (stored === 'en' ? 'en' : 'km') as Language;
};

// Save language preference
export const setStoredLanguage = (lang: Language): void => {
  localStorage.setItem('wedding_language', lang);
};

// Get translation for a key
export const t = (key: keyof Translations, lang?: Language): string => {
  const language = lang || getStoredLanguage();
  return translations[language][key] || translations.en[key] || key;
};

// Get all translations for a language
export const getTranslations = (lang?: Language): Translations => {
  const language = lang || getStoredLanguage();
  return translations[language];
};

// Export translations object for direct access
export { translations };
