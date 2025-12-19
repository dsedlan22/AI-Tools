document.addEventListener('DOMContentLoaded', () => {
    const obrazac = document.getElementById('obrazac-kontakt');
    const porukaGreske = document.getElementById('poruka-greske');
    
    const gumbReset = document.querySelector('#resetiraj') || obrazac.querySelector('[type="reset"]');
    if (gumbReset) {
        gumbReset.addEventListener('click', () => {
            obrisiGreske();
            sakrijPorukuGreske();
        });
    }

    function sakrijPorukuGreske() {
        porukaGreske.style.display = 'none';
    }

    function prikaziPorukuGreske(poruka) {
        porukaGreske.textContent = poruka;
        porukaGreske.style.display = 'block';
        
        // Automatski sakrij poruku nakon 5 sekundi
        setTimeout(sakrijPorukuGreske, 5000);
    }

    function obrisiGreske() {
        document.querySelectorAll('.greska').forEach(el => el.remove());
        document.querySelectorAll('.greska-polje').forEach(el => {
            el.classList.remove('greska-polje');
        });
        sakrijPorukuGreske();
    }

    function prikaziGresku(element, poruka) {
        element.classList.add('greska-polje');
        const greska = document.createElement('span');
        greska.className = 'greska';
        greska.textContent = poruka;
        element.parentNode.insertBefore(greska, element.nextSibling);
    }

    function validirajObaveznaPolja() {
        const obaveznaPolja = [
            'ime', 'prezime', 'email', 'datum', 'alat', 'iskustvo',
            'lozinka', 'ponovljena-lozinka', 'komentar', 'url', 'telefon', 'boja', 'ocjena', 'vrijeme-kontakta'
        ];
        let isValid = true;

        obaveznaPolja.forEach(id => {
            const element = document.getElementById(id);
            if (!element.value.trim()) {
                prikaziGresku(element, 'Ovo polje je obavezno');
                isValid = false;
            }
        });

        return isValid;
    }

    function validirajCheckbox() {
        const checkbox = document.getElementById('uvjeti');
        if (!checkbox.checked) {
            prikaziGresku(checkbox, 'Morate prihvatiti uvjete korištenja');
            return false;
        }
        return true;
    }

    function validirajSpol() {
        const spol = document.querySelector('input[name="spol"]:checked');
        if (!spol) {
            const spolGrupa = document.querySelector('.radio-grupa');
            prikaziGresku(spolGrupa, 'Morate odabrati spol');
            return false;
        }
        return true;
    }

    function validirajLozinke() {
        const lozinka = document.getElementById('lozinka');
        const ponovljenaLozinka = document.getElementById('ponovljena-lozinka');
        
        if (lozinka.value !== ponovljenaLozinka.value) {
            prikaziGresku(ponovljenaLozinka, 'Lozinke se ne podudaraju');
            return false;
        }
        return true;
    }

    function validirajIskustvo() {
        const iskustvo = document.getElementById('iskustvo');
        iskustvo.value = iskustvo.value.trim();
        
        if (!iskustvo.value) {
            return false;
        }

        if (iskustvo.value.includes(',')) {
            prikaziGresku(iskustvo, 'Koristite točku (.) umjesto zareza kao decimalni separator');
            return false;
        }
    
        if (!/^\d*\.?\d*$/.test(iskustvo.value)) {
            prikaziGresku(iskustvo, 'Dozvoljeni su samo brojevi i točka kao decimalni separator');
            return false;
        }

        const decimalniDio = iskustvo.value.split('.')[1];
        if (decimalniDio && decimalniDio.length > 2) {
            prikaziGresku(iskustvo, 'Broj može imati najviše dvije decimale');
            return false;
        }

        return true;
    }

    function validirajKomentar() {
        const komentar = document.getElementById('komentar');
        const sadrzaj = komentar.value;

        if (sadrzaj.length < 200 || sadrzaj.length > 1000) {
            prikaziGresku(komentar, 'Komentar mora imati između 200 i 1000 znakova');
            return false;
        }

        const hrvatskiRegex = /^[a-zA-ZčćžšđČĆŽŠĐ0-9\s.,!?;:()\-_+=@#$%^&*<>[\]{}|\\\/"'`~]+$/;
        if (!hrvatskiRegex.test(sadrzaj)) {
            prikaziGresku(komentar, 'Komentar smije sadržavati samo slova hrvatske abecede, brojke, razmake i osnovne interpunkcijske znakove');
            return false;
        }

        const urlRegex = /https?:\/\/[^\s]+\.(hr|com|org)/;
        if (!urlRegex.test(sadrzaj)) {
            prikaziGresku(komentar, 'Komentar mora sadržavati barem jedan URL koji završava s .hr, .com ili .org');
            return false;
        }

        if (sadrzaj.includes('$') || sadrzaj.includes('€')) {
            prikaziGresku(komentar, 'Komentar ne smije sadržavati znakove $ ili €');
            return false;
        }

        return true;
    }

    function validirajBoju() {
        const boja = document.getElementById('boja');
        if (boja.value === '#000000') {
            prikaziGresku(boja, 'Molimo odaberite boju različitu od crne');
            return false;
        }
        return true;
    }

    function validirajOcjenu() {
        const ocjena = document.getElementById('ocjena');
        const vrijednost = parseInt(ocjena.value);
        
        if (vrijednost === 5 && !ocjena.hasAttribute('data-changed')) {
            prikaziGresku(ocjena, 'Molimo odaberite ocjenu');
            return false;
        }

        if (isNaN(vrijednost) || vrijednost < 1 || vrijednost > 10) {
            prikaziGresku(ocjena, 'Ocjena mora biti između 1 i 10');
            return false;
        }

        return true;
    }
    const ocjenaInput = document.getElementById('ocjena');
    if (ocjenaInput) {
        ocjenaInput.addEventListener('input', function() {
            this.setAttribute('data-changed', 'true');
        });
    }

    function validirajVrijemeKontakta() {
        const vrijemeInput = document.getElementById('vrijeme-kontakta');
        const vrijednost = vrijemeInput.value;
        
        if (!vrijednost) {
            prikaziGresku(vrijemeInput, 'Molimo odaberite vrijeme za kontakt');
            return false;
        }

        return true;
    }

    obrazac.addEventListener('submit', (event) => {
        obrisiGreske();

        const validacije = [
            validirajObaveznaPolja(),
            validirajCheckbox(),
            validirajSpol(),
            validirajLozinke(),
            validirajIskustvo(),
            validirajKomentar(),
            validirajBoju(),
            validirajOcjenu(),
            validirajVrijemeKontakta()
        ];

        if (validacije.some(valid => !valid)) {
            event.preventDefault();
            prikaziPorukuGreske('Molimo ispravite greške u obrascu prije slanja.');
            const prvaGreska = document.querySelector('.greska, .greska-polje');
            if (prvaGreska) {
                prvaGreska.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
