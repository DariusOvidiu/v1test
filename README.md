# Casino Guru - Vice City Edition

Un ghid complet pentru jocurile de noroc și pariuri sportive, inspirat din casino.guru dar cu un design modern și funcționalități avansate.

## Scopul Proiectului

Acest proiect este o platformă educațională care oferă:
- Ghiduri detaliate pentru jucători începători și experimentați
- Informații despre cazinouri online, pariuri sportive și alte jocuri de noroc
- Sistem de tag-uri pentru acces rapid la informații
- Newsletter personalizat bazat pe nivelul de experiență
- Chatbot AI pentru asistență (în dezvoltare)

## Funcționalități Implementate

1. **Sistem de Localizare**
   - Detector automat de IP/VPN pentru limba implicită
   - Selector manual de limbă și țară
   - Traduceri manuale prin AI pentru calitate optimă
   - Suport pentru multiple limbi (en, es, de, fr)

2. **Sistem de Căutare**
   - Căutare avansată în conținut
   - Filtrare după categorii și tag-uri
   - Rezultate relevante bazate pe preferințe

3. **Newsletter și Autentificare**
   - Formular de înregistrare cu:
     * Nume și Prenume
     * Țară
     * Email
     * Număr de telefon (opțional)
     * Nivel de experiență (Casino)
     * Nivel de experiență (Pariuri Sportive)
   - Confirmare prin email
   - Preferințe personalizate

4. **Structură de Conținut**
   - Categorii principale:
     * Cazinouri Online
     * Pariuri Sportive
     * Poker
     * Jocuri de Noroc
   - Sistem de tag-uri pentru:
     * Tipuri de jocuri
     * Nivel de dificultate
     * Strategii
     * Bonusuri și promoții

## Tehnologii Utilizate

- Next.js 13+ pentru frontend
- Tailwind CSS pentru styling
- Sistem de traduceri bazat pe AI
- Detector de IP/VPN extern
- Sistem de tag-uri și categorii
- Newsletter și sistem de autentificare

## Următorii Pași

1. **Faza 1 - Infrastructură**
   - Implementarea detectorului de IP/VPN
   - Setarea sistemului de traduceri
   - Crearea structurii de categorii și tag-uri

2. **Faza 2 - Conținut**
   - Dezvoltarea sistemului de articole
   - Implementarea sistemului de tag-uri
   - Crearea conținutului inițial

3. **Faza 3 - User Experience**
   - Implementarea sistemului de newsletter
   - Dezvoltarea sistemului de autentificare
   - Optimizarea pentru mobile

4. **Faza 4 - Avansat**
   - Implementarea chatbot-ului AI
   - Sistem de feedback și rating
   - Analitice și optimizări

## Note de Dezvoltare

- Toate textele trebuie traduse în toate limbile suportate
- Sistemul de tag-uri trebuie să fie ușor de extins
- Newsletter-ul trebuie să fie personalizat pe baza nivelului de experiență
- Design-ul trebuie să fie modern și accesibil
- Performanța trebuie optimizată pentru toate dispozitivele

## Instalare și Rulare

1. Clonează repository-ul
2. Instalează dependențele:
   ```bash
   npm install
   ```
3. Pornește serverul de dezvoltare:
   ```bash
   npm run dev
   ```
4. Deschide [http://localhost:3000](http://localhost:3000) în browser

## File Structure

\`\`\`
casino-guru-vice-city/
├── app/
│   ├── globals.css        # Global styles including Vice City theme
│   ├── layout.tsx         # Root layout with font imports
│   └── page.tsx           # Homepage component
├── components/
│   ├── header.tsx         # Header with search and language selector
│   ├── navigation.tsx     # Main navigation menu
│   ├── hero-section.tsx   # Hero section with title and description
│   ├── topic-buttons.tsx  # Topic navigation buttons
│   └── top-articles.tsx   # Article cards section
├── public/
│   └── placeholder.svg    # Placeholder for images
├── tailwind.config.ts     # Tailwind configuration with Vice City colors
└── README.md              # Project documentation
\`\`\`

## Next Steps / Future Improvements

1. **Replace Placeholders**
   - Create a custom Vice City-themed logo
   - Design custom icons for article cards
   - Create character illustrations in Vice City style

2. **Additional Pages**
   - Implement casino listing pages
   - Create article detail pages
   - Add game review pages

3. **Enhanced Functionality**
   - Implement working search functionality
   - Add dark/light mode toggle
   - Create mobile-responsive hamburger menu
   - Add animated neon glow effects

4. **Performance Optimization**
   - Optimize images and assets
   - Implement lazy loading for better performance

## Notes from Our Discussion

- The project focuses on recreating the homepage with the Vice City theme
- All buttons have redirects to their respective pages (even though those pages don't exist yet)
- The language selector opens a modal with T1 languages and countries
- The search bar is preserved in the header
- The project is designed to be used in Cursor.AI

## For Beginners (No Coding Experience)

If you're new to coding, here are some simple steps to get started:

1. **ACȚIUNE NECESARĂ**: Install Node.js from https://nodejs.org/
2. **ACȚIUNE NECESARĂ**: Open a terminal/command prompt in the project folder
3. **ACȚIUNE NECESARĂ**: Run `npm install` to install dependencies
4. **ACȚIUNE NECESARĂ**: Run `npm run dev` to start the development server
5. **ACȚIUNE NECESARĂ**: Open a browser and go to http://localhost:3000

## Validation & Testing

- Use `npm run dev` for development preview
- Use `npm run build` followed by `npm start` for production build testing
- Verify that pages match the original site's structure with the Vice City theme applied

'use client';

import { useLanguage } from "@/contexts/LanguageContext";

export function MyComponent() {
  const { language, country } = useLanguage();
  
  return (
    <div>
      {/* Conținut bazat pe limba selectată */}
    </div>
  );
}
#   v 1 t e s t  
 #   v 1 t e s t  
 