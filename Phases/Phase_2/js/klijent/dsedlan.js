
document.addEventListener('DOMContentLoaded', () => {
    //Aktivna stranica
    const trenutnaPutanja = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        const linkPutanja = link.getAttribute('href');
        const normaliziranaTrenutnaPutanja = trenutnaPutanja.replace(/^\/|\/$/g, '');
        const normaliziranaLinkPutanja = linkPutanja.replace(/^\/|\/$/g, '');
        
        const jeDetalji = normaliziranaTrenutnaPutanja === 'detalji' || normaliziranaTrenutnaPutanja.endsWith('detalji.html');
        
        if (normaliziranaTrenutnaPutanja === normaliziranaLinkPutanja || 
            (normaliziranaTrenutnaPutanja === '' && normaliziranaLinkPutanja === 'index') ||
            (normaliziranaTrenutnaPutanja === 'index' && normaliziranaLinkPutanja === '') ||
            (jeDetalji && normaliziranaLinkPutanja === 'detalji')) {
            link.classList.add('aktivna-stranica');
        }
    });

    //Klizac
    const klizac = document.querySelector('.klizac');
    if (klizac) {
        const radioGumbi = klizac.querySelectorAll('input[type="radio"]');
        const slajdovi = klizac.querySelectorAll('.slajd');
        let trenutniIndeks = 0;
        let timer;

        function prikaziSlajd(indeks) {
            radioGumbi.forEach(gumb => gumb.checked = false);
            
            radioGumbi[indeks].checked = true;
            
            trenutniIndeks = indeks;
        }

        function sljedeciSlajd() {
            const noviIndeks = (trenutniIndeks + 1) % slajdovi.length;
            prikaziSlajd(noviIndeks);
        }

        function prethodniSlajd() {
            const noviIndeks = (trenutniIndeks - 1 + slajdovi.length) % slajdovi.length;
            prikaziSlajd(noviIndeks);
        }

        function pokreniAutomatskoKlizanje() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(sljedeciSlajd, 5000);
        }

        radioGumbi.forEach((gumb, indeks) => {
            gumb.addEventListener('change', () => {
                prikaziSlajd(indeks);
                pokreniAutomatskoKlizanje();
            });
        });

        const strelice = klizac.querySelectorAll('.strelica');
        strelice.forEach(strelica => {
            strelica.addEventListener('click', () => {
                if (strelica.classList.contains('strelica-desno')) {
                    sljedeciSlajd();
                } else {
                    prethodniSlajd();
                }
                pokreniAutomatskoKlizanje();
            });
        });

        prikaziSlajd(0);
        pokreniAutomatskoKlizanje();
    }

    //Lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxSlika = document.getElementById('lightbox-slika');
        const zatvoriGumb = document.querySelector('.lightbox-zatvori');
        const galerijaSlike = document.querySelectorAll('.galerija-slika');

        function otvoriLightbox(slika) {
            lightboxSlika.src = slika.src;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function zatvoriLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }

        galerijaSlike.forEach(slika => {
            slika.addEventListener('click', () => otvoriLightbox(slika));
        });

        zatvoriGumb.addEventListener('click', zatvoriLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                zatvoriLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                zatvoriLightbox();
            }
        });
    }

    // 6 rijeci i ...
    const tekstoviOpisa = document.querySelectorAll('.tekst-opis');
    if (tekstoviOpisa.length > 0) {
        tekstoviOpisa.forEach(tekst => {
            const puniTekst = tekst.textContent.trim();
            tekst.setAttribute('data-full', puniTekst);
            tekst.textContent = puniTekst;

            const puniTekstIzAtributa = tekst.getAttribute('data-full');
            
            const rijeci = puniTekstIzAtributa.split(' ');
            
            if (rijeci.length > 6) {
                const skraceni = rijeci.slice(0, 6).join(' ');

                tekst.textContent = skraceni + ' ';
                
                const elipsa = document.createElement('span');
                elipsa.classList.add('prikazi-vise');
                elipsa.textContent = '...';
                tekst.appendChild(elipsa);

                elipsa.addEventListener('click', () => {
                    tekst.textContent = tekst.getAttribute('data-full');
                });
            }
        });
    }
}); 