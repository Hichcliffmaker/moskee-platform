# Al-Madrasa: Moskee Code & Education Platform

Dit project is een modern, 'Magister-achtig' softwareplatform speciaal ontwikkeld voor moskeeën en islamitische scholen. Het combineert educatief beheer (leerlingen, cijfers, agenda) met moskee-specifieke functies (gebedstijden, aankondigingen).

## 🌟 Kernfunctionaliteiten

### 1. Educatie & School
*   **Studenten Administratie**: Dossiers beheren, zoeken op naam/groep, status (actief/inactief).
*   **Groepen & Klassen**: Beheer van klassen (bijv. Groep 4 Hifz), koppeling van docenten en lokalen.
*   **Cijferadministratie**: Digitaal invoeren en inzien van resultaten voor vakken als Koran, Fiqh en Arabisch.
*   **Aanwezigheid**: Docenten kunnen snel absenties en 'te laat' registreren per groep.
*   **Huiswerk & Agenda**: Huiswerk opgeven en een centrale schoolagenda beheren.

### 2. Moskee & Facilitair
*   **Gebedstijden (Salah)**: Real-time gebedstijden (API-koppeling) met optie tot handmatige correctie en Jummah-instellingen. Geschikt voor TV-schermen in de hal.
*   **Aankondigingen**: Digitaal prikbord voor nieuwsberichten vanuit het bestuur.

### 3. Portalen & Toegang
*   **Dashboard**: Centraal overzicht met statistieken en snelkoppelingen.
*   **Ouder Portaal**: Speciale omgeving voor ouders om de voortgang van hun kind te volgen (cijfers, huiswerk, ziekmelden).
*   **Admin Instellingen**: Beheer van gebruikers, schooljaren en systeemvoorkeuren.

## 🛠️ Technische Stack

*   **Framework**: Next.js 15 (App Router)
*   **Taal**: TypeScript
*   **Styling**: Custom CSS (Geen frameworks) voor een unieke, premium uitstraling (Goud/Donkergroen).
*   **Data**: Supabase Integration (Live Database).

## 🚀 Aan de slag

1.  **Installatie**:
    ```bash
    npm install
    ```

2.  **Starten (Development)**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000)

## 📁 Structuur

*   `app/students`: Studentenbeheer en dossiers.
*   `app/groups`: Klassenoverzicht.
*   `app/grades`: Cijferlijsten en invoer.
*   `app/attendance`: Absentieregistratie.
*   `app/prayer-times`: Gebedstijden module.
*   `app/homework`: Huiswerkbeheer.
*   `app/agenda`: Schoolkalender.
*   `app/settings`: Configuratie en gebruikersbeheer.
