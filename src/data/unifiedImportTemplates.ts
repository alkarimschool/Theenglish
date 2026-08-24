export interface CategoryTemplate {
  categoryId: string;
  categoryName: string;
  iconName: string;
  description: string;
  topicSuggestion: string;
  sampleText: string;
}

export const UNIFIED_TEMPLATES: Record<string, CategoryTemplate> = {
  expression: {
    categoryId: 'expression',
    categoryName: 'Expression',
    iconName: 'Smile',
    description: 'Ungkapan komunikatif harian (Greetings, Asking for Help, Gratitude, Apology)',
    topicSuggestion: 'Greetings & Asking for Help in Daily Life',
    sampleText: `=== MATERI PEMBELAJARAN ===
Ringkasan: Pelajari ungkapan Greeting (sapaan), Asking for Help (meminta bantuan), dan ungkapan kesantunan formal & informal.

Materi:
# Expressions of Greetings & Asking for Help

## 1. Greetings (Sapaan Sehari-hari)
- **Situasi Formal (Guru / Orang Lebih Tua):**
  - "Good morning / Good afternoon / Good evening, Sir/Ma'am."
  - "How do you do?" *(Dijawab: "How do you do?")*
  - "It is an honor to meet you."
- **Situasi Informal (Teman Sebaya):**
  - "Hi! / Hello!"
  - "How are you doing?" / "What's up?" *(Dijawab: "I'm doing great, thanks!")*

## 2. Asking for Help (Meminta Bantuan)
- "Could you please give me a hand with this box?"
- "Would you mind helping me for a moment?"
- "Can you assist me with this English homework?"

## 3. Responding to Help (Merespons Bantuan)
- **Menerima:** "Sure, I'd be glad to help!" / "Certainly!"
- **Menolak dengan Sopan:** "I'm really sorry, I'm occupied right now."

=== SOAL LATIHAN ===
1. Andi meets his English teacher at 07.00 AM in front of the school library. What is the most polite greeting?
A. Good night, Sir!
B. Good morning, Sir. How are you today?
C. See you later, Mr. Budi!
D. Bye-bye, Sir!
Ans: B
Exp: Pada pukul 07.00 pagi dalam situasi formal sekolah, sapaan yang paling santun dan tepat adalah "Good morning, Sir. How are you today?".

2. Rina is carrying a stack of heavy science books. She says to her classmate: "___"
Doni: "Sure! Let me take half of them for you."
A. What are you doing here?
B. Would you mind giving me a hand?
C. I don't need any assistance.
D. Where is the canteen?
Ans: B
Exp: Respons Doni "Sure! Let me take half of them for you" menunjukkan Rina menggunakan ungkapan meminta bantuan (Asking for Help).

3. When a guest meets the school principal for the first time, he says: "How do you do?"
What is the proper response from the principal?
A. How do you do?
B. I am doing homework.
C. Goodbye and take care.
D. You are welcome.
Ans: A
Exp: Ungkapan formal pertama kali bertemu "How do you do?" dibalas dengan ungkapan yang sama: "How do you do?".`,
  },

  vocab: {
    categoryId: 'vocab',
    categoryName: 'Vocabulary',
    iconName: 'BookMarked',
    description: 'Penguasaan kosakata tematik (Daily Routines, School Objects, Nature, Food)',
    topicSuggestion: 'Daily Routines & School Life Vocabulary',
    sampleText: `=== MATERI PEMBELAJARAN ===
Ringkasan: Kosakata penting seputar kegiatan harian (Daily Routines), perlengkapan belajar, dan tempat di lingkungan sekolah.

Materi:
# Vocabulary: Daily Routines & School Life

## 1. Action Verbs (Kata Kerja Rutinitas):
- **Wake up** [verb] : Bangun tidur (*Contoh: I wake up at 05.00 AM every day.*)
- **Commute** [verb] : Bepergian ke sekolah (*Contoh: Students commute by bicycle.*)
- **Submit** [verb] : Mengumpulkan tugas (*Contoh: Please submit the report before noon.*)
- **Review** [verb] : Mengulang pelajaran (*Contoh: We review the math notes together.*)

## 2. Nouns & School Facilities (Fasilitas Sekolah):
- **Laboratory** [noun] : Laboratorium IPA/Komputer
- **Library** [noun] : Perpustakaan tempat membaca buku
- **Assignment** [noun] : Tugas / Pekerjaan rumah yang diberikan guru
- **Stationery** [noun] : Alat tulis (pensil, pulpen, penggaris, penghapus)

## Tips Belajar:
- Hafalkan kosakata berpasangan dengan contoh kalimat nyata.
- Gunakan teknik flashcard dan ulangi 3 kali sehari.

=== SOAL LATIHAN ===
1. Every morning before leaving for school, Bayu packs his pencils, ruler, and notebook into his ___.
A. schoolbag
B. wardrobe
C. refrigerator
D. motorcycle
Ans: A
Exp: Tempat menyimpan alat tulis dan buku pelajaran untuk dibawa ke sekolah adalah schoolbag (tas sekolah).

2. The teacher asked all ninth-grade students to submit their English ___ by 2 PM.
A. breakfast
B. assignment
C. bedroom
D. holiday
Ans: B
Exp: Kata "assignment" memiliki arti tugas sekolah yang harus diserahkan (submit) kepada guru.

3. Sinta always ___ at 05.00 AM to perform the Subuh prayer and prepare for school.
A. goes to bed
B. wakes up
C. borrows books
D. forgets
Ans: B
Exp: Kata kerja yang tepat untuk aktivitas bangun tidur di pagi hari adalah "wakes up".`,
  },

  dialogue: {
    categoryId: 'dialogue',
    categoryName: 'Dialogue',
    iconName: 'MessageSquare',
    description: 'Percakapan interaktif dua arah (Ordering Food, Directions, Booking, Hobbies)',
    topicSuggestion: 'Ordering Food & Drinks at the School Canteen',
    sampleText: `=== MATERI PEMBELAJARAN ===
Ringkasan: Praktik percakapan dua arah di kantin sekolah (Ordering Food & Drinks) menggunakan bahasa Inggris yang sopan dan lugas.

Materi:
# Dialogue: Ordering Food at the Canteen

## Situasi Percakapan:
Farhan sedang memesan makan siang di kantin sekolah pada jam istirahat pertama.

## Naskah Percakapan:
- **Canteen Staff:** "Good afternoon! Welcome to Al-Karim Canteen. What can I get for you today?"
- **Farhan:** "Good afternoon, Ma'am. Could I please have a plate of fried noodles with a fried egg?"
- **Canteen Staff:** "Sure. Would you like extra chili sauce on top?"
- **Farhan:** "Yes, please, just a little bit. And an iced lemon tea with less sugar, please."
- **Canteen Staff:** "Got it. That comes to Rp 16,000 altogether."
- **Farhan:** "Here is twenty thousand rupiah."
- **Canteen Staff:** "Thank you! Here is your four thousand rupiah change. Please have a seat at table 3."
- **Farhan:** "Thank you very much, Ma'am!"

=== SOAL LATIHAN ===
1. Where does the dialogue most likely take place?
A. At a railway ticket counter
B. In the school canteen
C. In a hospital emergency room
D. Inside the science laboratory
Ans: B
Exp: Konteks percakapan memesan fried noodles dan iced lemon tea menunjukkan lokasi berada di kantin sekolah.

2. What beverage does Farhan order to accompany his meal?
A. Hot black coffee
B. Plain mineral water
C. Iced lemon tea with less sugar
D. Fresh avocado juice
Ans: C
Exp: Farhan memesan minuman: "And an iced lemon tea with less sugar, please."

3. How much change (kembalian) does Farhan receive from the canteen staff?
A. Rp 2,000
B. Rp 4,000
C. Rp 16,000
D. Rp 20,000
Ans: B
Exp: Total pesanan Rp 16.000, Farhan membayar dengan Rp 20.000, sehingga kembaliannya adalah Rp 4.000.`,
  },

  speech: {
    categoryId: 'speech',
    categoryName: 'Speech',
    iconName: 'Mic',
    description: 'Naskah pidato publik (School Ceremony, Environmental Awareness, Youth Empowerment)',
    topicSuggestion: 'School Ceremony Speech: The Power of Discipline',
    sampleText: `=== MATERI PEMBELAJARAN ===
Ringkasan: Memahami struktur naskah pidato bahasa Inggris (Introduction, Body Paragraphs, Call to Action, Conclusion).

Materi:
# Speech Delivery: The Value of Discipline in Learning

## 1. Structure of an English Speech (Struktur Pidato):
1. **Salutation & Hook:** Menyapa hadirin dengan rasa hormat dan menarik perhatian.
2. **Central Theme (Isi Pokok):** Menyampaikan argumen utama dan dampak positif kedisiplinan.
3. **Call to Action (Ajakan Bertindak):** Mengajak audiens untuk mulai menerapkan disiplin waktu dan ibadah.
4. **Formal Closing:** Salam penutup dan ucapan terima kasih atas perhatian hadirin.

## Contoh Transkrip Naskah Pidato:
"Honorable Principal, respected teachers, and all my beloved friends.
Good morning and peace be upon us all.
Standing before you today, I would like to emphasize how crucial discipline is in achieving academic success. Discipline is not a limitation; it is the bridge between our current abilities and our future goals. By managing our study time wisely and respecting school rules, we build strong character for life.
Let us start with small habits: coming to class on time and completing our tasks with sincerity.
Thank you very much for your kind attention. Good morning!"

=== SOAL LATIHAN ===
1. What is the central message conveyed by the speaker in the speech?
A. The importance of winning school sports competitions
B. The crucial role of discipline in achieving academic and personal success
C. The procedure for borrowing books in the library
D. The schedule for school field trips
Ans: B
Exp: Inti pidato berfokus pada pentingnya kedisiplinan belajar ("how crucial discipline is in achieving academic success").

2. In the speech, what metaphor does the speaker use to describe discipline?
A. A high wall that stops students
B. The bridge between current abilities and future goals
C. A heavy luggage to carry every day
D. A short running contest
Ans: B
Exp: Pembicara mengatakan: "Discipline is the bridge between our current abilities and our future goals."

3. Which phrase is used as a formal expression of gratitude at the end of the speech?
A. "Good morning and peace be upon us all."
B. "Honorable Principal..."
C. "Thank you very much for your kind attention."
D. "Let us start with small habits."
Ans: C
Exp: Ungkapan penutup resmi untuk berterima kasih kepada pendengar adalah "Thank you very much for your kind attention."`,
  },

  grammar: {
    categoryId: 'grammar',
    categoryName: 'Grammar',
    iconName: 'Cpu',
    description: 'Struktur tata bahasa (Simple Present, Past Tense, Modals, Passive Voice, Conditionals)',
    topicSuggestion: 'Simple Present Tense: Habits & General Truths',
    sampleText: `=== MATERI PEMBELAJARAN ===
Ringkasan: Kaidah Simple Present Tense untuk kalimat verbal dan nominal, aturan penambahan akhiran -s/-es, serta kata bantu do/does.

Materi:
# Grammar: Simple Present Tense

## 1. Fungsi Utama:
- **General Truths (Fakta Ilmiah):** *The Earth revolves around the Sun.*
- **Habitual Actions (Kebiasaan):** *He drinks milk every morning.*

## 2. Pola Kalimat Verbal (Verbal Sentences):
- **Positif (+):**
  - $I / You / We / They + V_1 + O$ -> *They play basketball.*
  - $He / She / It + V_1(s/es) + O$ -> *She studies English.*
- **Negatif (-):**
  - $I / You / We / They + \text{do not (don't)} + V_1$
  - $He / She / It + \text{does not (doesn't)} + V_1$ *(akhiran -s/-es hilang)*
- **Tanya (?):**
  - $\text{Do / Does} + S + V_1 + ?$ -> *Does he live in Bandung?*

## 3. Aturan Akhiran -es:
- Kata kerja berakhiran *-ch, -sh, -ss, -x, -o* -> ditambah **-es** (*watches, washes, misses, fixes, goes*).
- Kata kerja berakhiran konsonan + *y* -> *y* menjadi **-ies** (*study -> studies*).

=== SOAL LATIHAN ===
1. The sun always ___ in the east and sets in the west.
A. rise
B. rises
C. rising
D. is rose
Ans: B
Exp: "The sun" adalah subjek tunggal (It) yang menyatakan fakta umum (general truth), sehingga kata kerja rise ditambah -s menjadi "rises".

2. Dito and his brother ___ eat spicy food because of their sensitive stomachs.
A. doesn't
B. don't
C. isn't
D. aren't
Ans: B
Exp: Subjek jamak "Dito and his brother" (They) dalam kalimat negatif Present Tense menggunakan auxiliary verb "don't" (do not).

3. "___ your sister attend the English debate club every Friday?"
Choose the correct auxiliary verb to complete the interrogative sentence.
A. Do
B. Does
C. Is
D. Are
Ans: B
Exp: Subjek "your sister" adalah orang ketiga tunggal (She), sehingga kalimat tanya menggunakan kata bantu "Does" (Does + Subject + Verb 1).`,
  },
};

export function getMaterialOnlyTemplate(catKey: string): string {
  const full = UNIFIED_TEMPLATES[catKey]?.sampleText || UNIFIED_TEMPLATES.expression.sampleText;
  const split = full.split(/(?:===|---|#|\[)\s*(?:SOAL|LATIHAN|QUESTIONS|EXERCISE)/i);
  return split[0].trim();
}

export function getQuestionsOnlyTemplate(catKey: string): string {
  const full = UNIFIED_TEMPLATES[catKey]?.sampleText || UNIFIED_TEMPLATES.expression.sampleText;
  const split = full.split(/(?:===|---|#|\[)\s*(?:SOAL|LATIHAN|QUESTIONS|EXERCISE)[^\]\n\r]*[\=\-\]\#]*/i);
  if (split.length >= 2) {
    return split.slice(1).join('\n').trim();
  }
  return full.trim();
}

