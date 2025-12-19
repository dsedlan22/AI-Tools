const express = require("express");
const path = require("path");
const AlatiRepozitorij = require("./js/server/alatiModul");
const app = express();
const port = 12247;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "html")));

app.use("/JSklijent", express.static(path.join(__dirname, "js", "klijent")));

app.use("/dizajn", express.static(path.join(__dirname, "css")));

app.use("/resursi", express.static(path.join(__dirname, "resursi")));

app.get("/", (req, res) => {
  res.redirect("/index");
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "index.html"));
});

app.get("/autor", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "autor.html"));
});

app.get("/detalji", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "detalji.html"));
});

app.get("/primjene", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "primjene.html"));
});

app.get("/resursiStranice", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "resursi.html"));
});

app.get("/dokumentacija", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "dokumentacija.html"));
});

app.get("/obrazac", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "obrazac.html"));
});

//Alati
app.get("/alati", (req, res) => {
  const alatiRepo = new AlatiRepozitorij();
  const kategorija = req.query.kategorija;
  const alati = kategorija ? alatiRepo.dohvatiSve(kategorija) : alatiRepo.dohvatiSve();

  const html = `
    <!DOCTYPE html>
    <html lang="hr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="author" content="David Sedlan">
      <meta name="keywords" content="AI alati, popis, pregled">
      <meta name="description" content="Popis AI alata">
      <title>AI Alati - Popis</title>
      <link rel="stylesheet" href="/dizajn/dsedlan.css">
      <link rel="stylesheet" href="/dizajn/dsedlan-responzivnost.css">
      <script src="/JSklijent/dsedlan.js"></script>
    </head>
    <body>
      <header>
        <div class="header-sadrzaj">
          <a href="/index" class="logo-link">
            <img src="/resursi/slike/logo_stranice.jpg" alt="AI Alati Logo" class="logo">
          </a>
          <h1 class="naslov-stranice">AI Alati</h1>
        </div>
        <nav>
          <ul>
            <li><a href="/index">Početna</a></li>
            <li><a href="/dokumentacija">Dokumentacija</a></li>
            <li><a href="/autor">Autor</a></li>
            <li><a href="/primjene">Primjene AI alata</a></li>
            <li><a href="/resursiStranice">Resursi</a></li>
            <li><a href="/obrazac">Obrazac validacija</a></li>
            <li><a href="/alati" class="aktivna-stranica">Alati</a></li>
            <li><a href="/api/alati">API Alati</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <h1>Popis AI alata</h1>
        
        <section class="alat-sekcija">
          <form action="/alati" method="GET" class="forma-filtriraj">
            <input type="text" name="kategorija" placeholder="Unesite kategoriju" value="${kategorija || ''}" class="input-filtriraj">
            <button type="submit" class="gumb-filtriraj">Filtriraj</button>
          </form>

          ${kategorija ? `
            <p class="info-filtriraj">Prikazani su alati iz kategorije: ${kategorija}</p>
            <a href="/alati" class="gumb-povratak">Povratak na popis svih alata</a>
          ` : ''}

          <ol class="lista-alata">
            ${alati.map((alat, index) => `
              <li>
                ${index + 1}. ${alat.naziv} (${alat.godina || 'N/A'}) - ${alat.kategorija}
                <a href="/alati/detalji?naziv=${alat.naziv}" class="poveznica-detalji">Detalji</a>
                <form action="/alati/ukloni" method="POST" style="display: inline;">
                  <input type="hidden" name="naziv" value="${alat.naziv}">
                  <button type="submit" class="gumb-ukloni">Ukloni</button>
                </form>
              </li>
            `).join('')}
          </ol>
        </section>
      </main>

      <footer>
        <div class="footer-ikone">
          <a href="https://chat.openai.com/" target="_blank" title="ChatGPT">
            <img src="/resursi/slike/GPT_logo.png" alt="ChatGPT ikona">
          </a>
          <a href="https://openai.com/dall-e-3" target="_blank" title="DALL·E">
            <img src="/resursi/slike/DALLE_logo.webp" alt="DALL·E ikona">
          </a>
          <a href="https://github.com/features/copilot" target="_blank" title="GitHub Copilot">
            <img src="/resursi/slike/Github_copilot.jpg" alt="GitHub Copilot ikona">
          </a>
        </div>
        <p class="footer-autor">David Sedlan &copy; 2025</p>
        <div class="footer-validacija">
          <a href="http://validator.w3.org/check?uri=spider.foi.hr/OWT/2025/zadaca_01/dsedlan22/html/alati.html">
            <img width="35" height="35" src="https://spider.foi.hr/OWT/materijali/slike/HTML5.png" alt="Valid HTML5">
          </a>
        </div>
      </footer>
    </body>
    </html>
  `;

  res.send(html);
});

