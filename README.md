# DIGITALIS TOGO — Site vitrine

Site statique institutionnel (HTML5 + CSS3 + JavaScript vanilla).
Aucun build, aucune base de données. Compatible hébergement statique.

## Lancer en local

```bash
# serveur statique simple (exemples)
npx serve .
# ou
python -m http.server 8000
```

Puis ouvrir http://localhost:8000

## Structure

```
index.html              Accueil (FR)
services.html           Services (FR)
mentions-legales.html   Mentions légales (FR)
en/                     Versions anglaises
assets/css/             main, animations, components, responsive
assets/js/              config, main, animations, scroll, navigation, contact
assets/vendor/          GSAP, ScrollTrigger, Lenis, SplitType (local, aucune CDN)
assets/logo/            Logo SVG animable
favicon/
robots.txt / sitemap.xml
```

## Configuration

Toutes les données à confirmer (adresse, URLs réseaux sociaux, endpoint
formulaire, nom de domaine) sont centralisées dans `assets/js/config.js`.
Les champs `null`/vides masquent automatiquement l'information affichée.

## Formulaire de contact

Le formulaire fonctionne en `mailto:` par défaut. Pour un envoi sécurisé,
renseigner `contact.formEndpoint` dans `config.js` avec l'URL d'un service
d'externe (ex. endpoint serverless). Aucune clé API n'est exposée côté client.

## Logo

`assets/logo/logo.svg` est une version vectorisée basée sur la description
fournie (monogramme DT, vert `#6AB04C`, bleu `#1E4DA1`, carrés pixelisés).
Le fichier officiel doit le remplacer dès sa fourniture — la structure SVG
permet déjà l'animation des pixels et du monogramme.
