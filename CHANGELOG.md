# Changelog

Tutte le modifiche rilevanti al sito della Stazione Meteo di Motta Visconti vengono registrate qui, in ordine cronologico inverso.

## 2026-09-16

### Aggiunto
- Nuova sezione "Notizie Motta Visconti e dintorni" (`notizie.html`): notizie e video degli ultimi 30 giorni per Motta Visconti, Casorate Primo, Bereguardo e Besate, più uno storico completo per anno/mese, alimentata da un bot di raccolta notizie dedicato
- Predisposto (ma disattivato) un gate di login per la sezione Notizie, da attivare in futuro quando l'accesso sarà legato all'account
- Nuovo box "Watt Solari" accanto a Raggi UV, con mini barra sfumata e cursore che indica il valore attuale di irraggiamento; relativo storico dedicato (grafico giornaliero + trend 30 giorni)
- Nuovo box "Temporali" (distanza/orario ultimo fulmine rilevato oggi), ridotto da banner a piena larghezza a box compatto affiancato a "Pioggia Oggi"
- L'icona meteo dell'ora corrente ora viene confrontata con le rilevazioni reali della stazione (radiazione solare, pioggia): se il cielo è sereno/nuvoloso/piovoso in modo diverso da quanto previsto da Open-Meteo, l'icona mostrata riflette la realtà misurata invece della sola previsione

### Risolto
- Pulsante fisico "Indietro" su Android nella sezione Notizie: ora risale la gerarchia di navigazione un passo alla volta invece di tornare sempre alla home
- Pagina di registrazione (web e app): la tastiera non copre più i campi da compilare
- Previsioni orarie: mostrate una per ogni ora invece che ogni 3, con scorrimento se l'elenco è lungo
- Popup dettaglio giorno (Previsioni Future): ridotto lo spazio vuoto sopra il titolo e tra l'icona riassuntiva e la tabella oraria; corretto uno scorrimento che su alcuni telefoni veniva interpretato come ricarica della pagina

### Modificato
- Box Massima/Minima in tutte le pagine storiche: ordine invertito (prima Minima, poi Massima)
- Grafico storico Temperatura (30 giorni): la media giornaliera (poco significativa) è stata sostituita da due barre per giorno, massima e minima
- Grafici storici a 30 giorni (tutte le misure, inclusi Pioggia Giornaliera e Accumulo Mensile): meno spazio sprecato sopra la legenda, canvas più alto e più largo, caratteri leggermente ridotti
- Scale degli assi di Umidità, Pressione e Temporali nei grafici storici: intervallo ridotto per non lasciare così tanto spazio vuoto sopra i valori reali

## 2026-09-11

### Risolto
- Testo dei grafici (storico e livello idrometrico Fiume Ticino) illeggibile nei temi diversi dallo Scuro: i grafici usano canvas (Chart.js), che non legge le variabili CSS dei temi — ora il colore viene letto e applicato correttamente ad ogni disegno del grafico
- Corretto anche un problema di tempistica: nell'app il tema viene applicato dopo che la pagina ha già finito di caricare, quindi i grafici di Temperatura/Umidità/Qualità dell'Aria (che usano un colore di default globale letto una sola volta) restavano col colore sbagliato. Ora ogni grafico rilegge il colore corretto appena prima di essere disegnato. Verificato su tutti e 7 i temi
- Icona meteo di "Oggi" nel box Previsioni Future: mostrava il codice meteo "dell'intera giornata" di Open-Meteo (es. nebbia mattutina persistente anche a mezzogiorno) invece della condizione reale dell'ora corrente — ora usa il dato orario più vicino all'ora attuale

### Risolto
- Tasto Indietro (browser e app): aprendo un popup (download app, record storici, specifiche tecniche, meteo/sole/luna/stagione) e premendo Indietro, ora si chiude solo il popup restando sulla pagina corrente, invece di uscire dall'app o saltare a una pagina precedente inaspettata (es. lo storico pioggia)

### Aggiunto
- Nuova immagine di anteprima (Open Graph) per la condivisione su Facebook/social, caricata come file separato per forzare l'aggiornamento della cache di Facebook
- Pulsante "Scarica l'app" con un leggero bagliore pulsante per farsi notare di più

