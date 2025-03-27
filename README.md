# Clicker, webbprojekt

Du har fått i uppdrag att designa och skapa ett clicker-spel från Kakmonstret AB.
Till ditt förfogande har du lite kod som en tidigare anställd lämnat efter sig, använd den.

En clicker, eller mer specifikt en cookie-clicker är ett spel, läs mer [här](https://en.wikipedia.org/wiki/Cookie_Clicker)

## Uppgift

Du ska designa och skapa ett clickerspel. Den grundläggande javascriptskoden, samt viss html finns i detta repo. Målet är inte att koda själva spelfunktionerna, men du är välkommen att ändra i koden för att passa ditt tema och upplägg.

Fokuset är att prova på javascript.
Du ska även utveckla din egen klicker-ide (design) eller bygga vidare på den som finns för att ha ett material att arbeta med.
Så börja med att planera ditt tema.

-   Vad ska spelet handla om?
-   Hur fungerar det?
    -   Valuta
    -   Syfte
-   Vilka uppgraderingar ska gå att köpa?
-   Achievement eller milstolpar?

När du har skrivit ned och bestämt detta så, skapa en logga, designa en knapp, planera spelets layout.
Skissa med Figma om du vill. Men du ska skriva ned och anteckna.

-   Färger
-   Bilder
-   Typsnitt
-   Layout
-   Animationer

## Material

Forka detta repo och arbeta i det. Det finns ganska mycket att utgå ifrån och ändra på så en stor del är att förstå koden du har fått.
Vad vaksam på att javascript koden använder klasser och id för att välja element, så om du ändrar på dom så måste du ändra i javascriptet också.

## Dokumentering

Spara ditt planerings / skiss-material i en mapp i detta repo (dokumentation).
Länka till Figma om du använt det.
Skriv kort ned vad du arbetar med i anteckningar.md

Vi kommer att skriva post mortem när vi är klara, pm.md.

## Kravspec

-   Fungerande Clicker med eget tema och design **utifrån planering**.
-   Använder javascript.
-   Inga fel, validerande html / css.
-   Anpassade och redigerade bilder.
-   Hosting på GitHub pages.
-   Material ni får dela, undersök licenser.

## Tid och övrigt

Se classroom.

GLHF!

Tack [Malte](https://github.com/Mafrans) för lite ideér.

## Javascript koncept för att förstå koden

I den ordning de förekommer i koden.

### Importera från andra filer

Genom att använda `import` kan vi importera funktioner och klasser från andra filer. För att det ska fungera måste filen vi importerar från exportera det vi vill använda.

```javascript
import { Cookie } from "./cookie.js";
```

```javascript
export const Cookie = 4
```

### Variabler, let och const

`let` och `const` används för att deklarera variabler. `let` används för variabler som kan ändras, medan `const` används för konstanter som inte kan ändras.

### Välja element från DOM (Document Object Model)

Med `document.querySelector(selector)` kan vi hämta det element vi behöver från HTML-dokumentet. Vi sparar elementen i `const`-variabler eftersom vi inte kommer att ändra deras värden. 

Läs mer:
- [const - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [querySelector - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

**Viktigt:**  
- `querySelector` returnerar det första matchande HTML-elementet på sidan.  
- Om du behöver välja flera element, använd `querySelectorAll()`, som returnerar en lista av matchande element.

Elementet matchas med en CSS-selektor, som i detta fall är `'#clicker-button'`. Men du kan använda andra selektorer, som klassnamn eller taggar.

```javascript
const clickerButton = document.querySelector('#clicker-button');
```

### Event Listeners

Med ett valt element, som exempelvis en knapp, kan vi använda `addEventListener` för att lyssna på specifika händelser, som ett klick, på HTML-elementet. Detta är en central del av hur klickerknappen i spelet fungerar.

När vi lyssnar på händelsen `'click'`, anger vi en callback-funktion som körs varje gång händelsen inträffar. I detta fall används en anonym funktion som callback. Inuti funktionen läggs `moneyPerClick` till variabeln `money` för varje klick.

Läs mer: [addEventListener - MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

```javascript
clickerButton.addEventListener('click', function() {
    money += moneyPerClick;
});
```

### Räkna tid och uppdatera spelet

För att driva clicker-spelet används metoden `requestAnimationFrame`.  
Denna metod försöker uppdatera spelet i takt med användarens skärms uppdateringsfrekvens, vanligtvis 60 gånger per sekund.  

Läs mer: [requestAnimationFrame - MDN](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)  

Funktionen `step` används som en callback till `requestAnimationFrame`.  
Det är denna funktion som ansvarar för att uppdatera spelets text och pengar.  
I slutet av funktionen anropas den på nytt för att fortsätta uppdateringen.

```javascript
const step = (timestamp) => {
    moneyDisplay.textContent = money;
    requestAnimationFrame(step);
}
requestAnimationFrame(step);
```

### Att skapa nya element och lägga till dem i DOM
Funktionerna `CreateCard`, som förekommer i olika typer i koden, tar ett objekt som parameter och genererar HTML-kod för det. För att skapa nya HTML-element används metoden `document.createElement()`. De skapade elementen lagras i variabler för att kunna ändra på dem.

Klasser kan läggas till dessa element med `classList.add()`, och text kan tilldelas elementet med `textContent = 'värde'`.

En event-lyssnare kopplas till kortet, där logiken för att köpa en uppgradering implementeras. Texten på elementen ändras med `textContent` för att visa att uppgraderingen köpts. Texten skriver vi ut med en text literal för att inkludera variabler. Syntaxen är `${variabel}`.

Slutligen läggs kortets innehåll till i kortet självt, och elementet returneras. Det använder vi för att lägga till kortet i DOM med `appendChild()`.

Läs mer:
- [Document.createElement - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
- [Element.classList - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
- [Node.textContent - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- [Node.appendChild - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)
- [String - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

#### Skapa kort för byggnader och uppgraderingar

#### Skapa alert med messages

