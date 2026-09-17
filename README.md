# 🌦️ Stazione Meteo di Motta Visconti

Sito web pubblico che mostra in tempo reale i dati ambientali rilevati dalla stazione meteo personale di Motta Visconti (MI), con previsioni future, record storici e monitoraggio idrometrico del Fiume Ticino.

🔗 **Sito live:** https://meteo.nas.vagitaly.it/
📱 **App Android:** [repository e changelog](https://github.com/Simonz82/meteo-motta-visconti-app) · download dal pulsante nel footer del [sito](https://meteo.nas.vagitaly.it/)

## Cos'è

Un progetto amatoriale che raccoglie e visualizza:

- 🌡️ **Temperatura, umidità, pressione, vento** — gauge in tempo reale con min/max giornalieri
- ☀️🌙 **Sole e Luna** — orari alba/tramonto, fase lunare, stagione in corso
- 📅 **Previsioni Future** — 5 giorni (oggi incluso) con dettaglio orario ogni 3 ore stile "ilmeteo.it"
- 🏆 **Record Storici** — temperature e pioggia estreme dal 1940 ad oggi
- ⚡ **Rilevatore Fulmini** — ultimo fulmine, distanza minima della giornata, allerta se sotto i 10 km nell'ultima ora
- 🌬️ **Qualità dell'Aria** — indice UAQI, PM2.5, PM10, Ozono, Anidride Nitrosa
- 🌼 **Livello Polline** — alberi, erbe, ambrosia e altre specie
- 🌊 **Fiume Ticino** — livello idrometrico a Bereguardo, Vigevano e Pavia
- ☔ **Allerte Meteo** — bollettino di criticità della Protezione Civile

## Fonti dati

| Dato | Fonte |
|---|---|
| Sensori ambientali (temp, umidità, vento, pioggia, UV, fulmini) | Stazione Ecowitt WS69 + moduli aggiuntivi |
| Qualità dell'aria & Polline | Google Maps Platform (Air Quality API, Pollen API) |
| Previsioni future | Open-Meteo Forecast API |
| Record storici (dal 1940) | Open-Meteo Historical Weather API (archivio ERA5) |
| Livello idrometrico Bereguardo & Vigevano | Laghi.net |
| Livello idrometrico Pavia | Rete IRIS di ARPA Lombardia |
| Allerte meteo | Dipartimento della Protezione Civile |

## Stack tecnico

Frontend statico in HTML/CSS/JavaScript vanilla, senza framework — [Chart.js](https://www.chartjs.org/) per i grafici storici e [SunCalc.js](https://github.com/mourner/suncalc) per i calcoli astronomici. Backend leggero in PHP per l'aggregazione e la cache delle API esterne.

Il sito è stato realizzato con l'aiuto di diversi strumenti di intelligenza artificiale.

## Changelog

Le modifiche vengono registrate in [CHANGELOG.md](CHANGELOG.md).

## Struttura del repository

- `index.html` — homepage con tutte le card in tempo reale
- `storico.html` — pagina condivisa per lo storico di ogni misura (temperatura, umidità, vento, fulmini, pioggia, qualità dell'aria, polline), selezionata via `?misura=`

## Nota

Questo repository documenta il concept e l'evoluzione del progetto. Il codice del backend (integrazione con i sensori, chiavi/endpoint privati) non è incluso per motivi di privacy e sicurezza.

## ☕ Vuoi darmi una mano?

Il contenuto di questa pagina è completamente gratuito e lo scopo non è certamente fare soldi. Se vuoi darmi una mano per le spese e il tempo perso, ecco alcuni modi:

| | |
|---|---|
| [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C713VTGJ) | Offrimi un caffè su Ko-fi |
| [![PayPal](https://github.com/Simonz82/desktop-tutorial/blob/main/paypal.svg)](https://www.paypal.com/paypalme/simongmail) | Una donazione libera su PayPal |
| [![Amazon](https://github.com/Simonz82/desktop-tutorial/blob/main/Amazon_logo.png)](https://amzn.to/3XWWTgz) | Fai i tuoi acquisti Amazon partendo da questo link |

**Canali Telegram:**

| | |
|---|---|
| [![Home_Assistant_News](https://github.com/Simonz82/desktop-tutorial/blob/main/home_assistant_news.jpg)](https://t.me/Home_Assistant_News) | Notizie dedicate a Home Assistant |
| [![Offerte Domotica](https://github.com/Simonz82/desktop-tutorial/blob/main/offerte_domotica.jpg)](https://t.me/offerte_domotica_ita) | Offerte sui prodotti di domotica |

---

Sviluppato e curato da [Simonz82](https://t.me/Simonz82) · © 2026
