/* En array med upgrades. Varje upgrade är ett objekt med egenskaperna name, cost
 * och amount. Önskar du ytterligare text eller en bild så går det utmärkt att
 * lägga till detta.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
const buildings = [
    {
        icon: "🤖",
        name: "Robot",
        resourcePerClick: 1,
        cost: 50,
        costFactor: 1.3,
        lore: "Clickmaster 9000",
        description: "En robot som ger dig extra kraft i varje klick",
    },
    {
        icon: "🏭",
        name: "Fabrik",
        resourcePerSecond: 2,
        cost: 200,
        costFactor: 1.5,
        lore: "Fabrique de bäst",
        description: "I fabriken produceras resurser per sekund",
    },
    {
        icon: "🦹",
        name: "Ond chef",
        resourcePerSecond: 1.5,
        cost: 300,
        costFactor: 1.4,
        lore: "Så ond att mjölken surnar",
        description: "En ond chef som ger dig extra resurser per click, får robotarna att jobba hårdare!",
    },
    {
        icon: "🏰",
        name: "Slott",
        resourcePerSecond: 5,
        cost: 1000,
        costFactor: 1.6,
        lore: "Vem vill inte ha ett slott liksom?",
        description: "Ett slott som ger dig extra resurser per sekund",
    },
    {
        name: "Katt",
        icon: "🐱",
        resourcePerClick: 10,
        cost: 500,
        costFactor: 1.7,
        lore: "En Katt som kan skjuta laser ur ögonen, klappad av den onda chefen",
        description: "En katt som stillar chefens nycker och ger dig extra resurser per click",
    }
];

buildings.sort((a, b) => a.cost - b.cost);

export { buildings };