app.post("/alati/ukloni", (req, res) => {
  const alatiRepo = new AlatiRepozitorij();
  const naziv = req.body.naziv;

  if (alatiRepo.ukloniPoNazivu(naziv)) {
    res.redirect("/alati");
  } else {
    res.send(`
      <h2>Greška</h2>
      <p>Alat s nazivom "${naziv}" nije pronađen.</p>
      <p><a href="/alati">Povratak na popis alata</a></p>
    `);
  }
});

app.get("/alati/detalji", (req, res) => {
  const alatiRepo = new AlatiRepozitorij();
  const naziv = req.query.naziv;
  
  if (!naziv) {
    return res.send(`
      <h2>Greška</h2>
      <p>Naziv alata nije naveden.</p>
      <p><a href="/alati">Povratak na popis alata</a></p>
    `);
  }

  const alat = alatiRepo.dohvatiPoNazivu(naziv);
  
  if (!alat) {
    return res.send(`
      <h2>Greška</h2>
      <p>Alat s nazivom "${naziv}" nije pronađen.</p>
      <p><a href="/alati">Povratak na popis alata</a></p>
    `);
  }

  const html = `
    <!DOCTYPE html>
    <html lang="hr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="author" content="David Sedlan">
      <meta name="keywords" content="AI alati, detalji, ${alat.naziv}">
      <meta name="description" content="Detalji o AI alatu ${alat.naziv}">
      <title>AI Alati - Detalji ${alat.naziv}</title>
      <link rel="stylesheet" href="/dizajn/dsedlan.css">
      <link rel="stylesheet" href="/dizajn/dsedlan-responzivnost.css">
      <script src="/JSklijent/dsedlan.js"></script>
    </head>
    <body>
      <header>
        <div class="header-sadrzaj">
          <a href="/index" class="logo-link">
            <img src="/resursi/slike/logo_stranice.jpg" alt="AI Alati Logo" class="logo">
          </a>
          <h1 class="naslov-stranice">AI Alati</h1>
        </div>
        <nav>
          <ul>
            <li><a href="/index">Početna</a></li>
            <li><a href="/dokumentacija">Dokumentacija</a></li>
            <li><a href="/autor">Autor</a></li>
            <li><a href="/primjene">Primjene AI alata</a></li>
            <li><a href="/resursiStranice">Resursi</a></li>
            <li><a href="/obrazac">Obrazac validacija</a></li>
            <li><a href="/alati">Alati</a></li>
            <li><a href="/api/alati">API Alati</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <h1>Detalji alata</h1>
        
        <section class="alat-sekcija">
          <div class="detalji-alata">
            <h2>${alat.naziv}</h2>
            <div class="detalji-sadrzaj">
              <p><strong>Opis:</strong> ${alat.opis}</p>
              <p><strong>Kategorija:</strong> ${alat.kategorija}</p>
              <p><strong>Godina:</strong> ${alat.godina || 'Nije navedena'}</p>
              <p><strong>Poveznica:</strong> <a href="${alat.poveznica}" target="_blank" class="poveznica-alat">${alat.poveznica}</a></p>
            </div>
            <div class="detalji-akcije">
              <a href="/alati" class="gumb-povratak">Povratak na popis alata</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div class="footer-ikone">
          <a href="https://chat.openai.com/" target="_blank" title="ChatGPT">
            <img src="/resursi/slike/GPT_logo.png" alt="ChatGPT ikona">
          </a>
          <a href="https://openai.com/dall-e-3" target="_blank" title="DALL·E">
            <img src="/resursi/slike/DALLE_logo.webp" alt="DALL·E ikona">
          </a>
          <a href="https://github.com/features/copilot" target="_blank" title="GitHub Copilot">
            <img src="/resursi/slike/Github_copilot.jpg" alt="GitHub Copilot ikona">
          </a>
        </div>
        <p class="footer-autor">David Sedlan &copy; 2025</p>
        <div class="footer-validacija">
          <a href="http://validator.w3.org/check?uri=spider.foi.hr/OWT/2025/zadaca_01/dsedlan22/html/alati.html">
            <img width="35" height="35" src="https://spider.foi.hr/OWT/materijali/slike/HTML5.png" alt="Valid HTML5">
          </a>
        </div>
      </footer>
    </body>
    </html>
  `;

  res.send(html);
});

