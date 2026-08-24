const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/alkarim_db.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 1. Verify/update Umi Imel user
let umi = data.users.find(
  (u) =>
    (u.username || '').toLowerCase().includes('imel') ||
    (u.name || '').toLowerCase().includes('imel')
);

if (!umi) {
  umi = {
    id: 'user-guru-imel',
    username: 'umiimel',
    name: 'Umi Imel, S.Pd.',
    role: 'teacher',
    email: 'imel@alkarim.sch.id',
    nip: '199203152018022003',
    assignedLevelIds: ['sd-4', 'sd-5', 'sd-6'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
    password: 'guru123',
    status: 'active',
  };
  data.users.push(umi);
} else {
  // Ensure assigned levels include sd-4, sd-5, sd-6
  const requiredLevels = ['sd-4', 'sd-5', 'sd-6'];
  umi.assignedLevelIds = Array.from(new Set([...(umi.assignedLevelIds || []), ...requiredLevels]));
}

console.log('Umi Imel user verified:', umi.username, umi.name, umi.assignedLevelIds);

// 2. The 4 requested categories
// 1. Expression (sd-4)
// 2. Vocabulary (sd-4)
// 3. Dialogue (sd-5)
// 4. Speech (sd-6)

const newTopics = [
  {
    id: 'topic-sd4-expr-permission',
    levelId: 'sd-4',
    categoryId: 'expression',
    title: 'Polite Expressions: Asking & Giving Permission',
    theme: 'Polite Manners & Courtesy in Daily Life',
    description:
      'Mempelajari cara meminta izin (Asking Permission) dan memberikan tanggapan secara santun dalam lingkungan sekolah dan rumah.',
    order: 1,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'topic-sd4-vocab-occupations',
    levelId: 'sd-4',
    categoryId: 'vocabulary',
    title: 'Community Helpers & Daily Occupations',
    theme: 'Professions, Workplaces, and Good Deeds',
    description:
      'Mengenal aneka profesi/pekerjaan, tempat kerja, serta peralatan kerja yang digunakan untuk melayani masyarakat.',
    order: 2,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'topic-sd5-dial-weekend',
    levelId: 'sd-5',
    categoryId: 'dialogue',
    title: 'Weekend Activities & Favorite Hobbies',
    theme: 'Talking About Leisure Time & Outdoor Adventures',
    description:
      'Percakapan interaktif tentang aktivitas akhir pekan, kegemaran hobi, dan merencanakan kegiatan seru bersama teman.',
    order: 1,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'topic-sd6-speech-nature',
    levelId: 'sd-6',
    categoryId: 'speech',
    title: 'Short Speech: Protecting Our Earth & School Environment',
    theme: 'Environmental Awareness, Cleanliness, and Tree Planting',
    description:
      'Belajar menyampaikan pidato singkat bertema kepedulian lingkungan, memilah sampah plastik, dan menanam pohon di sekolah.',
    order: 1,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const newMaterials = [
  {
    id: 'mat-topic-sd4-expr-permission',
    topicId: 'topic-sd4-expr-permission',
    summary:
      'Panduan lengkap ungkapan meminta dan memberi izin (May I...?, Can I...?) secara sopan beserta etika menjawabnya dalam kehidupan sehari-hari.',
    contentMarkdown: `### 🌟 Ungkapan Meminta Izin (Asking for Permission)
Dalam kehidupan sehari-hari, baik di kelas maupun di rumah, kita sering kali perlu meminta izin sebelum melakukan sesuatu atau meminjam barang orang lain.

#### 1. Cara Meminta Izin (Asking for Permission):
* **May I ... ?** (Bolehkah saya ... ?) — *Bentuk sangat sopan dan formal, tepat digunakan kepada guru, orang tua, atau orang yang lebih tua.*
  - *Example:* **May I borrow your ruler, please?** (Bolehkah saya meminjam penggarismu?)
  - *Example:* **May I wash my hands, Ma'am?** (Bolehkah saya mencuci tangan, Bu Guru?)
* **Can I ... ? / Could I ... ?** (Bisakah / Bolehkah saya ... ?) — *Digunakan dalam situasi santai dengan teman sebaya.*
  - *Example:* **Can I sit here?** (Bolehkah aku duduk di sini?)
  - *Example:* **Could I use your eraser for a moment?** (Bolehkah aku menggunakan penghapusmu sebentar?)
* **Do you mind if I ... ?** (Apakah Anda keberatan jika saya ... ?)

---

#### 2. Memberikan Izin (Giving Permission):
Jika kita mengizinkan, kita dapat merespons dengan ramah:
* **Yes, of course.** (Ya, tentu saja.)
* **Sure, go ahead!** (Tentu, silakan!)
* **Certainly, here you are.** (Tentu, ini dia.)
* **No problem at all.** (Sama sekali tidak masalah.)

---

#### 3. Menolak Izin Secara Sopan (Refusing Permission):
Jika barang sedang dipakai atau kita belum bisa memberi izin, tolaklah dengan santun:
* **I'm sorry, but I'm still using it.** (Maaf, tapi aku masih menggunakannya.)
* **I'm afraid you can't right now.** (Sayang sekali belum bisa sekarang.)`,
    vocabularyList: [
      {
        id: 'v-p1',
        word: 'Permission',
        phonetic: '/pərˈmɪʃ.ən/',
        partOfSpeech: 'Noun',
        meaning: 'Izin / Persetujuan',
        example: 'You must ask for permission before entering.',
        exampleTranslation: 'Kamu harus meminta izin sebelum masuk.',
      },
      {
        id: 'v-p2',
        word: 'Borrow',
        phonetic: '/ˈbɑːr.oʊ/',
        partOfSpeech: 'Verb',
        meaning: 'Meminjam',
        example: 'May I borrow your storybook?',
        exampleTranslation: 'Bolehkah saya meminjam buku ceritamu?',
      },
      {
        id: 'v-p3',
        word: 'Polite',
        phonetic: '/pəˈlaɪt/',
        partOfSpeech: 'Adjective',
        meaning: 'Sopan / Santun',
        example: 'Always use polite words when speaking to elders.',
        exampleTranslation: 'Selalu gunakan kata-kata sopan saat berbicara kepada yang lebih tua.',
      },
      {
        id: 'v-p4',
        word: 'Restroom',
        phonetic: '/ˈrest.ruːm/',
        partOfSpeech: 'Noun',
        meaning: 'Kamar kecil / Toilet',
        example: 'May I go to the restroom, Sir?',
        exampleTranslation: 'Bolehkah saya pergi ke kamar kecil, Pak?',
      },
      {
        id: 'v-p5',
        word: 'Certainly',
        phonetic: '/ˈsɜːr.tən.li/',
        partOfSpeech: 'Adverb',
        meaning: 'Tentu saja / Pasti',
        example: 'Certainly, you can take this seat.',
        exampleTranslation: 'Tentu saja, kamu boleh menempati kursi ini.',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-p1',
        speaker: 'Rian',
        text: 'Excuse me, Ustadzah. May I drink some water?',
        translation: 'Permisi, Ustadzah. Bolehkah saya minum air?',
      },
      {
        id: 'd-p2',
        speaker: 'Ustadzah',
        text: 'Sure, Rian. Go ahead and drink while sitting down.',
        translation: 'Tentu, Rian. Silakan minum sambil duduk.',
      },
      {
        id: 'd-p3',
        speaker: 'Zahra',
        text: 'Hana, can I borrow your color pencils?',
        translation: 'Hana, bisakah aku meminjam pensil warnamu?',
      },
      {
        id: 'd-p4',
        speaker: 'Hana',
        text: 'Of course, Zahra! Here they are. Please take care of them.',
        translation: 'Tentu, Zahra! Ini dia. Tolong dijaga dengan baik ya.',
      },
    ],
    keyPoints: [
      "Gunakan kata 'May I' untuk menunjukkan kesopanan tinggi saat meminta izin kepada guru atau orang tua.",
      "Selalu tambahkan kata 'please' di akhir kalimat permohonan agar terdengar lebih santun.",
      "Saat menolak izin, awali dengan kata maaf ('I am sorry') agar lawan bicara tidak merasa tersinggung.",
    ],
    tips: [
      "Ucapkan kata 'Thank you' setelah seseorang mengizinkanmu melakukan sesuatu atau meminjamkan barangnya!",
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-topic-sd4-vocab-occupations',
    topicId: 'topic-sd4-vocab-occupations',
    summary:
      'Mengenal aneka profesi mulia di masyarakat (Doctor, Teacher, Firefighter, Pilot, Farmer, Chef) beserta tempat kerja dan tugasnya.',
    contentMarkdown: `### 👨‍⚕️ Mengenal Profesi dan Pekerjaan (Occupations)
Setiap profesi memiliki peran yang sangat penting dalam membantu masyarakat dan memajukan peradaban.

#### 1. Daftar Profesi dan Tugasnya:
* **Doctor** (Dokter) : *Treats sick people and helps them get healthy.*
* **Teacher** (Guru) : *Educates students and teaches knowledge and good manners.*
* **Firefighter** (Pemadam Kebakaran) : *Puts out dangerous fires and rescues people.*
* **Pilot** (Pilot) : *Flies airplanes to transport passengers across the world.*
* **Chef** (Koki) : *Cooks delicious and healthy food in restaurants or hotels.*
* **Farmer** (Petani) : *Grows rice, vegetables, and fruits in the fields.*
* **Police Officer** (Polisi) : *Maintains safety and enforces the law.*

---

#### 2. Tempat Bekerja (Workplaces):
* Doctor & Nurse ➡️ **Hospital / Clinic**
* Teacher ➡️ **School / Classroom**
* Firefighter ➡️ **Fire Station**
* Pilot ➡️ **Airport / Cockpit**
* Chef ➡️ **Kitchen / Restaurant**
* Farmer ➡️ **Rice Field / Farm**
* Police Officer ➡️ **Police Station**`,
    vocabularyList: [
      {
        id: 'v-o1',
        word: 'Firefighter',
        phonetic: '/ˈfaɪrˌfaɪ.tər/',
        partOfSpeech: 'Noun',
        meaning: 'Petugas Pemadam Kebakaran',
        example: 'The brave firefighter saved the cat from the burning house.',
        exampleTranslation:
          'Petugas pemadam kebakaran yang berani menyelamatkan kucing dari rumah terbakar.',
      },
      {
        id: 'v-o2',
        word: 'Hospital',
        phonetic: '/ˈhɑː.spɪ.t̬əl/',
        partOfSpeech: 'Noun',
        meaning: 'Rumah Sakit',
        example: 'Doctors and nurses work tirelessly in the hospital.',
        exampleTranslation: 'Dokter dan perawat bekerja tanpa lelah di rumah sakit.',
      },
      {
        id: 'v-o3',
        word: 'Extinguish',
        phonetic: '/ɪkˈstɪŋ.ɡwɪʃ/',
        partOfSpeech: 'Verb',
        meaning: 'Memadamkan (api)',
        example: 'They used water hoses to extinguish the fire.',
        exampleTranslation: 'Mereka menggunakan selang air untuk memadamkan api.',
      },
      {
        id: 'v-o4',
        word: 'Harvest',
        phonetic: '/ˈhɑːr.vəst/',
        partOfSpeech: 'Verb/Noun',
        meaning: 'Memanen / Hasil Panen',
        example: 'Farmers harvest golden paddy in dry season.',
        exampleTranslation: 'Petani memanen padi menguning di musim kemarau.',
      },
      {
        id: 'v-o5',
        word: 'Passenger',
        phonetic: '/ˈpæs.ən.dʒər/',
        partOfSpeech: 'Noun',
        meaning: 'Penumpang',
        example: 'The pilot welcomed all passengers on board.',
        exampleTranslation: 'Pilot menyambut semua penumpang di dalam pesawat.',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-o1',
        speaker: 'Hasan',
        text: 'What does your father do, Tariq?',
        translation: 'Apa pekerjaan ayahmu, Tariq?',
      },
      {
        id: 'd-o2',
        speaker: 'Tariq',
        text: 'My father is a firefighter. He helps extinguish fires and rescue people.',
        translation:
          'Ayahku adalah petugas pemadam kebakaran. Beliau membantu memadamkan api dan menyelamatkan orang.',
      },
    ],
    keyPoints: [
      "Gunakan artikel 'a' untuk profesi berawalan bunyi konsonan (a teacher, a doctor, a pilot).",
      "Gunakan artikel 'an' untuk profesi berawalan bunyi vokal (an architect, an engineer, an astronaut).",
    ],
    tips: [
      'Ingatlah pasangan profesi dengan tempat kerjanya untuk mempermudah mengingat kosakata baru!',
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-topic-sd5-dial-weekend',
    topicId: 'topic-sd5-dial-weekend',
    summary:
      'Percakapan interaktif membahas rencana liburan akhir pekan (Weekend Plans) dan saling menceritakan hobi favorit.',
    contentMarkdown: `### 🗣️ Percakapan: Rencana Akhir Pekan & Hobi (Weekend Plans & Hobbies)
Menceritakan kegiatan yang disukai saat waktu luang adalah cara yang menyenangkan untuk menjalin keakraban dengan teman.

#### 1. Pola Pertanyaan yang Sering Digunakan:
* **What are you going to do this weekend?** (Apa yang akan kamu lakukan akhir pekan ini?)
* **What is your favorite hobby?** (Apa hobi kegemaranmu?)
* **How do you spend your Sunday morning?** (Bagaimana kamu menghabiskan Minggu pagimu?)
* **Would you like to join me for cycling?** (Maukah kamu ikut bersepeda denganku?)

---

#### 2. Teks Percakapan Interaktif (Interactive Dialogue):
**Salma**: "Assalamu'alaikum, Nadia! Do you have any plans for this Saturday?"  
**Nadia**: "Wa'alaikumussalam, Salma! Yes, I am going to help my mother bake banana muffins and do some gardening."  
**Salma**: "That sounds so exciting! What kinds of plants do you grow?"  
**Nadia**: "We grow fresh mint leaves, chili peppers, and orchids in our backyard. How about you?"  
**Salma**: "I am planning to practice archery with my brother at the community sports center."  
**Nadia**: "Wow, archery is a wonderful Sunnah sport! Have a great time, Salma!"  
**Salma**: "Thank you, Nadia! Enjoy your weekend as well."`,
    vocabularyList: [
      {
        id: 'v-w1',
        word: 'Backyard',
        phonetic: '/ˈbæk.jɑːrd/',
        partOfSpeech: 'Noun',
        meaning: 'Halaman belakang rumah',
        example: 'We planted sunflowers in our sunny backyard.',
        exampleTranslation: 'Kami menanam bunga matahari di halaman belakang yang cerah.',
      },
      {
        id: 'v-w2',
        word: 'Gardening',
        phonetic: '/ˈɡɑːr.dən.ɪŋ/',
        partOfSpeech: 'Noun',
        meaning: 'Berkebun',
        example: 'Gardening makes me feel relaxed and peaceful.',
        exampleTranslation: 'Berkebun membuatku merasa rileks dan tenang.',
      },
      {
        id: 'v-w3',
        word: 'Archery',
        phonetic: '/ˈɑːr.tʃər.i/',
        partOfSpeech: 'Noun',
        meaning: 'Memanah',
        example: 'Archery requires deep focus and steady hands.',
        exampleTranslation: 'Memanah membutuhkan fokus yang dalam dan tangan yang tenang.',
      },
      {
        id: 'v-w4',
        word: 'Exciting',
        phonetic: '/ɪkˈsaɪ.tɪŋ/',
        partOfSpeech: 'Adjective',
        meaning: 'Mengasyikkan / Menyenangkan',
        example: 'Riding bicycles around the green park was exciting.',
        exampleTranslation: 'Mengendarai sepeda keliling taman hijau sangat mengasyikkan.',
      },
      {
        id: 'v-w5',
        word: 'Spend',
        phonetic: '/spend/',
        partOfSpeech: 'Verb',
        meaning: 'Menghabiskan (waktu / uang)',
        example: 'How do you spend your holiday?',
        exampleTranslation: 'Bagaimana kamu menghabiskan hari liburmu?',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-w1',
        speaker: 'Salma',
        text: 'Do you have any plans for this Saturday, Nadia?',
        translation: 'Apakah kamu punya rencana untuk hari Sabtu ini, Nadia?',
      },
      {
        id: 'd-w2',
        speaker: 'Nadia',
        text: 'Yes, I am going to help my mother bake muffins and do some gardening.',
        translation: 'Ya, aku akan membantu ibuku membuat kue muffin dan berkebun.',
      },
    ],
    keyPoints: [
      "Gunakan frasa 'I am going to + Verb' untuk menyatakan rencana kegiatan yang sudah pasti dijadwalkan.",
      "Kata kerja setelah 'like', 'love', atau 'enjoy' berbentuk gerund (-ing), misalnya: I enjoy baking.",
    ],
    tips: ['Latihlah dialog dengan intonasi natural bersama teman sebangkumu!'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat-topic-sd6-speech-nature',
    topicId: 'topic-sd6-speech-nature',
    summary:
      'Panduan membawakan naskah pidato singkat persuasif tentang menjaga kelestarian alam dan kebersihan lingkungan sekolah.',
    contentMarkdown: `### 📢 Pidato Singkat: Menjaga Kelestarian Alam Sekolah (Protecting Our Earth)
Berbicara di depan umum (Public Speaking) adalah keterampilan berharga untuk menyampaikan pesan kebaikan kepada orang banyak.

#### 1. Struktur Teks Pidato (Speech Structure):
1. **Opening & Greeting (Pembuka & Salam)**: Menyapa para hadirin secara terhormat.
2. **Main Message (Isi Pidato)**: Menjelaskan kondisi lingkungan dan pentingnya menjaga kebersihan.
3. **Call to Action (Ajakan Bertindak)**: Mengajak teman-teman melakukan langkah nyata seperti memilah sampah dan menghemat air.
4. **Conclusion & Closing (Penutup)**: Menyampaikan harapan dan ucapan terima kasih.

---

#### 2. Naskah Pidato Lengkap (Full Speech Script):
*"Assalamu'alaikum warahmatullahi wabarakatuh,*\n*Honorable teachers and my beloved friends,*\n\n*First of all, let us express our gratitude to Allah SWT for giving us health and blessing today.*\n\n*Today, I stand before you to talk about our precious planet Earth. Nature gives us clean oxygen to breathe, clear water to drink, and fertile soil to grow food. However, plastic pollution and littering threaten our environment every day.*\n\n*My dear friends, change begins with us in our own school. Let us take three simple steps:*\n1. **Reduce single-use plastic bottles and carry our own tumblers.**\n2. **Dispose of trash in the correct recycling bins.**\n3. **Plant more green trees and care for our school garden.**\n\n*Remember: a small action from each of us creates a big difference for our future.*\n\n*Thank you very much for your kind attention. Wassalamu'alaikum warahmatullahi wabarakatuh."*`,
    vocabularyList: [
      {
        id: 'v-s1',
        word: 'Precious',
        phonetic: '/ˈpreʃ.əs/',
        partOfSpeech: 'Adjective',
        meaning: 'Sangat berharga / bernilai',
        example: 'Clean water is a precious gift from nature.',
        exampleTranslation: 'Air bersih adalah anugerah yang sangat berharga dari alam.',
      },
      {
        id: 'v-s2',
        word: 'Pollution',
        phonetic: '/pəˈluː.ʃən/',
        partOfSpeech: 'Noun',
        meaning: 'Polusi / Pencemaran',
        example: 'We must fight against plastic pollution in our rivers.',
        exampleTranslation: 'Kita harus melawan pencemaran plastik di sungai kita.',
      },
      {
        id: 'v-s3',
        word: 'Dispose of',
        phonetic: '/dɪˈspoʊz əv/',
        partOfSpeech: 'Verb Phrase',
        meaning: 'Membuang / Menyingkirkan',
        example: 'Always dispose of garbage in the trash bin.',
        exampleTranslation: 'Selalu buang sampah ke dalam tempat sampah.',
      },
      {
        id: 'v-s4',
        word: 'Gratitude',
        phonetic: '/ˈɡræt̬.ə.tuːd/',
        partOfSpeech: 'Noun',
        meaning: 'Rasa syukur / Terima kasih',
        example: 'We express our gratitude to our teachers.',
        exampleTranslation: 'Kami menyampaikan rasa terima kasih kepada guru-guru kami.',
      },
      {
        id: 'v-s5',
        word: 'Fertile',
        phonetic: '/ˈfɜːr.t̬əl/',
        partOfSpeech: 'Adjective',
        meaning: 'Subur',
        example: 'The fertile soil helps plants grow quickly.',
        exampleTranslation: 'Tanah yang subur membantu tanaman tumbuh dengan cepat.',
      },
    ],
    dialogueSamples: [
      {
        id: 'd-s1',
        speaker: 'Student Speaker',
        text: 'Honorable teachers and my beloved friends, today I stand before you to talk about our precious Earth.',
        translation:
          'Bapak/Ibu guru yang saya hormati dan teman-teman terkasih, hari ini saya berdiri di hadapan Anda untuk berbicara tentang bumi kita yang berharga.',
      },
    ],
    keyPoints: [
      'Gunakan intonasi yang jelas dan kontak mata ke seluruh audiens saat berpidato.',
      'Beri jeda singkat (pause) setelah kalimat penting agar audiens dapat meresapi maknanya.',
    ],
    tips: [
      'Berdirilah tegak dengan percaya diri dan tersenyumlah saat membuka pidato!',
    ],
    updatedAt: new Date().toISOString(),
  },
];

const newQuestions = [
  // 5 Questions for Expression
  {
    id: 'q-sd4-expr-1',
    topicId: 'topic-sd4-expr-permission',
    levelId: 'sd-4',
    categoryId: 'expression',
    questionNumber: 1,
    questionText:
      'Ahmad wants to go to the toilet during English class. What should he politely say to the teacher?',
    optionA: 'May I go to the restroom, Sir?',
    optionB: 'I am going to the toilet now!',
    optionC: 'Give me permission quickly!',
    optionD: 'Where is your toilet?',
    correctAnswer: 'A',
    explanation:
      '"May I go to the restroom, Sir?" adalah ungkapan yang sangat santun dan baku untuk meminta izin kepada guru saat jam pelajaran.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-expr-2',
    topicId: 'topic-sd4-expr-permission',
    levelId: 'sd-4',
    categoryId: 'expression',
    questionNumber: 2,
    questionText:
      'Budi: "May I borrow your pencil, Dika?" Dika: "..., here it is." What is the best phrase to complete Dika\'s answer?',
    optionA: 'Never mind',
    optionB: 'Sure, of course',
    optionC: 'You cannot have it',
    optionD: "I don't know",
    correctAnswer: 'B',
    explanation:
      'Frasa "Sure, of course" digunakan untuk memberikan izin dengan ramah ketika seseorang meminjam barang.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-expr-3',
    topicId: 'topic-sd4-expr-permission',
    levelId: 'sd-4',
    categoryId: 'expression',
    questionNumber: 3,
    questionText:
      'Lina: "Can I use your eraser, Siti?" Siti: "I\'m sorry, Lina. I am still using it." What does Siti express?',
    optionA: 'Giving permission',
    optionB: 'Refusing permission politely',
    optionC: 'Asking for an apology',
    optionD: 'Greeting a classmate',
    correctAnswer: 'B',
    explanation:
      'Siti menolak permohonan izin secara sopan (Refusing permission politely) karena penghapus tersebut masih sedang digunakannya.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-expr-4',
    topicId: 'topic-sd4-expr-permission',
    levelId: 'sd-4',
    categoryId: 'expression',
    questionNumber: 4,
    questionText: 'Which of the following sentences shows an expression of asking for permission?',
    optionA: 'You must clean your desk right now.',
    optionB: 'Could I open the window, please? It is very warm here.',
    optionC: 'I am opening the window right now.',
    optionD: 'Open the window immediately!',
    correctAnswer: 'B',
    explanation:
      '"Could I open the window, please?" merupakan ungkapan meminta izin (Asking for permission) dengan santun.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-expr-5',
    topicId: 'topic-sd4-expr-permission',
    levelId: 'sd-4',
    categoryId: 'expression',
    questionNumber: 5,
    questionText: 'What is the magic word you should add to make your request sound polite?',
    optionA: 'Quickly',
    optionB: 'Please',
    optionC: 'Because',
    optionD: 'Later',
    correctAnswer: 'B',
    explanation:
      'Kata "Please" adalah kata ajaib (magic word) yang menunjukkan kesantunan saat meminta bantuan atau izin.',
    createdAt: new Date().toISOString(),
  },

  // 5 Questions for Vocabulary
  {
    id: 'q-sd4-vocab-1',
    topicId: 'topic-sd4-vocab-occupations',
    levelId: 'sd-4',
    categoryId: 'vocabulary',
    questionNumber: 1,
    questionText:
      'A person who flies airplanes and carries passengers safely across countries is called a ...',
    optionA: 'Pilot',
    optionB: 'Driver',
    optionC: 'Captain',
    optionD: 'Sailor',
    correctAnswer: 'A',
    explanation: 'Orang yang menerbangkan pesawat terbang (flies airplanes) disebut pilot.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-vocab-2',
    topicId: 'topic-sd4-vocab-occupations',
    levelId: 'sd-4',
    categoryId: 'vocabulary',
    questionNumber: 2,
    questionText: 'Where does a chef usually work to prepare delicious meals?',
    optionA: 'In a library',
    optionB: 'In a hospital ward',
    optionC: 'In a restaurant kitchen',
    optionD: 'In a police office',
    correctAnswer: 'C',
    explanation:
      'Seorang chef/koki bekerja di dapur restoran (restaurant kitchen) untuk menyiapkan masakan.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-vocab-3',
    topicId: 'topic-sd4-vocab-occupations',
    levelId: 'sd-4',
    categoryId: 'vocabulary',
    questionNumber: 3,
    questionText: 'Choose the correct article for the sentence: "My older brother is ... architect."',
    optionA: 'a',
    optionB: 'an',
    optionC: 'the',
    optionD: 'two',
    correctAnswer: 'B',
    explanation:
      "Kata 'architect' berawalan bunyi vokal /ɑːr/, sehingga artikel yang tepat adalah 'an' (an architect).",
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-vocab-4',
    topicId: 'topic-sd4-vocab-occupations',
    levelId: 'sd-4',
    categoryId: 'vocabulary',
    questionNumber: 4,
    questionText: 'Who is responsible for putting out dangerous fires in residential areas?',
    optionA: 'Postman',
    optionB: 'Firefighter',
    optionC: 'Dentist',
    optionD: 'Mechanic',
    correctAnswer: 'B',
    explanation: 'Petugas pemadam kebakaran (Firefighter) bertugas memadamkan api berbahaya.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd4-vocab-5',
    topicId: 'topic-sd4-vocab-occupations',
    levelId: 'sd-4',
    categoryId: 'vocabulary',
    questionNumber: 5,
    questionText: 'What does a farmer do in the farm?',
    optionA: 'Teaches mathematics to students',
    optionB: 'Plants vegetables, rice, and crops',
    optionC: 'Cures sick people with medicine',
    optionD: 'Directs road traffic in the morning',
    correctAnswer: 'B',
    explanation:
      'Petani (farmer) bertugas menanam padi, sayur-mayur, dan tanaman pangan (plants vegetables, rice, and crops).',
    createdAt: new Date().toISOString(),
  },

  // 5 Questions for Dialogue
  {
    id: 'q-sd5-dial-1',
    topicId: 'topic-sd5-dial-weekend',
    levelId: 'sd-5',
    categoryId: 'dialogue',
    questionNumber: 1,
    questionText: 'Based on the dialogue, what will Nadia do on Saturday morning?',
    optionA: "Play archery with Salma's brother",
    optionB: 'Help her mother bake banana muffins and do gardening',
    optionC: 'Go shopping at the modern mall',
    optionD: 'Sleep all day at home',
    correctAnswer: 'B',
    explanation:
      'Dalam dialog, Nadia mengatakan: "I am going to help my mother bake banana muffins and do some gardening."',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-dial-2',
    topicId: 'topic-sd5-dial-weekend',
    levelId: 'sd-5',
    categoryId: 'dialogue',
    questionNumber: 2,
    questionText: 'What hobby does Salma plan to practice with her brother?',
    optionA: 'Archery at the sports center',
    optionB: 'Cooking banana muffins',
    optionC: 'Planting chili peppers',
    optionD: 'Drawing watercolor paintings',
    correctAnswer: 'A',
    explanation: 'Salma berencana berlatih memanah (archery) bersama saudara laki-lakinya.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-dial-3',
    topicId: 'topic-sd5-dial-weekend',
    levelId: 'sd-5',
    categoryId: 'dialogue',
    questionNumber: 3,
    questionText: 'Complete the sentence: "Farhan loves ... stamps from different countries."',
    optionA: 'collect',
    optionB: 'collected',
    optionC: 'collecting',
    optionD: 'is collect',
    correctAnswer: 'C',
    explanation:
      "Setelah kata kerja 'love/like', kata kerja yang mengikuti berbentuk gerund (-ing), yaitu 'collecting'.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-dial-4',
    topicId: 'topic-sd5-dial-weekend',
    levelId: 'sd-5',
    categoryId: 'dialogue',
    questionNumber: 4,
    questionText:
      'Kevin: "Would you like to come to my house and play chess this afternoon?" Ryan: "..." What is the most enthusiastic acceptance?',
    optionA: "I don't think so.",
    optionB: 'I would love to! That sounds fun.',
    optionC: 'No, you cannot come.',
    optionD: 'I dislike playing chess.',
    correctAnswer: 'B',
    explanation:
      '"I would love to! That sounds fun" adalah ungkapan menerima ajakan dengan sangat antusias dan ramah.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd5-dial-5',
    topicId: 'topic-sd5-dial-weekend',
    levelId: 'sd-5',
    categoryId: 'dialogue',
    questionNumber: 5,
    questionText: 'What does the word "backyard" mean in Indonesian?',
    optionA: 'Ruang tamu',
    optionB: 'Halaman belakang rumah',
    optionC: 'Kamar tidur',
    optionD: 'Dapur utama',
    correctAnswer: 'B',
    explanation: "'Backyard' berarti halaman belakang rumah.",
    createdAt: new Date().toISOString(),
  },

  // 5 Questions for Speech
  {
    id: 'q-sd6-speech-1',
    topicId: 'topic-sd6-speech-nature',
    levelId: 'sd-6',
    categoryId: 'speech',
    questionNumber: 1,
    questionText: 'What is the main topic of the speech delivered by the student?',
    optionA: 'Preparing for the final semester examination',
    optionB: 'Protecting nature and keeping the school environment clean',
    optionC: 'How to win an inter-school soccer tournament',
    optionD: 'The history of ancient inventions',
    correctAnswer: 'B',
    explanation:
      'Topik utama pidato adalah menjaga kelestarian alam dan kebersihan lingkungan sekolah (Protecting nature and keeping the school environment clean).',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-speech-2',
    topicId: 'topic-sd6-speech-nature',
    levelId: 'sd-6',
    categoryId: 'speech',
    questionNumber: 2,
    questionText:
      'According to the speech, what is one simple action students can take to reduce plastic waste?',
    optionA: 'Buy many plastic cups every day',
    optionB: 'Carry their own reusable water tumblers',
    optionC: 'Burn plastic bags behind the school',
    optionD: 'Leave trash on the playground',
    correctAnswer: 'B',
    explanation:
      'Pembicara menyarankan membawa botol minum sendiri (carry our own tumblers) untuk mengurangi sampah plastik sekali pakai.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-speech-3',
    topicId: 'topic-sd6-speech-nature',
    levelId: 'sd-6',
    categoryId: 'speech',
    questionNumber: 3,
    questionText: 'Which part of the speech contains: "Honorable teachers and my beloved friends"?',
    optionA: 'Closing remarks',
    optionB: 'Opening and greeting',
    optionC: 'Call to action',
    optionD: 'Question and answer',
    correctAnswer: 'B',
    explanation:
      '"Honorable teachers and my beloved friends" adalah bagian pembuka dan sapaan kehormatan (Opening and greeting).',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-speech-4',
    topicId: 'topic-sd6-speech-nature',
    levelId: 'sd-6',
    categoryId: 'speech',
    questionNumber: 4,
    questionText: 'What is the meaning of the word "precious" in the speech text?',
    optionA: 'Sangat berharga / bernilai tinggi',
    optionB: 'Mudah rusak',
    optionC: 'Sangat murah',
    optionD: 'Kotor dan berdebu',
    correctAnswer: 'A',
    explanation: "'Precious' berarti sangat berharga / bernilai tinggi.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-sd6-speech-5',
    topicId: 'topic-sd6-speech-nature',
    levelId: 'sd-6',
    categoryId: 'speech',
    questionNumber: 5,
    questionText:
      'What is a good public speaking habit when delivering a speech to an audience?',
    optionA: 'Looking down at the floor all the time',
    optionB: 'Speaking in a monotone whisper',
    optionC: 'Maintaining good eye contact and clear intonation',
    optionD: 'Rushing through sentences without any pause',
    correctAnswer: 'C',
    explanation:
      'Menjaga kontak mata (eye contact) yang baik dan intonasi yang jelas adalah kebiasaan public speaking yang sangat baik.',
    createdAt: new Date().toISOString(),
  },
];

// Merge into data
newTopics.forEach((nt) => {
  const existingIdx = data.topics.findIndex((t) => t.id === nt.id);
  if (existingIdx >= 0) {
    data.topics[existingIdx] = nt;
  } else {
    data.topics.push(nt);
  }
});

newMaterials.forEach((nm) => {
  const existingIdx = data.learning_materials.findIndex((m) => m.topicId === nm.topicId);
  if (existingIdx >= 0) {
    data.learning_materials[existingIdx] = nm;
  } else {
    data.learning_materials.push(nm);
  }
});

// Remove old questions for these topics if any, then insert new ones
const newTopicIds = new Set(newTopics.map((t) => t.id));
data.questions = data.questions.filter((q) => !newTopicIds.has(q.topicId));
data.questions.push(...newQuestions);

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('Successfully inserted 4 topics, 4 learning materials, and 20 questions into alkarim_db.json!');