### Modificato
- Pulsante "Webcam nei Dintorni": icona cambiata in una videocamera (invece della fotocamera, troppo simile a quella di "Archivio Storico Foto") e colore del testo reso distinto dagli altri pulsanti
- Popup di istruzioni all'installazione dell'app Android: spiega gli avvisi che Android può mostrare durante il download e all'apertura del file, con i passaggi per procedere e un pulsante di download che mostra la versione esatta in scarico
- Popup riorganizzato in passaggi numerati con gli screenshot reali dei due avvisi (Chrome "Potrebbe essere dannoso" e Google Play Protect, con freccia che indica il pulsante "Installa comunque"), area istruzioni scorrevole e pulsante di download sempre visibile in fondo
- Box "Perché installare l'app" nel popup, prima delle istruzioni: elenca i vantaggi (notifiche personalizzate per fascia oraria, tema chiaro/scuro, avviso aggiornamenti, accesso anticipato alle nuove funzioni)

### Modificato
- Testo del pulsante di download app aggiornato per menzionare le notifiche meteo personalizzabili, poi rifinito in "Scarica l'APP di ANDROID per abilitare tutte le notifiche"
- Icona della nebbia nel box "Previsioni Future" sostituita con una più coerente esteticamente con le altre (la precedente non veniva renderizzata correttamente su alcuni dispositivi)

### Aggiunto — Sistema di temi
- Introdotto un sistema di temi selezionabili (Scuro, Chiaro, Black/AMOLED, Blu, Green, Pink, Red), ciascuno con superfici in vetro traslucido (blur) sulle card. Il sito web pubblico continua a mostrare sempre il tema Scuro originale, identico pixel per pixel a prima: il tema si attiva solo esplicitamente (dall'app, o con `?theme=nome` nell'URL) e resta invariato per chi visita il sito normalmente
- Tutti i colori legati al significato dei dati (scale di gravità inquinamento/polline, temperature, allerte) restano fissi in ogni tema, per non comprometterne la leggibilità

### Aggiunto
- Sezione finale nel popup di installazione con la vecchia icona dell'app: avvisa chi ha ancora installata la versione superata (icona diversa da quella attuale) che può disinstallarla, non riceverà più aggiornamenti

## 2026-09-10

### Aggiunto
- Nuovo box "Rilevazioni Stazione Meteo" che raggruppa Temperatura, Umidità, Pressione, Vento, Raggi UV, Pioggia e Ultimo Fulmine sotto un unico titolo, con lo stesso stile del box Previsioni Future
- Pulsanti di navigazione ◀ ▶ nelle pagine storiche per scorrere avanti/indietro tra i giorni disponibili, senza dover riaprire il menu a tendina
- Link "GitHub" e "Changelog" nel footer del sito, che rimandano a questo repository
- Nuovo pulsante "Webcam nei Dintorni" nel footer, che rimanda alle webcam pubbliche più vicine a Motta Visconti (Pavia, Gaggiano, Dorno e altre)
- Nuovo box "News su Telegram" nel footer, con pulsanti diretti ai canali Telegram Motta Visconti e Ticino

### Modificato (footer)
- Invertito l'ordine dei pulsanti: "Archivio Storico Foto" ora precede "Scarica l'App Android"
- Il box "News su Telegram" è stato spostato sotto "Specifiche Tecniche" e reso un box a parte (stesso stile di "Previsioni Future"), per non sembrare parte del pulsante precedente

