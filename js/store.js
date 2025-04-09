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
        name: "Automatiserade fabriker",
        description: "Ökar fabrikproduktionen med 10%",
        lore: "Fabrikerna är nu automatiserade",
        cost: 5000,
        costFactor: 1.5,
        building: "Fabrik",
        resourceFactor: 0.15,
    },
]

const buildings = [
    {
        name: "Robot",
        resourcePerClick: 1,
        cost: 50,
        costFactor: 1.3,
        lore: "En robot som producerar saker",
        description: "Ger pengar per klick",
    },
    {
        name: "Fabrik",
        resourcePerSecond: 2,
        cost: 100,
        costFactor: 1.5,
        lore: "En fabrik som producerar varor",
        description: "Ger pengar per sekund",
    },
]

upgrades.sort((a, b) => a.cost - b.cost);
buildings.sort((a, b) => a.cost - b.cost);

export { upgrades, buildings }