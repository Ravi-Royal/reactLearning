
const https = require('https');

const urls = [
    { name: 'ExchangeRate', url: 'https://open.er-api.com/v6/latest/USD' }
];

urls.forEach(item => {
    https.get(item.url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`\n--- ${item.name} Status: ${res.statusCode} ---`);
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(data);
                    // Just listing keys starting with X to check for XAU/XAG
                    console.log('ExchangeRate Keys:', Object.keys(json.rates).filter(k => k.startsWith('X')));
                } catch (e) { console.log('Parse error', e); }
            }
        });
    });
});