### Modificato
- Uniformata la spaziatura sopra e sotto il titolo di tutti i box del sito (Previsioni Future, Rilevazioni Stazione Meteo, Qualità dell'Aria, Livello Polline, Fiume Ticino)
- Ridotti i font dei titoli delle card (Temperatura, Umidità, Pressione, Vento, Raggi UV, Pioggia) e dei valori numerici di UV/Pioggia
- Box Fiume Ticino: le 3 stazioni ora stanno su un'unica riga con formato compatto (nome, valore, orario su righe separate); i grafici si aprono uno alla volta invece di accumularsi; rimossi i pallini dal grafico, lasciando solo la linea
- Pagine storiche (temperatura, umidità, vento, fulmini, pioggia, qualità dell'aria, polline): refresh completo del layout — font più piccoli per titolo, pulsante indietro, menu data e titoli dei grafici; box Massima/Minima più compatti; grafici più bassi e con linee/istogrammi più sottili; margine dinamico sopra i grafici a barre per evitare che le etichette dei valori più alti si sovrappongano alla legenda
- Popup "Specifiche Tecniche": aggiunta la sezione "Fonti Dati Esterne" con l'elenco completo delle integrazioni (Open-Meteo, Laghi.net, ARPA Lombardia, Protezione Civile, Google Maps Platform)
- Box Fiume Ticino: sfondo delle card scurito
- Pulsanti del footer (Record Storici, Webcam, App Android, Foto Storiche, Specifiche Tecniche): sfondo scurito, font di titolo e descrizione ridotti per renderli più compatti

### Risolto
- Bug nel calcolo del box fulmini (variabile usata prima di essere definita), che causava un errore silenzioso nei giorni senza rilevamenti; aggiunta anche l'indicazione del fulmine più vicino rilevato nella giornata
- Popup "Specifiche Tecniche" non scorrevole su schermi bassi
- Menu a tendina della data nelle pagine storiche che si riduceva a pochi pixel di larghezza su smartphone, nascondendo la data selezionata
- Numeri sopra le barre del grafico "Pioggia Giornaliera" che uscivano dal bordo del grafico

## 2026-09-09

### Aggiunto
- Sezione "Fulmine più vicino oggi" nel box fulmini: mostra la distanza minima registrata nella giornata (non solo l'ultimo rilevato), sia in testata che accanto al dato principale
- Nuova sezione "Fonti Dati Esterne" nel popup Specifiche Tecniche, con l'elenco completo delle API e dei portali usati (Open-Meteo, Laghi.net, ARPA Lombardia, Protezione Civile, Google Maps Platform)
- Dettaglio orario ogni 3 ore per ciascun giorno di previsione (stile "ilmeteo.it"), consultabile cliccando sul giorno
- Sezione "Record Storici": temperature e pioggia estreme dal 1940 ad oggi (Open-Meteo Historical/ERA5), con cache robusta per non sovraccaricare l'API esterna

### Modificato
- Soglia di allerta lampeggiante del box fulmini abbassata da 50 km a 10 km, per evitare falsi allarmi su eventi lontani
- Box previsioni rinominato "Previsioni Future", spostato sopra la sezione Stagione/Sole/Luna, esteso a includere il giorno corrente ("Oggi")
- Contrasto del testo "Moderato" nel box Raggi UV migliorato (sfondo giallo scurito per leggibilità)
- Legenda del livello polline ridotta ai 4 livelli realmente utili (rimossi "Nessuno" e "Molto Basso"), ora su una sola riga anche da smartphone
- Compattate le card di Temperatura, Umidità, Pressione, Vento, Raggi UV, Pioggia, Qualità dell'Aria, le 3 rilevazioni del Fiume Ticino e i pulsanti del footer
- Colore e lunghezza della freccia di direzione vento nella bussola, per non sovrapporsi più all'indicatore Nord
- Testi e dimensioni dei titoli uniformati in tutte le card del sito

### Risolto
- Bug nel calcolo del box fulmini che causava un errore silenzioso nei giorni senza rilevamenti
- Popup "Specifiche Tecniche" non scorrevole su schermi bassi (il contenuto superiore restava inaccessibile su smartphone)
- Bussola del vento deformata (ovale anziché circolare) dopo la riduzione dimensionale delle card
- Duplicazione della logica delle fasi lunari, unificata in un'unica funzione

## 2026-09-08

### Aggiunto
- Banner di allerta meteo basato sul bollettino di criticità della Protezione Civile
- Monitoraggio del livello idrometrico del Fiume Ticino a Bereguardo, poi esteso a Vigevano e Pavia
- Pulsanti dedicati con ultima misura in evidenza e grafico storico al tocco

### Risolto
- Picco anomalo nel grafico del livello idrometrico di Bereguardo (valore -86.4 seguito da uno zero errato)

## Versioni precedenti

Le modifiche antecedenti al 2026-09-08 non sono state tracciate in un changelog strutturato.
