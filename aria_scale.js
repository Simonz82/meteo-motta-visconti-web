/* Scala unica della qualita' dell'aria (2026-10-03), usata da index.html,
   storico.html e utile.html, cosi' colori e giudizi sono gli stessi ovunque.

   UAQI = indice universale di Google Air Quality: 0-100, 100 = aria OTTIMA
   (al contrario degli AQI "americani" dove piu' alto = peggio). Fasce di Google:
   80-100 eccellente, 60-79 buona, 40-59 moderata, 20-39 bassa, 0-19 scarsa.

   Inquinanti: soglie OMS 2021 e limiti UE (direttiva 2024/2881).
   O3 e NO2 arrivano in ppb: convertiti in µg/m³ (x2,00 e x1,88). */
(function () {
  var LEVELS = [
    { name: 'Ottima',   color: '#00a651', text: '#ffffff' },
    { name: 'Buona',    color: '#8bc34a', text: '#111111' },
    { name: 'Discreta', color: '#ffd600', text: '#111111' },
    { name: 'Scarsa',   color: '#ff6d00', text: '#ffffff' },
    { name: 'Pessima',  color: '#d50000', text: '#ffffff' }
  ];
  // limiti superiori di ciascuna fascia (ultima fascia = oltre)
  var POLLUTANTS = {
    pm25: { name: 'PM2.5', limits: [5, 15, 25, 50],   barMax: 75,  unit: 'µg/m³', factor: 1 },
    pm10: { name: 'PM10',  limits: [20, 40, 50, 100], barMax: 150, unit: 'µg/m³', factor: 1 },
    o3:   { name: 'Ozono', limits: [60, 100, 120, 180], barMax: 240, unit: 'µg/m³', factor: 2.0 },
    no2:  { name: 'Biossido di azoto', limits: [10, 25, 50, 200], barMax: 200, unit: 'µg/m³', factor: 1.88 }
  };
  var UAQI_DESC = [
    'Aria pulita: nessuna limitazione, ottimo momento per stare all\'aperto.',
    'Aria buona: va bene per tutti.',
    'Aria accettabile: le persone sensibili possono preferire sforzi moderati.',
    'Aria inquinata: limita gli sforzi intensi all\'aperto.',
    'Aria molto inquinata: resta al chiuso il più possibile, soprattutto bambini e anziani.'
  ];

  function level(i) { var l = LEVELS[i]; return { index: i, name: l.name, color: l.color, text: l.text }; }

  window.ARIA = {
    LEVELS: LEVELS,
    POLLUTANTS: POLLUTANTS,
    // UAQI 0-100 (100 = ottima)
    uaqi: function (v) {
      var i = v >= 80 ? 0 : v >= 60 ? 1 : v >= 40 ? 2 : v >= 20 ? 3 : 4;
      var l = level(i); l.desc = UAQI_DESC[i]; return l;
    },
    uaqiSegments: [
      { val: 0, color: '#d50000' }, { val: 20, color: '#ff6d00' }, { val: 40, color: '#ffd600' },
      { val: 60, color: '#8bc34a' }, { val: 80, color: '#00a651' }, { val: 100, color: '#00a651' }
    ],
    // key: pm25 | pm10 | o3 | no2 ; value nell'unita' del sensore (µg/m³ o ppb)
    pollutant: function (key, value) {
      var p = POLLUTANTS[key], ug = value * p.factor, i = 0;
      while (i < p.limits.length && ug > p.limits[i]) i++;
      var l = level(i);
      l.ug = ug;
      l.pct = Math.min(100, ug / p.barMax * 100);
      return l;
    }
  };
})();
