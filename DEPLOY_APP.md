# Hoe maak ik hier een Installable App van? (PWA)

Je hoeft geen Native App (zoals in de App Store) te bouwen om dit op je telefoon te gebruiken. Dit project is geconfigureerd als een **Progressive Web App (PWA)**.

Dit betekent dat je het direct vanuit de browser kunt installeren op je telefoon of computer.

## 📱 Installeren op iPhone (iOS)

1.  Open de website in **Safari**.
2.  Tik onderin op de "Delen" knop (vierkantje met pijl omhoog).
3.  Scroll naar beneden en tik op **"Zet op beginscherm"** (Add to Home Screen).
4.  Geef de app een naam (bijv. "Al-Madrasa") en tik op "Voeg toe".
5.  Er staat nu een app-icoon op je thuisscherm. Als je deze opent, start de app volledig scherm op, zonder browserbalk.

## 🤖 Installeren op Android

1.  Open de website in **Chrome**.
2.  Tik rechtsboven op de drie puntjes.
3.  Tik op **"App installeren"** of **"Toevoegen aan startscherm"**.
4.  Bevestig de installatie.
5.  De app verschijnt nu tussen je andere apps in de app-lade.

## 💻 Installeren op Computer (Chrome/Edge)

1.  Open de website.
2.  Je ziet rechtsboven in de adresbalk een icoontje van een computerscherm met een pijl, of een `+`.
3.  Klik hierop en kies **"Installeren"**.
4.  De app opent nu in een apart venster en staat in je taakbalk.

---

## Technische Details

Dit project gebruikt de Next.js `manifest.ts` functionaliteit.
- **Manifest**: `app/manifest.ts` definieert de naam, kleuren en iconen.
- **Iconen**: `public/icon-192.png` en `public/icon-512.png` worden gebruikt als app-icoon.
- **Thema**: De browserbalk kleurt mee met de applicatie (#0a1f18).

Eventuele toekomstige stappen voor een *echte* Store app (App Store/Play Store) zouden het gebruik van **Capacitor** vereisen, maar voor intern moskee-gebruik is bovenstaande PWA methode het meest efficiënt.
