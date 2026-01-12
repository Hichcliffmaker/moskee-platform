# Hoe zet je het Moskee Platform online?

Om de applicatie beschikbaar te maken voor anderen (docenten, ouders), moet deze op een server draaien. Je hebt hiervoor geen dure hosting nodig.

Hier zijn de twee beste opties:

## Optie 1: Vercel (Aanbevolen & Gratis)
Dit is de makkelijkste manier. Vercel is de maker van Next.js (de techniek die we gebruiken).

**Stappen:**
1.  Zet je code op **GitHub** (Maak een gratis account aan op github.com).
2.  Download [GitHub Desktop](https://desktop.github.com/) en upload je map `moskee-platform` naar een nieuwe 'Repository'.
3.  Ga naar [vercel.com](https://vercel.com) en maak een gratis account aan (Login met GitHub).
4.  Klik op **"Add New..."** -> **"Project"**.
5.  Selecteer je GitHub repository (`moskee-platform`).
6.  Klik op **"Deploy"**.

✅ Binnen 2 minuten staat je site online op een link zoals `moskee-platform.vercel.app`. Deze link kun je direct delen.

---

## Optie 2: Hostinger (VPS)
Als je liever alles in eigen beheer hebt via Hostinger:

1.  Koop een **VPS** pakket (niet "Web Hosting", want dat is vaak alleen voor simpele PHP/Wordpress sites. Je hebt een server nodig die Node.js kan draaien).
2.  Installeer **Node.js** op de server.
3.  Upload je bestanden.
4.  Start de applicatie met een tool als `pm2`.

**Conclusie**:
Voor nu raad ik **Optie 1 (Vercel)** aan. Het is gratis, supersnel en vereist geen technisch serverbeheer. Als de moskee later groeit en een eigen domeinnaam (bijv. `al-madrasa.nl`) wil, kun je die bij Hostinger kopen en koppelen aan Vercel.
