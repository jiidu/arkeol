# Arkeol

**Versio 0.1.0-alpha** · selainpeli · englanti ja suomi · [GPL-3.0-or-later](LICENSE) + [nimeämisvaatimus](NOTICE)

Arkeol on Spelunkyn hengessä tehty 2D-kaivospeli, jonka maailma on rakennettu tiilistä ja generoidaan jokaisella kerroksella uudelleen. Pelaaja on arkeologi, joka pudottautuu kaivauskuilusta maan alle. Siellä on menneen maailman jäänteitä: kirjeitä, valokuvia ja arkisia esineitä, kuten kasettisoittimia ja lankapuhelimia, joita kukaan ei enää muista käyttäneensä. Tavoitteena on louhia kultaa ja timantteja, selvitä hengissä ja löytää ovi seuraavaan kerrokseen. Jokainen kerros on 40 metriä edellistä syvemmällä.

Matkan varrella tapaa maanalaisia asukkaita, jotka keittävät pannukahvia nuotiolla, kalastavat altailla, soittavat huuliharppua, neulovat ja lukevat vanhoja lehtiä.

Koko peli on yksi HTML-tiedosto. Sen grafiikka, musiikki ja äänet syntyvät koodissa, joten build-vaihetta, riippuvuuksia tai erillisiä kuva- ja äänitiedostoja ei tarvita.

> **Alpha-versio.** Peli on pelattava, mutta tasapaino, vaikeustaso ja osa ominaisuuksista ovat vielä kesken. Tallennusmuoto voi muuttua tulevissa versioissa.

## Pelaaminen

Avaa `index.html` selaimessa. Voit myös tarjoilla kansion millä tahansa staattisella palvelimella:

```sh
python3 -m http.server 8000
# avaa http://localhost:8000
```

Alkuvalikossa on Uusi peli, Asetukset, Tekijät ja Lisenssi sekä ennätyksesi: paras saalis, syvin saavutettu syvyys ja retkien määrä. Kieli (EN / FI), musiikin ja äänitehosteiden voimakkuus sekä ruudun tärinä säädetään asetuksista. Oletuskieli on englanti, ja valinta muistetaan. Fontit ladataan Google Fontsista; ilman verkkoyhteyttä peli toimii varafonteilla.

## Ohjaus

| Toiminto | Näppäimistö | Hiiri |
|---|---|---|
| Liiku | `A` `D` / nuolet | |
| Hyppää, ui | `Välilyönti` / `Z` | |
| Hakku | `X` (`W`/`S` tähtää ylös/alas) | **vasen nappi aina** (tähtää osoittimella) |
| Käytä työkaluriviltä valittua | `V` | **oikea nappi** |
| Valitse työkalurivistä | `1`–`6` | rulla tai klikkaus |
| Poimi kivi / heitä kivi | `E` / `T` | klikkaa kiveä / valitse kivi ja oikea nappi |
| Vaihda asetta | `Q` tai `2` uudelleen | klikkaa asepaikkaa uudelleen |
| Pikanäppäimet | `C` pora · `F` ase · `G` onki · `B` pommi · `R` köysi | |
| Ovi, juttelu, kauppa, kiipeäminen | `E` / `W` | klikkaa ovea, asukasta tai kauppiasta |
| Kartta / tauko / musiikki / äänet | `Tab` / `P` / `N` / `M` | |

Työkalurivi: 1 pora, 2 ase, 3 onki, 4 pommi, 5 köysi, 6 kivi. Hakku on aina hiiren vasemmassa napissa eikä näy työkalurivillä. Kädessä oleva työkalu tai ase osoittaa tähtäimen suuntaan.

Kosketusnäytöillä näkyvät omat ohjauspädit (hakku, käytä, hyppy, pommi, toimi), ja työkalurivistä valitaan napauttamalla.

## Ominaisuudet

