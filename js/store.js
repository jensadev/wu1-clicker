/* En array med upgrades. Varje upgrade är ett objekt med egenskaperna name, cost
 * och amount. Önskar du ytterligare text eller en bild så går det utmärkt att
 * lägga till detta.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
const upgrades = [
    {
        icon: "🦹",
        name: "En uberlord",
        description: "Du får en produktion per sekund för varje robot du har.",
        lore: "Uberlord som motiverar dina robotar.",
        cost: 1000,
        costFactor: 1.5,
        building: "Robot",
        resourceFactor: 0.1,
    },
    {
        icon: "🏭",
        name: "Automagiserade fabriker",
        description: "Ökar fabrikproduktionen med 10%",
        lore: "Fabrikerna är nu automagiserade.",
        cost: 3000,
        building: "Fabrik",
        costFactor: 1.5,
        resourceFactor: 0.2,
    },
    {
        icon: "🤖",
        name: "Robot AI",
        description: "Ökar robotproduktionen med 20%.",
        lore: "Robotarna har nu artificiell intelligens och arbetar snabbare.",
        cost: 5000,
        costFactor: 1.6,
        building: "Robot",
        resourceFactor: 0.2,
    },
    {
        icon: "🏢",
        name: "Fabrikigare fabriker",
        description: "Ökar fabrikproduktionen med 25%.",
        lore: "Fabrik, mer verkstad.",
        cost: 8000,
        costFactor: 1.7,
        building: "Fabrik",
        resourceFactor: 0.25,
    },
    {
        icon: "☀️",
        name: "Starkare sol",
        description: "Ökar solpanelernas produktion med 15%.",
        lore: "Solen är starkare än någonsin.",
        cost: 4000,
        costFactor: 1.5,
        building: "Solpaneler",
        resourceFactor: 0.15,
    },
    {
        icon: "🔋",
        name: "Batterilagring",
        description: "Lagrar energi från solpanelerna och ökar produktionen med 20%.",
        lore: "Batterier lagrar energi för att användas senare.",
        cost: 7000,
        costFactor: 1.6,
        building: "Solpaneler",
        resourceFactor: 0.2,
    },
];

const buildings = [
    {
        name: "Robot",
        resourcePerClick: 1,
        cost: 50,
        costFactor: 1.3,
        lore: "Clickmaster 9000",
        description: "En robot som ger dig extra kraft i varje klick",
    },
    {
        name: "Fabrik",
        resourcePerSecond: 2,
        cost: 200,
        costFactor: 1.5,
        lore: "Fabrique de bäst",
        description: "I fabriken produceras resurser per sekund",
    },
    {
        name: "Solpaneler",
        resourcePerSecond: 1.5,
        cost: 300,
        costFactor: 1.4,
        lore: "Solkraft för framtiden",
        description: "Solpaneler som genererar resurser per sekund med hjälp av solen.",
    },
];

upgrades.sort((a, b) => a.cost - b.cost);
buildings.sort((a, b) => a.cost - b.cost);

export { upgrades, buildings };