app.get("/api/alati", (req, res) => {
  const alatiRepo = new AlatiRepozitorij();
  const kategorija = req.query.kategorija;
  const alati = alatiRepo.dohvatiSve(kategorija);

  res.setHeader('Content-Type', 'application/json');
  res.json(alati);
});

app.post("/api/alati", (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const { naziv, opis, kategorija, poveznica, godina } = req.body;
  if (!naziv || !opis || !kategorija || !poveznica) {
    return res.status(400).json({
      greska: "Neispravni ili nepotpuni podaci za alat."
    });
  }

  const noviAlat = {
    naziv,
    opis,
    kategorija,
    poveznica,
    godina: godina ? parseInt(godina) : null
  };

  const alatiRepo = new AlatiRepozitorij();
  if (alatiRepo.dodajNovi(noviAlat)) {
    res.status(201).json(noviAlat);
  } else {
    res.status(400).json({
      greska: "Neispravni ili nepotpuni podaci za alat."
    });
  }
});

app.put("/api/alati", (req, res) => {
  res.status(405).json({
    greska: "Metoda nije dopuštena za popis alata."
  });
});

app.delete("/api/alati", (req, res) => {
  res.status(405).json({
    greska: "Metoda nije dopuštena za popis alata."
  });
});

app.get("/api/alati/:naziv", (req, res) => {
  const alatiRepo = new AlatiRepozitorij();
  const alat = alatiRepo.dohvatiPoNazivu(req.params.naziv);

  if (!alat) {
    return res.status(404).json({
      greska: "AI alat s traženim nazivom nije pronađen."
    });
  }

  res.json(alat);
});

app.post("/api/alati/:naziv", (req, res) => {
  res.status(405).json({
    greska: "Metoda nije dopuštena za specifični alat."
  });
});

app.put("/api/alati/:naziv", (req, res) => {
  const alatiRepo = new AlatiRepozitorij();
  const { naziv, opis, kategorija, poveznica, godina } = req.body;

  if (!naziv || !opis || !kategorija || !poveznica) {
    return res.status(400).json({
      greska: "Neispravni podaci za ažuriranje."
    });
  }

  const postojeciAlat = alatiRepo.dohvatiPoNazivu(req.params.naziv);
  if (!postojeciAlat) {
    return res.status(404).json({
      greska: "AI alat s traženim nazivom nije pronađen za ažuriranje."
    });
  }

  const noviAlat = {
    naziv,
    opis,
    kategorija,
    poveznica,
    godina: godina ? parseInt(godina) : null
  };

  if (alatiRepo.azurirajPostojeci(req.params.naziv, noviAlat)) {
    res.json(noviAlat);
  } else {
    res.status(400).json({
      greska: "Neispravni podaci za ažuriranje."
    });
  }
});

app.delete("/api/alati/:naziv", (req, res) => {
  const alatiRepo = new AlatiRepozitorij();

  const postojeciAlat = alatiRepo.dohvatiPoNazivu(req.params.naziv);
  if (!postojeciAlat) {
    return res.status(404).json({
      greska: "AI alat s traženim nazivom nije pronađen za brisanje."
    });
  }

  if (alatiRepo.ukloniPoNazivu(req.params.naziv)) {
    res.status(204).send();
  } else {
    res.status(404).json({
      greska: "AI alat s traženim nazivom nije pronađen za brisanje."
    });
  }
});

app.use((req, res) => {
  res.status(404).send(`
    <h2>Stranica ne postoji!</h2>
    <p><a href="/index">Vrati me na početnu</a></p>
  `);
});

app.listen(port, () => {
  console.log(`Server pokrenut na portu ${port}`);
});

