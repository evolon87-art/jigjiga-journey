# Build the 'SİEC JİGJİGA KURSU - Talebe ve Aidat Takip Paneli' application from https: github

Build the 'SİEC JİGJİGA KURSU - Talebe ve Aidat Takip Paneli' application from https://github.com/miyonerzihniyeti99-design/journey-together-16.git:

Key features to include:
1. Header: 'SİEC JİGJİGA KURSU' with section tabs for 'Hafızlık takip paneli' and 'Aidat takip paneli'. Groups menu (1. Seviye, 2. Seviye, Hazırlık) and Hocaefendi management.
2. Hocaefendi authentication & session mode (password protected) to toggle edit mode, change password, and edit teacher name.
3. Hafızlık Takip Paneli:
   - Summary cards: Toplam Talebe, Günlük Ders durumu (x/toplam) with modal listing students who didn't give lesson ('Ders Vermeyenler'), and weekly report modal ('Haftanın Raporu').
   - Weekly navigation (Önceki hafta, Bu hafta, Sonraki hafta) and day selector dropdown (Pzt - Cum).
   - Students table: #, Talebe (with avatar, student profile dialog on click), day checkmark toggle (verdi / vermedi), page number (1-604), automatic juz calculation (cüz = floor((sayfa-1)/20)+1), and edit actions.
   - Student profile dialog: photo preview/upload, personal info (phone, notes), page progress.
   - Student edit dialog: name, reading direction (alttan 1->604 / üstten 604->1), current page, weekly goal.
4. Aidat Takip Paneli:
   - Monthly fee setting and tracking table across months.
   - Filter by group (1. Seviye, 2. Seviye, Hazırlık).
   - Payment status checkboxes per student per month with total collection summaries.
5. Management modal: Add student, add student to aidat only, assign students to groups.
Modern clean UI styled with Tailwind CSS, Lucide icons, and responsive desktop/mobile design.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/21cda0ee-6938-4906-8eb2-623a450ebe54).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
