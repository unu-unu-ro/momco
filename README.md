# HAR PENTRU HAOS — momco (SPA)

Single-page app mobilă pentru parcurgerea devoționalului de 31 de zile folosind conținutul din `continut.json`.

## Cum rulezi local

Orice server static funcționează. Pe Windows (PowerShell):

```powershell
# Opțiunea 1: Python 3 (dacă e instalat)
python -m http.server 8080

# Opțiunea 2: Node.js (dacă e instalat)
# npm i -g serve
serve -l 8080
```

Apoi deschide în browser:

- http://localhost:8080/index.html (sau calea corespunzătoare)

## Caracteristici

- Design curat, modern, în stil momco, mobile-first
- Navigare rapidă între zile (chips + butoane ◄ ►)
- Păstrează progresul (LocalStorage)
- Deep link la zi: parametru `?zi=7`
- Copiere link zi curentă

## Structură

- `index.html` – shell-ul aplicației
- `styles.css` – stilurile mobile-first
- `app.js` – logica SPA (încărcare și randare conținut)
- `continut.json` – datele (31 de zile)

## Personalizare rapidă

- Culori: în `styles.css` la `:root`
- Titlu/Motto: în `index.html` header

## Note

Dacă deschizi fișierele direct cu file://, unele browsere blochează `fetch` din fișier. Rulează printr-un server static (vezi mai sus).
