const API_KEY = '362f72d835d69dc039e47537218b07fd7aeadb2d5f4f7ae4f17a06308b0633a1';

// const tickersHandlers = new Map();
const tickersHandlers = new Map(); // {}

// TODO: url search params
/*export const loadtickersHandlers = tickersHandlers =>
    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickersHandlers.join(",")}&tsyms=USD&api_key=${API_KEY}`
    )
        .then(r => r.json())
        .then(rawData=>
        Object.fromEntries(
            Object
                .entries(rawData)
                .map(([key, value]) => [key, value.USD])
        )
    );*/

const loadTickers = () => {
    if(tickersHandlers.size === 0) {
        return;
    }
    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(",")}&tsyms=USD&api_key=${API_KEY}`
    )
        .then(r => r.json())
        .then(rawData=> {
            const updatedPrices = Object.fromEntries(
                Object
                    .entries(rawData)
                    .map(([key, value]) => [key, value.USD])
            );
            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) ?? [];
                handlers.forEach(fn => fn(newPrice));
            })
        }
        );
}

export const subscribeToTicker = (ticker, cb) => {
    console.log(tickersHandlers)

    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
}

export const unsubscribeFromTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, subscribers.filter(fn => fn != cb));
}

setInterval(loadTickers, 5000);

window.tickersHandlers = tickersHandlers;