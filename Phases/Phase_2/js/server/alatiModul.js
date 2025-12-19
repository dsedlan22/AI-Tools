const ds = require('fs');
const path = require('path');

class AlatiRepozitorij {
    dohvatiSve(kategorija) {
        const sadrzajDatoteke = ds.readFileSync(path.join(__dirname, '../../resursi/alati.csv'), 'utf-8');
        
        const redovi = sadrzajDatoteke.split('\n').filter(red => red.trim());
         
        const alati = redovi.map(red => {
            const [naziv, opis, kategorija, poveznica, godina] = red.split(';');
            return {
                naziv,
                opis,
                kategorija,
                poveznica,
                godina: parseInt(godina) || null
            };
        });

        if (kategorija) {
            return alati.filter(alat => 
                alat.kategorija.toLowerCase() === kategorija.toLowerCase()
            );
        }

        return alati;
    }

    ukloniPoNazivu(naziv) {
        const putanjaDatoteke = path.join(__dirname, '../../resursi/alati.csv');
        const sadrzajDatoteke = ds.readFileSync(putanjaDatoteke, 'utf-8');
        
        const redovi = sadrzajDatoteke.split('\n').filter(red => red.trim());
        
        const noviRedovi = redovi.filter(red => {
            const trenutniNaziv = red.split(';')[0];
            return trenutniNaziv !== naziv;
        });

        if (noviRedovi.length === redovi.length) {
            return false;
        }

        const noviSadrzaj = noviRedovi.join('\n') + '\n';
        ds.writeFileSync(putanjaDatoteke, noviSadrzaj, 'utf-8');
        
        return true;
    }

    dohvatiPoNazivu(naziv) {
        const sadrzajDatoteke = ds.readFileSync(path.join(__dirname, '../../resursi/alati.csv'), 'utf-8');
        
        const redovi = sadrzajDatoteke.split('\n').filter(red => red.trim());
        
        const trazeniRed = redovi.find(red => {
            const trenutniNaziv = red.split(';')[0];
            return trenutniNaziv === naziv;
        });

        if (!trazeniRed) {
            return null;
        }

        const [nazivAlata, opis, kategorija, poveznica, godina] = trazeniRed.split(';');
        return {
            naziv: nazivAlata,
            opis,
            kategorija,
            poveznica,
            godina: parseInt(godina) || null
        };
    }

    dodajNovi(alatObjekt) {
        if (!alatObjekt.naziv || !alatObjekt.opis || !alatObjekt.kategorija || !alatObjekt.poveznica) {
            return false;
        }

        const godina = alatObjekt.godina && !isNaN(alatObjekt.godina) ? alatObjekt.godina : '';

        const noviRed = [
            alatObjekt.naziv,
            alatObjekt.opis,
            alatObjekt.kategorija,
            alatObjekt.poveznica,
            godina
        ].join(';');

        const putanjaDatoteke = path.join(__dirname, '../../resursi/alati.csv');
        
        let sadrzajDatoteke = '';
        try {
            sadrzajDatoteke = ds.readFileSync(putanjaDatoteke, 'utf-8');
        } catch (error) {
        }

        const separator = sadrzajDatoteke && !sadrzajDatoteke.endsWith('\n') ? '\n' : '';
        ds.appendFileSync(putanjaDatoteke, separator + noviRed + '\n', 'utf-8');

        return true;
    }

    azurirajPostojeci(naziv, noviAlatObjekt) {
        if (!noviAlatObjekt.naziv || !noviAlatObjekt.opis || !noviAlatObjekt.kategorija || !noviAlatObjekt.poveznica) {
            return false;
        }

        const putanjaDatoteke = path.join(__dirname, '../../resursi/alati.csv');
        const sadrzajDatoteke = ds.readFileSync(putanjaDatoteke, 'utf-8');
        
        const redovi = sadrzajDatoteke.split('\n').filter(red => red.trim());
        
        const indeksRetka = redovi.findIndex(red => {
            const trenutniNaziv = red.split(';')[0];
            return trenutniNaziv === naziv;
        });

        if (indeksRetka === -1) {
            return false;
        }

        const godina = noviAlatObjekt.godina && !isNaN(noviAlatObjekt.godina) ? noviAlatObjekt.godina : '';

        const noviRed = [
            noviAlatObjekt.naziv,
            noviAlatObjekt.opis,
            noviAlatObjekt.kategorija,
            noviAlatObjekt.poveznica,
            godina
        ].join(';');

        redovi[indeksRetka] = noviRed;

        const noviSadrzaj = redovi.join('\n') + '\n';
        ds.writeFileSync(putanjaDatoteke, noviSadrzaj, 'utf-8');
        
        return true;
    }
}

module.exports = AlatiRepozitorij;
