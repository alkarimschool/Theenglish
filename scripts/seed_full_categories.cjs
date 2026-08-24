const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/alkarim_db.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const newTopics = [
  // --- SD 4: DIALOGUE ---
  {
    id: 'topic-sd4-dial-classroom',
    levelId: 'sd-4',
    categoryId: 'dialogue',
    title: 'Classroom Conversations: Borrowing Supplies & Study Partners',
    theme: 'Polite Peer Interaction & Working Together in Class',
    description:
      'Percakapan interaktif di dalam kelas tentang meminjam perlengkapan belajar, menyapa teman sebangku, dan berdiskusi kelompok.',
    order: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- SD 4: SPEECH ---
  {
    id: 'topic-sd4-speech-health',
    levelId: 'sd-4',
    categoryId: 'speech',
    title: 'Simple Speech: Healthy Habits & Daily Cleanliness',
    theme: 'Washing Hands, Nutritious Food, and Staying Active',
    description:
      'Belajar menyampaikan pidato singkat dan percaya diri tentang pentingnya sarapan sehat, mencuci tangan, dan menjaga stamina tubuh.',
    order: 4,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- SD 5: EXPRESSION ---
  {
    id: 'topic-sd5-expr-agreement',
    levelId: 'sd-5',
    categoryId: 'expression',
    title: 'Expressions of Agreement & Polite Disagreement',
    theme: 'Expressing Opinions, Discussing Ideas, and Reaching Mutual Consensus',
    description:
      'Mempelajari ungkapan setuju (Agreement) dan tidak setuju (Disagreement) dengan kalimat santun saat bertukar gagasan.',
    order: 2,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- SD 5: VOCABULARY ---
  {
    id: 'topic-sd5-vocab-technology',
    levelId: 'sd-5',
    categoryId: 'vocabulary',
    title: 'Modern Technology, Gadgets & Digital Tools',
    theme: 'Computers, Smart Devices, and Internet Literacy in Education',
    description:
      'Kosakata lengkap seputar perangkat komputer, aplikasi digital, internet cerdas, dan alat multimedia sekolah.',
    order: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- SD 6: EXPRESSION ---
  {
    id: 'topic-sd6-expr-suggestion',
    levelId: 'sd-6',
    categoryId: 'expression',
    title: 'Giving Suggestions, Recommendations & Helpful Advice',
    theme: 'Proposing Good Ideas and Giving Constructive Advice to Classmates',
    description:
      'Cara memberikan saran dan rekomendasi yang solutif menggunakan modal verb (Should, Why don’t we, How about...).',
    order: 2,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- SD 6: VOCABULARY ---
  {
    id: 'topic-sd6-vocab-travel',
    levelId: 'sd-6',
    categoryId: 'vocabulary',
    title: 'Modes of Transportation, Travel & World Tourism',
    theme: 'Airports, Train Stations, Landmarks, and Journey Preparation',
    description:
      'Mengenal kosakata transportasi, tiket perjalanan, peta destinasi, dan etika berwisata edukatif ke berbagai tempat bersejarah.',
    order: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const newMaterials = [
  // --- SD 4: DIALOGUE MATERIAL ---
  {
    id: 'mat-topic-sd4-dial-classroom',
    topicId: 'topic-sd4-dial-classroom',
    summary:
      'Percakapan kontekstual dalam ruang kelas antara teman sebangku mengenai peminjaman alat tulis dan pembagian tugas prakarya.',
    contentMarkdown: `### 💬 Percakapan di Kelas (Classroom Dialogue)
Berkomunikasi aktif dengan teman sekelas menggunakan bahasa Inggris yang ramah membantu menciptakan suasana belajar yang menyenangkan.

#### 1. Ungkapan Kunci (Key Phrases in Dialogue):
* **Do you have a spare ... ?** (Apakah kamu punya cadangan ... ?)
* **Can we work together on this project?** (Bisakah kita bekerja sama mengerjakan proyek ini?)
* **Here you are, please use it carefully.** (Ini dia, silakan gunakan dengan hati-hati.)
* **Thank you for helping me!** (Terima kasih telah membantuku!)

---

#### 2. Naskah Percakapan (Full Dialogue Script):
**Farhan**: "Assalamu'alaikum, Aisyah. Do you have a spare pencil? Mine is broken."  
**Aisyah**: "Wa'alaikumussalam, Farhan. Yes, I do! Here is a sharp HB pencil you can use."  
**Farhan**: "Alhamdulillah, thank you so much, Aisyah! By the way, are we ready for the science drawing task?"  
**Aisyah**: "Yes! Let's color our plant diagram together. You can use my green crayons too."  
**Farhan**: "That's very kind of you. Let's start now!"`,
    vocabularyList: [
      {
        id: 'v-sd4-d1',
        word: 'Spare',
        phonetic: '/sper/',
        partOfSpeech: 'Adjective',
        meaning: 'Cadangan / Ekstra',
        example: 'I have a spare eraser in my pencil case.',
        exampleTranslation: 'Aku punya penghapus cadangan di tempat pensilku.',
      },
      {
        id: 'v-sd4-d2',
        word: 'Broken',
        phonetic: '/ˈbroʊ.kən/',
        partOfSpeech: 'Adjective',
        meaning: 'Patah / Rusak',
        example: 'My wooden ruler is broken.',
        exampleTranslation: 'Penggaris kayuku patah.',
      },
      {
        id: 'v-sd4-d3',
        word: 'Together',
        phonetic: '/təˈɡeð.ər/',
        partOfSpeech: 'Adverb',
        meaning: 'Bersama-sama',
        example: 'We study English together every Tuesday.',
        exampleTranslation: 'Kami belajar bahasa Inggris bersama setiap hari Selasa.',
      },
      {
        id: 'v-sd4-d4',
        word: 'Sharp',
        phonetic: '/ʃɑːrp/',
        partOfSpeech: 'Adjective',
        meaning: 'Runcing / Tajam',
        example: 'Please use a sharp pencil for drawing.',
        exampleTranslation: 'Tolong gunakan pensil yang runcing untuk menggambar.',
      },
      {
        id: 'v-sd4-d5',
        word: 'Kind',
        phonetic: '/kaɪnd/',
        partOfSpeech: 'Adjective',
        meaning: 'Baik hati / Ramah',
        example: 'It is very kind of you to share your crayons.',
        exampleTranslation: 'Sangat baik hatimu mau berbagi krayonmu.',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-sd4-1',
        speaker: 'Farhan',
        text: 'Do you have a spare pencil? Mine is broken.',
        translation: 'Apakah kamu punya pensil cadangan? Pensilku patah.',
      },
      {
        id: 'd-sd4-2',
        speaker: 'Aisyah',
        text: 'Yes, I do! Here is a sharp pencil you can use.',
        translation: 'Ya, punya! Ini pensil runcing yang bisa kamu pakai.',
      },
    ],
    keyPoints: [
      "Awali percakapan dengan sapaan hangat atau salam (Assalamu'alaikum / Good morning).",
      "Gunakan kata 'Here is...' saat menyerahkan barang kepada teman.",
    ],
    tips: [
      'Ucapkan kalimat dengan kontak mata dan senyum ramah agar percakapan terasa akrab!',
    ],
    updatedAt: new Date().toISOString(),
  },

  // --- SD 4: SPEECH MATERIAL ---
  {
    id: 'mat-topic-sd4-speech-health',
    topicId: 'topic-sd4-speech-health',
    summary:
      'Naskah pidato singkat tingkat dasar tentang memelihara kesehatan tubuh, sarapan bergizi, dan mencuci tangan sebelum makan.',
    contentMarkdown: `### 🎤 Pidato Singkat: Hidup Sehat & Bersih di Sekolah (Healthy Habits)
Belajar menyampaikan pesan kesehatan di depan teman-teman kelas dengan percaya diri dan intonasi ceria.

#### 1. Naskah Pidato Siswa (Student Speech Script):
*"Good morning teachers and my dear classmates,*\n\n*Today, I would like to share three easy habits to keep our body healthy and energetic every day:*\n\n1. **Eat a healthy breakfast** before coming to school to give energy for studying.\n2. **Wash our hands with soap** before eating and after playing outdoors.\n3. **Drink plenty of water** and exercise regularly in physical education class.\n\n*A healthy body makes a smart and happy student!*\n\n*Thank you for listening to my speech. Have a wonderful and healthy day!"*`,
    vocabularyList: [
      {
        id: 'v-sd4-s1',
        word: 'Habit',
        phonetic: '/ˈhæb.ɪt/',
        partOfSpeech: 'Noun',
        meaning: 'Kebiasaan',
        example: 'Washing hands is a good habit.',
        exampleTranslation: 'Mencuci tangan adalah kebiasaan yang baik.',
      },
      {
        id: 'v-sd4-s2',
        word: 'Energetic',
        phonetic: '/ˌen.ɚˈdʒet̬.ɪk/',
        partOfSpeech: 'Adjective',
        meaning: 'Penuh energi / Bersemangat',
        example: 'Healthy food makes us energetic.',
        exampleTranslation: 'Makanan sehat membuat kita bersemangat.',
      },
      {
        id: 'v-sd4-s3',
        word: 'Soap',
        phonetic: '/soʊp/',
        partOfSpeech: 'Noun',
        meaning: 'Sabun',
        example: 'Always wash hands with clean water and soap.',
        exampleTranslation: 'Selalu cuci tangan dengan air bersih dan sabun.',
      },
      {
        id: 'v-sd4-s4',
        word: 'Plenty of',
        phonetic: '/ˈplen.t̬i əv/',
        partOfSpeech: 'Determiner',
        meaning: 'Banyak / Melimpah',
        example: 'Drink plenty of water during sunny days.',
        exampleTranslation: 'Minumlah banyak air di hari yang terik.',
      },
      {
        id: 'v-sd4-s5',
        word: 'Smart',
        phonetic: '/smɑːrt/',
        partOfSpeech: 'Adjective',
        meaning: 'Pintar / Cerdas',
        example: 'Healthy students become smart learners.',
        exampleTranslation: 'Siswa yang sehat menjadi pembelajar yang cerdas.',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-sd4-s1',
        speaker: 'Speaker',
        text: 'A healthy body makes a smart and happy student!',
        translation: 'Tubuh yang sehat menjadikan siswa cerdas dan bahagia!',
      },
    ],
    keyPoints: [
      'Gunakan intonasi yang tegas dan jelas saat menyebutkan poin 1, 2, dan 3.',
      'Tatap mata teman-teman kelas dan tersenyum saat pembukaan dan penutupan.',
    ],
    tips: [
      'Latihlah pembacaan naskah di depan cermin 2-3 kali sebelum tampil di depan kelas!',
    ],
    updatedAt: new Date().toISOString(),
  },

  // --- SD 5: EXPRESSION MATERIAL ---
  {
    id: 'mat-topic-sd5-expr-agreement',
    topicId: 'topic-sd5-expr-agreement',
    summary:
      'Panduan ungkapan menyatakan persetujuan (Agreement) dan ketidaksetujuan secara santun (Polite Disagreement) dalam musyawarah kelas.',
    contentMarkdown: `### 🤝 Menyatakan Persetujuan & Perbedaan Pendapat (Agreement & Disagreement)
Saat bermusyawarah atau berdiskusi kelompok, kita perlu menyampaikan pendapat dengan santun tanpa menyinggung perasaan teman.

#### 1. Menyatakan Setuju (Expressing Agreement):
* **I totally agree with you.** (Saya sangat setuju denganmu.)
* **That is a great idea!** (Itu ide yang sangat bagus!)
* **I think so too.** (Aku juga berpikir demikian.)
* **You are absolutely right.** (Kamu benar sekali.)

---

#### 2. Menyatakan Tidak Setuju Secara Sopan (Polite Disagreement):
* **I see your point, but I think ...** (Saya paham maksudmu, namun menurut saya ...)
* **I am not sure about that.** (Saya kurang yakin tentang hal itu.)
* **I respectfully disagree because ...** (Saya mohon izin tidak sependapat karena ...)`,
    vocabularyList: [
      {
        id: 'v-sd5-e1',
        word: 'Agree',
        phonetic: '/əˈɡriː/',
        partOfSpeech: 'Verb',
        meaning: 'Setuju / Sepakat',
        example: 'I agree that we should start our project early.',
        exampleTranslation: 'Saya setuju bahwa kita harus memulai proyek lebih awal.',
      },
      {
        id: 'v-sd5-e2',
        word: 'Opinion',
        phonetic: '/əˈpɪn.jən/',
        partOfSpeech: 'Noun',
        meaning: 'Pendapat / Opini',
        example: 'Everyone has the right to share their opinion.',
        exampleTranslation: 'Setiap orang berhak membagikan pendapatnya.',
      },
      {
        id: 'v-sd5-e3',
        word: 'Respectfully',
        phonetic: '/rɪˈspekt.fəl.i/',
        partOfSpeech: 'Adverb',
        meaning: 'Dengan penuh rasa hormat',
        example: 'He respectfully explained his reasons.',
        exampleTranslation: 'Beliau menjelaskan alasannya dengan penuh hormat.',
      },
      {
        id: 'v-sd5-e4',
        word: 'Decision',
        phonetic: '/dɪˈsɪʒ.ən/',
        partOfSpeech: 'Noun',
        meaning: 'Keputusan',
        example: 'Our team made a wise decision together.',
        exampleTranslation: 'Tim kami membuat keputusan yang bijak bersama-sama.',
      },
      {
        id: 'v-sd5-e5',
        word: 'Consensus',
        phonetic: '/kənˈsen.səs/',
        partOfSpeech: 'Noun',
        meaning: 'Mufakat / Kesepakatan bersama',
        example: 'We reached a consensus after the discussion.',
        exampleTranslation: 'Kami mencapai mufakat setelah diskusi.',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-sd5-e1',
        speaker: 'Fadhil',
        text: 'I suggest we paint our class wall with light blue.',
        translation: 'Saya usul kita mengecat dinding kelas dengan warna biru muda.',
      },
      {
        id: 'd-sd5-e2',
        speaker: 'Rara',
        text: 'I totally agree! Light blue looks peaceful and bright.',
        translation: 'Aku sangat setuju! Biru muda terlihat menenangkan dan cerah.',
      },
    ],
    keyPoints: [
      "Selalu dengarkan pendapat orang lain sampai selesai sebelum menyatakan 'I agree' atau 'I disagree'.",
      "Sertakan alasan yang logis saat menyatakan ketidaksetujuan.",
    ],
    tips: [
      "Gunakan kata 'In my opinion...' saat hendak mengemukakan sudut pandang barumu!",
    ],
    updatedAt: new Date().toISOString(),
  },

  // --- SD 5: VOCABULARY MATERIAL ---
  {
    id: 'mat-topic-sd5-vocab-technology',
    topicId: 'topic-sd5-vocab-technology',
    summary:
      'Daftar istilah teknologi modern, perangkat komputer sekolah, internet cerdas, dan keamanan digital.',
    contentMarkdown: `### 💻 Perangkat Teknologi & Dunia Digital (Technology & Gadgets)
Penguasaan teknologi digital yang bijak sangat mendukung prestasi belajar siswa di era modern.

#### 1. Perangkat Keras Komputer (Hardware):
* **Monitor / Screen** : *The visual display screen.*
* **Keyboard** : *The set of keys for typing letters and numbers.*
* **Mouse** : *The hand-held pointing device.*
* **Printer** : *Device that prints documents on paper.*
* **Projector** : *Projects classroom slides onto the white screen.*

---

#### 2. Istilah Internet & Digital (Digital Literacy):
* **Browser** : *Program to explore websites (e.g. Chrome, Firefox).*
* **Password** : *Secret code to secure our personal account.*
* **Download / Upload** : *Receiving or sending files online.*`,
    vocabularyList: [
      {
        id: 'v-sd5-v1',
        word: 'Keyboard',
        phonetic: '/ˈkiː.bɔːrd/',
        partOfSpeech: 'Noun',
        meaning: 'Papan ketik',
        example: 'Type your essay using the wireless keyboard.',
        exampleTranslation: 'Ketiklah esaimu menggunakan papan ketik nirkabel.',
      },
      {
        id: 'v-sd5-v2',
        word: 'Password',
        phonetic: '/ˈpæs.wɜːrd/',
        partOfSpeech: 'Noun',
        meaning: 'Kata sandi rahasia',
        example: 'Keep your account password secret and strong.',
        exampleTranslation: 'Jaga kata sandi akunmu tetap rahasia dan kuat.',
      },
      {
        id: 'v-sd5-v3',
        word: 'Projector',
        phonetic: '/prəˈdʒek.tər/',
        partOfSpeech: 'Noun',
        meaning: 'Proyektor',
        example: 'The teacher showed a science documentary using the projector.',
        exampleTranslation: 'Guru menayangkan dokumenter sains menggunakan proyektor.',
      },
      {
        id: 'v-sd5-v4',
        word: 'Wireless',
        phonetic: '/ˈwaɪr.ləs/',
        partOfSpeech: 'Adjective',
        meaning: 'Nirkabel / Tanpa kabel',
        example: 'Connect your tablet to the wireless internet.',
        exampleTranslation: 'Hubungkan tabletmu ke internet nirkabel.',
      },
      {
        id: 'v-sd5-v5',
        word: 'Download',
        phonetic: '/ˌdaʊnˈloʊd/',
        partOfSpeech: 'Verb',
        meaning: 'Mengunduh berkas',
        example: 'We downloaded the English worksheet from the school portal.',
        exampleTranslation: 'Kami mengunduh lembar kerja bahasa Inggris dari portal sekolah.',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-sd5-v1',
        speaker: 'Hamzah',
        text: 'Where can I find the English listening audio?',
        translation: 'Di mana saya bisa menemukan audio listening bahasa Inggris?',
      },
      {
        id: 'd-sd5-v2',
        speaker: 'Teacher',
        text: 'You can download it from the class Google Drive folder.',
        translation: 'Kamu dapat mengunduhnya dari folder Google Drive kelas.',
      },
    ],
    keyPoints: [
      "Bedakan antara 'Download' (mengambil file dari internet) dan 'Upload' (mengirim file ke internet).",
      'Selalu gunakan internet secara sehat dan dalam pengawasan guru/orang tua.',
    ],
    tips: [
      'Hafalkan fungsi masing-masing komponen komputer dengan mengamati perangkat di laboratorium sekolah!',
    ],
    updatedAt: new Date().toISOString(),
  },

  // --- SD 6: EXPRESSION MATERIAL ---
  {
    id: 'mat-topic-sd6-expr-suggestion',
    topicId: 'topic-sd6-expr-suggestion',
    summary:
      'Memberikan saran solutif dan rekomendasi yang sopan menggunakan modal verb (Should, Why don’t we, How about, Let’s).',
    contentMarkdown: `### 💡 Memberikan Saran & Rekomendasi (Giving Suggestions & Advice)
Dalam kehidupan sehari-hari, kita sering memberi masukan bermanfaat ketika teman menghadapi kesulitan belajar atau merencanakan kegiatan.

#### 1. Rumus & Pola Ungkapan Saran:
* **You should + Verb 1 ...** (Kamu sebaiknya ...)
  - *Example:* **You should review the grammar rules before the test.** (Kamu sebaiknya mengulang aturan tata bahasa sebelum ujian.)
* **Why don't we + Verb 1 ... ?** (Mengapa kita tidak ... ?)
  - *Example:* **Why don't we practice dialogue speaking together?**
* **How about + Verb-ing ... ?** (Bagaimana kalau ... ?)
  - *Example:* **How about reading an English storybook this evening?**
* **Let's + Verb 1 ...** (Mari kita ...)
  - *Example:* **Let's organize the library books neatly.**

---

#### 2. Menanggapi Saran (Responding to Suggestions):
* **Accepting:** That sounds like a wonderful plan! / Good idea!
* **Declining politely:** I'd love to, but I have another schedule.`,
    vocabularyList: [
      {
        id: 'v-sd6-e1',
        word: 'Suggestion',
        phonetic: '/səˈdʒes.tʃən/',
        partOfSpeech: 'Noun',
        meaning: 'Saran / Usulan',
        example: 'Thank you for your helpful suggestion.',
        exampleTranslation: 'Terima kasih atas saranmu yang sangat membantu.',
      },
      {
        id: 'v-sd6-e2',
        word: 'Recommend',
        phonetic: '/ˌrek.əˈmend/',
        partOfSpeech: 'Verb',
        meaning: 'Merekomendasikan / Menganjurkan',
        example: 'I recommend this inspiring encyclopedia.',
        exampleTranslation: 'Saya merekomendasikan ensiklopedia yang menginspirasi ini.',
      },
      {
        id: 'v-sd6-e3',
        word: 'Review',
        phonetic: '/rɪˈvjuː/',
        partOfSpeech: 'Verb',
        meaning: 'Mengulang kaji / Memeriksa kembali',
        example: 'We should review our notes before the exam.',
        exampleTranslation: 'Kita sebaiknya mengulang kaji catatan kita sebelum ujian.',
      },
      {
        id: 'v-sd6-e4',
        word: 'Constructive',
        phonetic: '/kənˈstrʌk.tɪv/',
        partOfSpeech: 'Adjective',
        meaning: 'Membangun / Positif',
        example: 'Teachers always provide constructive advice.',
        exampleTranslation: 'Guru selalu memberikan nasihat yang membangun.',
      },
      {
        id: 'v-sd6-e5',
        word: 'Solution',
        phonetic: '/səˈluː.ʃən/',
        partOfSpeech: 'Noun',
        meaning: 'Solusi / Jalan keluar',
        example: 'We found the best solution together.',
        exampleTranslation: 'Kami menemukan solusi terbaik bersama-sama.',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-sd6-e1',
        speaker: 'Bilal',
        text: 'I find it hard to memorize new English vocabulary.',
        translation: 'Saya merasa kesulitan menghafal kosakata baru bahasa Inggris.',
      },
      {
        id: 'd-sd6-e2',
        speaker: 'Yusuf',
        text: 'How about making colorful flashcards? It makes memorizing so fun!',
        translation: 'Bagaimana kalau membuat kartu bergambar warna-warni? Itu membuat hafalan jadi seru!',
      },
    ],
    keyPoints: [
      "Setelah 'should' dan 'why don't we', gunakan Verb bentuk dasar (Infinitive tanpa to).",
      "Setelah 'how about' atau 'what about', gunakan kata kerja berakhiran -ing (Gerund).",
    ],
    tips: [
      'Gunakan nada bicara yang bersahabat agar saranmu diterima dengan lapang dada!',
    ],
    updatedAt: new Date().toISOString(),
  },

  // --- SD 6: VOCABULARY MATERIAL ---
  {
    id: 'mat-topic-sd6-vocab-travel',
    topicId: 'topic-sd6-vocab-travel',
    summary:
      'Kosakata lengkap tentang moda transportasi, stasiun, bandara internasional, persiapan liburan dan wisata edukasi.',
    contentMarkdown: `### ✈️ Wisata & Moda Transportasi Dunia (Travel & Transportation)
Menjelajahi tempat-tempat baru memperluas wawasan budaya dan rasa syukur kita atas keindahan ciptaan Allah SWT.

#### 1. Tempat & Fasilitas Transportasi (Transport Hubs):
* **Airport / Departure Hall** : *Bandara / Ruang keberangkatan pesawat.*
* **Train Station / Platform** : *Stasiun kereta api / Peron tunggu.*
* **Harbor / Seaport** : *Pelabuhan kapal laut.*
* **Bus Terminal** : *Terminal bus antarkota.*

---

#### 2. Perlengkapan Perjalanan (Travel Items):
* **Boarding Pass** : *Tiket tanda masuk pesawat.*
* **Luggage / Suitcase** : *Koper / Barang bawaan.*
* **Itinerary** : *Jadwal rencana perjalanan.*
* **Passport** : *Dokumen identitas perjalanan internasional.*`,
    vocabularyList: [
      {
        id: 'v-sd6-v1',
        word: 'Luggage',
        phonetic: '/ˈlʌɡ.ɪdʒ/',
        partOfSpeech: 'Noun',
        meaning: 'Koper / Bagasi barang',
        example: 'Check your luggage before heading to the gate.',
        exampleTranslation: 'Periksalah koper bagasimu sebelum menuju pintu keberangkatan.',
      },
      {
        id: 'v-sd6-v2',
        word: 'Itinerary',
        phonetic: '/aɪˈtɪn.ə.rer.i/',
        partOfSpeech: 'Noun',
        meaning: 'Rencana jadwal perjalanan',
        example: 'Our study tour itinerary includes historical museums.',
        exampleTranslation: 'Jadwal perjalanan studi tour kami mencakup museum-museum bersejarah.',
      },
      {
        id: 'v-sd6-v3',
        word: 'Platform',
        phonetic: '/ˈplæt.fɔːrm/',
        partOfSpeech: 'Noun',
        meaning: 'Peron stasiun kereta',
        example: 'The express train arrives at platform two.',
        exampleTranslation: 'Kereta cepat tiba di peron dua.',
      },
      {
        id: 'v-sd6-v4',
        word: 'Destination',
        phonetic: '/ˌdes.təˈneɪ.ʃən/',
        partOfSpeech: 'Noun',
        meaning: 'Tujuan perjalanan / Destinasi',
        example: 'Our next destination is the ancient mosque in Demak.',
        exampleTranslation: 'Destinasi kita berikutnya adalah masjid kuno di Demak.',
      },
      {
        id: 'v-sd6-v5',
        word: 'Departure',
        phonetic: '/dɪˈpɑːr.tʃər/',
        partOfSpeech: 'Noun',
        meaning: 'Keberangkatan',
        example: 'Please check the departure board for your flight time.',
        exampleTranslation: 'Silakan periksa papan keberangkatan untuk waktu penerbanganmu.',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-sd6-v1',
        speaker: 'Officer',
        text: 'May I see your boarding pass and passport, please?',
        translation: 'Bolehkah saya melihat boarding pass dan paspor Anda?',
      },
      {
        id: 'd-sd6-v2',
        speaker: 'Passenger',
        text: 'Sure, here they are. Which gate should I go to?',
        translation: 'Tentu, ini dia. Menuju pintu gerbang keberangkatan yang mana saya harus pergi?',
      },
    ],
    keyPoints: [
      "Perhatikan perbedaan 'Departure' (keberangkatan) dan 'Arrival' (kedatangan).",
      'Bawa selalu dokumen penting di dalam tas jinjing yang mudah dijangkau.',
    ],
    tips: [
      'Gunakan peta atau aplikasi panduan saat mengunjungi tempat wisata baru agar tidak tersesat!',
    ],
    updatedAt: new Date().toISOString(),
  },
];

const newQuestions = [
  // === 5 QUESTIONS FOR SD 4: DIALOGUE ===
  {
    id: 'q-sd4-dial-1',
    topicId: 'topic-sd4-dial-classroom',
    levelId: 'sd-4',
    categoryId: 'dialogue',
    questionNumber: 1,
    questionText: 'Farhan: "Do you have a spare pencil, Aisyah?" What is the meaning of "spare pencil"?',
    optionA: 'Pensil baru yang mahal',
    optionB: 'Pensil cadangan / ekstra',
    optionC: 'Pensil yang sudah patah',
    optionD: 'Pensil warna-warni',
    correctAnswer: 'B',
    explanation: 'Kata "spare pencil" berarti pensil cadangan atau ekstra yang disimpan untuk berjaga-jaga.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-dial-2',
    topicId: 'topic-sd4-dial-classroom',
    levelId: 'sd-4',
    categoryId: 'dialogue',
    questionNumber: 2,
    questionText: 'Why did Farhan need to borrow a pencil from Aisyah?',
    optionA: 'He left his bag at home',
    optionB: 'His pencil was broken',
    optionC: 'He did not want to write',
    optionD: 'He wanted to give it to the teacher',
    correctAnswer: 'B',
    explanation: 'Dalam percakapan, Farhan mengatakan: "Mine is broken" (pensil saya patah).',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-dial-3',
    topicId: 'topic-sd4-dial-classroom',
    levelId: 'sd-4',
    categoryId: 'dialogue',
    questionNumber: 3,
    questionText: 'What phrase does Aisyah say when handing the pencil to Farhan?',
    optionA: '"Here is a sharp HB pencil you can use."',
    optionB: '"Go buy your own pencil outside."',
    optionC: '"I do not have any pencil."',
    optionD: '"Do not talk to me now."',
    correctAnswer: 'A',
    explanation: 'Aisyah meminjamkan pensil dengan ramah: "Here is a sharp HB pencil you can use."',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-dial-4',
    topicId: 'topic-sd4-dial-classroom',
    levelId: 'sd-4',
    categoryId: 'dialogue',
    questionNumber: 4,
    questionText: 'What school subject assignment are Farhan and Aisyah working on together?',
    optionA: 'Math calculation test',
    optionB: 'Science plant diagram drawing',
    optionC: 'Physical running race',
    optionD: 'History essay writing',
    correctAnswer: 'B',
    explanation: 'Mereka bekerja sama mewarnai diagram tumbuhan sains (science plant diagram).',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-dial-5',
    topicId: 'topic-sd4-dial-classroom',
    levelId: 'sd-4',
    categoryId: 'dialogue',
    questionNumber: 5,
    questionText: 'How should you respond when a classmate shares their learning materials with you?',
    optionA: 'Ignore them and walk away',
    optionB: 'Say "Thank you so much" politely',
    optionC: 'Take everything without asking',
    optionD: 'Complain about the colors',
    correctAnswer: 'B',
    explanation: 'Selalu ucapkan terima kasih dengan sopan ("Thank you so much") saat teman meminjamkan perlengkapan belajar.',
    createdAt: new Date().toISOString(),
  },

  // === 5 QUESTIONS FOR SD 4: SPEECH ===
  {
    id: 'q-sd4-speech-1',
    topicId: 'topic-sd4-speech-health',
    levelId: 'sd-4',
    categoryId: 'speech',
    questionNumber: 1,
    questionText: 'What is the main purpose of the student speech about healthy habits?',
    optionA: 'To tell a funny fairy tale story',
    optionB: 'To encourage classmates to maintain daily health and cleanliness',
    optionC: 'To explain rules of playing video games',
    optionD: 'To sell expensive sports shoes',
    correctAnswer: 'B',
    explanation: 'Pidato tersebut bertujuan mengajak teman sekelas memelihara kesehatan dan kebersihan setiap hari.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-speech-2',
    topicId: 'topic-sd4-speech-health',
    levelId: 'sd-4',
    categoryId: 'speech',
    questionNumber: 2,
    questionText: 'According to the speech, when should students wash their hands with soap?',
    optionA: 'Only when going to sleep',
    optionB: 'Before eating and after playing outdoors',
    optionC: 'Only on Sunday morning',
    optionD: 'Never wash hands with water',
    correctAnswer: 'B',
    explanation: 'Dalam pidato disebutkan: "Wash our hands with soap before eating and after playing outdoors."',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-speech-3',
    topicId: 'topic-sd4-speech-health',
    levelId: 'sd-4',
    categoryId: 'speech',
    questionNumber: 3,
    questionText: 'Why is eating a healthy breakfast important before going to school?',
    optionA: 'It makes you sleepy during class',
    optionB: 'It provides energy for studying and thinking',
    optionC: 'It takes too much time in the morning',
    optionD: 'It makes school bags heavier',
    correctAnswer: 'B',
    explanation: 'Sarapan sehat memberikan energi untuk belajar dan berpikir di sekolah.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-speech-4',
    topicId: 'topic-sd4-speech-health',
    levelId: 'sd-4',
    categoryId: 'speech',
    questionNumber: 4,
    questionText: 'Which phrase from the speech means "Tubuh yang sehat menjadikan siswa cerdas dan bahagia"?',
    optionA: '"A healthy body makes a smart and happy student!"',
    optionB: '"Good morning teachers and my classmates."',
    optionC: '"Drink plenty of sweet soda every hour."',
    optionD: '"Thank you for listening to my music."',
    correctAnswer: 'A',
    explanation: '"A healthy body makes a smart and happy student!" adalah terjemahan tepat dari kalimat tersebut.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-speech-5',
    topicId: 'topic-sd4-speech-health',
    levelId: 'sd-4',
    categoryId: 'speech',
    questionNumber: 5,
    questionText: 'What is the correct English word for "kebiasaan"?',
    optionA: 'Habit',
    optionB: 'Soap',
    optionC: 'Desk',
    optionD: 'Clock',
    correctAnswer: 'A',
    explanation: 'Kata "kebiasaan" dalam bahasa Inggris adalah "Habit".',
    createdAt: new Date().toISOString(),
  },

  // === 5 QUESTIONS FOR SD 5: EXPRESSION ===
  {
    id: 'q-sd5-expr-1',
    topicId: 'topic-sd5-expr-agreement',
    levelId: 'sd-5',
    categoryId: 'expression',
    questionNumber: 1,
    questionText: 'Hasan: "I think we should plant flowers in front of our class." Umar: "I totally agree with you!" What does Umar express?',
    optionA: 'He is angry with Hasan',
    optionB: 'He completely agrees with Hasan\'s opinion',
    optionC: 'He wants to go home immediately',
    optionD: 'He refuses to help Hasan',
    correctAnswer: 'B',
    explanation: '"I totally agree with you" menyatakan persetujuan secara penuh (Agreement).',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-expr-2',
    topicId: 'topic-sd5-expr-agreement',
    levelId: 'sd-5',
    categoryId: 'expression',
    questionNumber: 2,
    questionText: 'Which of the following is a polite way to express disagreement?',
    optionA: 'Your idea is completely stupid!',
    optionB: 'I see your point, but I think we have a safer option.',
    optionC: 'Stop talking right now!',
    optionD: 'I will never listen to your voice.',
    correctAnswer: 'B',
    explanation: '"I see your point, but I think..." adalah cara santun dan beradab dalam menyatakan perbedaan pendapat.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-expr-3',
    topicId: 'topic-sd5-expr-agreement',
    levelId: 'sd-5',
    categoryId: 'expression',
    questionNumber: 3,
    questionText: 'Complete the sentence: "In my ..., reading Quran after Subuh brings great tranquility."',
    optionA: 'opinion',
    optionB: 'agree',
    optionC: 'refuse',
    optionD: 'disagree',
    correctAnswer: 'A',
    explanation: 'Frasa yang baku untuk mengawali pendapat adalah "In my opinion" (menurut pendapat saya).',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-expr-4',
    topicId: 'topic-sd5-expr-agreement',
    levelId: 'sd-5',
    categoryId: 'expression',
    questionNumber: 4,
    questionText: 'What is the Indonesian meaning of "We reached a mutual consensus"?',
    optionA: 'Kami bertengkar tanpa henti',
    optionB: 'Kami mencapai mufakat bersama',
    optionC: 'Kami membatalkan seluruh rapat',
    optionD: 'Kami pulang ke rumah masing-masing',
    correctAnswer: 'B',
    explanation: '"Mutual consensus" berarti kesepakatan bersama / mufakat.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-expr-5',
    topicId: 'topic-sd5-expr-agreement',
    levelId: 'sd-5',
    categoryId: 'expression',
    questionNumber: 5,
    questionText: 'Which phrase expresses strong agreement?',
    optionA: 'You are absolutely right!',
    optionB: 'I am not sure about that.',
    optionC: 'I doubt your story.',
    optionD: 'That is impossible.',
    correctAnswer: 'A',
    explanation: '"You are absolutely right!" menyatakan persetujuan yang sangat kuat dan meyakinkan.',
    createdAt: new Date().toISOString(),
  },

  // === 5 QUESTIONS FOR SD 5: VOCABULARY ===
  {
    id: 'q-sd5-vocab-1',
    topicId: 'topic-sd5-vocab-technology',
    levelId: 'sd-5',
    categoryId: 'vocabulary',
    questionNumber: 1,
    questionText: 'What device is used to project computer slides onto a large white classroom screen?',
    optionA: 'Projector',
    optionB: 'Refrigerator',
    optionC: 'Washing machine',
    optionD: 'Microwave',
    correctAnswer: 'A',
    explanation: 'Proyektor (Projector) digunakan untuk menayangkan tampilan visual ke layar lebar.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-vocab-2',
    topicId: 'topic-sd5-vocab-technology',
    levelId: 'sd-5',
    categoryId: 'vocabulary',
    questionNumber: 2,
    questionText: 'The secret combination of letters and numbers used to protect your account is called a ...',
    optionA: 'Keyboard',
    optionB: 'Password',
    optionC: 'Monitor',
    optionD: 'Mouse pad',
    correctAnswer: 'B',
    explanation: 'Kata sandi rahasia untuk mengamankan akun disebut "Password".',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-vocab-3',
    topicId: 'topic-sd5-vocab-technology',
    levelId: 'sd-5',
    categoryId: 'vocabulary',
    questionNumber: 3,
    questionText: 'What is the action of saving a file or audio from the internet onto your laptop called?',
    optionA: 'Download',
    optionB: 'Delete',
    optionC: 'Break',
    optionD: 'Shutdown',
    correctAnswer: 'A',
    explanation: 'Menyimpan/mengambil file dari internet ke perangkat disebut "Download" (mengunduh).',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-vocab-4',
    topicId: 'topic-sd5-vocab-technology',
    levelId: 'sd-5',
    categoryId: 'vocabulary',
    questionNumber: 4,
    questionText: 'Which computer component has keys with alphabet letters and numbers for typing?',
    optionA: 'Speaker',
    optionB: 'Keyboard',
    optionC: 'Webcam',
    optionD: 'Power cable',
    correctAnswer: 'B',
    explanation: 'Papan ketik dengan deretan tombol huruf dan angka adalah "Keyboard".',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-vocab-5',
    topicId: 'topic-sd5-vocab-technology',
    levelId: 'sd-5',
    categoryId: 'vocabulary',
    questionNumber: 5,
    questionText: 'What does the term "wireless" mean?',
    optionA: 'Memerlukan banyak kabel tebal',
    optionB: 'Nirkabel / Tanpa sambungan kabel fisik',
    optionC: 'Sangat lambat dan berisik',
    optionD: 'Tidak dapat terhubung ke internet',
    correctAnswer: 'B',
    explanation: '"Wireless" berarti nirkabel atau tanpa kabel fisik.',
    createdAt: new Date().toISOString(),
  },

  // === 5 QUESTIONS FOR SD 6: EXPRESSION ===
  {
    id: 'q-sd6-expr-1',
    topicId: 'topic-sd6-expr-suggestion',
    levelId: 'sd-6',
    categoryId: 'expression',
    questionNumber: 1,
    questionText: 'Zaid looks tired studying late at night. What is the best suggestion for him?',
    optionA: 'You should drink some water and take a rest now.',
    optionB: 'You should stay awake until tomorrow morning.',
    optionC: 'Why do you not play video games all night?',
    optionD: 'Do not sleep ever again.',
    correctAnswer: 'A',
    explanation: '"You should drink some water and take a rest now" adalah saran yang penuh kepedulian dan tepat sasaran.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-expr-2',
    topicId: 'topic-sd6-expr-suggestion',
    levelId: 'sd-6',
    categoryId: 'expression',
    questionNumber: 2,
    questionText: 'Complete the suggestion correctly: "Why don\'t we ... the national library this weekend?"',
    optionA: 'visit',
    optionB: 'visited',
    optionC: 'visiting',
    optionD: 'to visit',
    correctAnswer: 'A',
    explanation: 'Setelah pola "Why don\'t we", kata kerja yang digunakan adalah Verb 1 murni (bare infinitive), yaitu "visit".',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-expr-3',
    topicId: 'topic-sd6-expr-suggestion',
    levelId: 'sd-6',
    categoryId: 'expression',
    questionNumber: 3,
    questionText: 'Complete the sentence: "How about ... badminton at the school sports hall this afternoon?"',
    optionA: 'play',
    optionB: 'played',
    optionC: 'playing',
    optionD: 'is play',
    correctAnswer: 'C',
    explanation: 'Setelah frasa "How about", kata kerja harus berbentuk Gerund (-ing), yaitu "playing".',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-expr-4',
    topicId: 'topic-sd6-expr-suggestion',
    levelId: 'sd-6',
    categoryId: 'expression',
    questionNumber: 4,
    questionText: 'A: "Let\'s practice our English conversation after school." B: "That sounds like a great plan!" What is speaker B doing?',
    optionA: 'Accepting the suggestion enthusiastically',
    optionB: 'Refusing the suggestion rudely',
    optionC: 'Asking for money',
    optionD: 'Leaving the room quietly',
    correctAnswer: 'A',
    explanation: '"That sounds like a great plan!" adalah respon menerima saran dengan antusias.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-expr-5',
    topicId: 'topic-sd6-expr-suggestion',
    levelId: 'sd-6',
    categoryId: 'expression',
    questionNumber: 5,
    questionText: 'What is the meaning of the word "recommend" in Indonesian?',
    optionA: 'Melarang keras',
    optionB: 'Menganjurkan / Merekomendasikan',
    optionC: 'Menghapus catatan',
    optionD: 'Menghukum murid',
    correctAnswer: 'B',
    explanation: '"Recommend" berarti menganjurkan atau merekomendasikan hal yang baik.',
    createdAt: new Date().toISOString(),
  },

  // === 5 QUESTIONS FOR SD 6: VOCABULARY ===
  {
    id: 'q-sd6-vocab-1',
    topicId: 'topic-sd6-vocab-travel',
    levelId: 'sd-6',
    categoryId: 'vocabulary',
    questionNumber: 1,
    questionText: 'What document is required as a boarding ticket to enter an airplane at the airport?',
    optionA: 'Boarding pass',
    optionB: 'Electricity bill',
    optionC: 'Library borrow card',
    optionD: 'School lunch receipt',
    correctAnswer: 'A',
    explanation: 'Tiket izin masuk pesawat terbang di bandara disebut "Boarding pass".',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-vocab-2',
    topicId: 'topic-sd6-vocab-travel',
    levelId: 'sd-6',
    categoryId: 'vocabulary',
    questionNumber: 2,
    questionText: 'The waiting area where passengers get on and off a train at the railway station is called a ...',
    optionA: 'Cockpit',
    optionB: 'Platform',
    optionC: 'Kitchen',
    optionD: 'Garage',
    correctAnswer: 'B',
    explanation: 'Peron stasiun tempat naik dan turun penumpang kereta api adalah "Platform".',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-vocab-3',
    topicId: 'topic-sd6-vocab-travel',
    levelId: 'sd-6',
    categoryId: 'vocabulary',
    questionNumber: 3,
    questionText: 'What is an "Itinerary" in the context of traveling and study tours?',
    optionA: 'A schedule and plan of the journey',
    optionB: 'A type of fast food eaten on airplanes',
    optionC: 'A heavy luggage bag',
    optionD: 'A broken vehicle engine',
    correctAnswer: 'A',
    explanation: '"Itinerary" adalah rencana atau susunan jadwal perjalanan.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-vocab-4',
    topicId: 'topic-sd6-vocab-travel',
    levelId: 'sd-6',
    categoryId: 'vocabulary',
    questionNumber: 4,
    questionText: 'Which English word refers to suitcases and bags carried during a holiday trip?',
    optionA: 'Luggage',
    optionB: 'Traffic',
    optionC: 'Bridge',
    optionD: 'Tunnel',
    correctAnswer: 'A',
    explanation: '"Luggage" berarti koper atau barang bawaan bagasi.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-vocab-5',
    topicId: 'topic-sd6-vocab-travel',
    levelId: 'sd-6',
    categoryId: 'vocabulary',
    questionNumber: 5,
    questionText: 'What is the opposite of "Departure" on the airport flight information board?',
    optionA: 'Arrival',
    optionB: 'Luggage',
    optionC: 'Ticket',
    optionD: 'Passport',
    correctAnswer: 'A',
    explanation: 'Lawan kata dari "Departure" (keberangkatan) adalah "Arrival" (kedatangan).',
    createdAt: new Date().toISOString(),
  },
];

// Merge topics
newTopics.forEach((nt) => {
  const existingIdx = data.topics.findIndex((t) => t.id === nt.id);
  if (existingIdx >= 0) {
    data.topics[existingIdx] = nt;
  } else {
    data.topics.push(nt);
  }
});

// Merge materials
newMaterials.forEach((nm) => {
  const existingIdx = data.learning_materials.findIndex((m) => m.topicId === nm.topicId);
  if (existingIdx >= 0) {
    data.learning_materials[existingIdx] = nm;
  } else {
    data.learning_materials.push(nm);
  }
});

// Merge questions
const newTopicIds = new Set(newTopics.map((t) => t.id));
data.questions = data.questions.filter((q) => !newTopicIds.has(q.topicId));
data.questions.push(...newQuestions);

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('Successfully seeded all Dialogue and Speech materials & questions across grades!');