- **Pudotus pinnalta:** ensimmäinen kerros alkaa auringonlaskun aikaan kaivausleiristä, josta arkeologi putoaa kuiluun. Syvemmillä kerroksilla edellisen kerroksen valo kajastaa kuilun suulta.
- **Proseduraaliset kerrokset:** luolat syntyvät soluautomaatilla. Kerroksissa on multaa, kiveä ja syvemmällä kovaa graniittia.
- **Erilaiset syvyydet:** multaluolat; hehkuvat syvyydet, joissa ilma väreilee kuumuudesta ja altaissa on laavaa; jäiset salit, joissa on jääpuikkoja, liukasta jäätä ja jäätyneitä altaita.
- **Harvinaiset aarteet:** kultaa on niukasti, eikä timantteja ole lainkaan ensimmäisellä kerroksella. Relikkikammiot löytyvät vasta syvemmältä.
- **Putoavat tippukivet ja jääpuikot**, jotka värisevät ennen putoamista.
- **Kivet:** poimi maasta ja heitä. Heitetty kivi tainnuttaa vihollisia ja laukaisee painelaattoja turvallisen matkan päästä.
- **Varusteet:** retki alkaa pelkällä hakulla. Pora, aseet, onki, pommit ja köydet ostetaan Sabulta tai löydetään laatikoista ja maanalaisilta asukkailta.
- **Aseet:** jousipyssy, varsijousi, pistooli, haulikko ja ruoska. Jousen ja varsijousen nuolet voi kerätä takaisin.
- **Kalastus:** heitä onki altaaseen, odota ja vedä, kun koho nykäisee.
- **Maanalaiset asukkaat:** harvinaisia kohtaamisia, korkeintaan yksi kutakin tyyppiä kerroksella. Heidän luonaan alkaa soida oma lämmin musiikki. Ensimmäisellä tapaamisella he antavat lahjan.
- **Viholliset:** kahdeksanjalkaiset hämähäkit sylkevät syövyttävää mönjää. Sudet partioivat, jahtaavat ja syöksyvät. Muumiot laahustavat tyhminä, kunnes huomaavat pelaajan; sitten ne lähtevät voihkien perään.
- **Ansat:** painelaatoista laukeavat nuoliansat.
- **Ympäristö:** valaistus ja pimeys, vakaa vesifysiikka, vesiputoukset, sukeltaminen ja happi, hämähäkinseitit, tippukivet, hehkusienet, kristallit ja soihdut.
- **Arkeologia:** 12 paperinpalaa, 8 valokuvaa ja 10 relikkiä 2000-luvun arjesta. Löydöt jäävät talteen Arkistoon.
- **Sabun kauppa:** egyptiläinen kauppias myy sydämiä, bensaa, ammuksia, aseita ja varusteita.
- **Saavutukset:** 28 saavutusta ja kumulatiiviset tilastot.
- **Musiikki:** viisi reaaliajassa generoitua kappaletta. Alkuvalikossa soi utuinen D-molli-teema, jossa okariinamainen melodia, harppu, tuuli ja kaukaiset patarummut. Multaluolissa soi luolan ambient, kuumissa syvyyksissä hijaz-teema ja jäisissä saleissa kristallinen frost-teema. Asukkaiden luona soi nuotiokappale. Jännityskerros voimistuu, kun viholliset ovat lähellä.

## Tekninen toteutus

- Yksi tiedosto: HTML, CSS ja JavaScript ilman kirjastoja.
- Piirto Canvas 2D:llä. Valaistus on oma, matalaresoluutioinen kerroksensa.
- Fysiikka ajetaan kiinteällä 60 Hz:n aika-askeleella. Vesi on soluautomaatti: solu putoaa, jos voi, ja muuten liikkuu kohti lähintä pudotusta. Ilman pudotusta se pysyy paikallaan, joten altaat eivät värise.
- Kaikki tekstit kulkevat käännöstaulukon kautta (`STR`), ja sisältö (lore, relikit, saavutukset, kauppa, asukkaat) on tallennettu muodossa `{en, fi}`. Uuden kielen voi lisätä täydentämällä nämä.
- Tallennus tapahtuu selaimen `localStorage`en avaimilla `arkeol-v1` (edistyminen) ja `arkeol-lang` (kieli).

## Tunnetut rajoitukset (alpha)

- Vaikeustasoa ja kauppahintoja ei ole vielä tasapainotettu.
- Biomit ja pomotaistelut puuttuvat.
- Tallennus on selainkohtainen.

## Muutosloki

### 0.1.0-alpha
- Ensimmäinen julkinen alpha-versio. Sisältää kaikki yllä luetellut ominaisuudet.

## Lisenssi ja nimeäminen

Copyright © 2026 JP Hakoluoto.

Arkeol on vapaa ohjelmisto. Sitä saa jakaa ja muokata [GNU General Public License -lisenssin version 3](LICENSE) tai (valintasi mukaan) minkä tahansa myöhemmän version ehdoilla. Muokatut versiot on julkaistava samalla lisenssillä ja lähdekoodeineen.

Lisäksi GPL-3.0:n kohdan 7(b) nojalla jokaisessa Arkeoliin perustuvassa työssä on säilytettävä [NOTICE](NOTICE)-tiedosto, ja alkuperäinen projekti on mainittava näkyvästi, esimerkiksi:

> Based on Arkeol by JP Hakoluoto · Perustuu JP Hakoluodon Arkeol-peliin

Kirjasinlajit (Ultra, Cormorant Garamond, Pixelify Sans, IBM Plex Mono, Special Elite, Caveat) ladataan Google Fontsista, ja niillä on omat avoimet lisenssinsä (SIL Open Font License / Apache 2.0). Ne eivät sisälly tähän pakettiin.
