const fetch = require('node-fetch'); // If using Node.js v18+, you can use global fetch

/**
 * Logs a message to the test server.
 * @param {string} stack
 * @param {string} level
 * @param {string} packageName
 * @param {string} message
 */
async function log(stack, level, packageName, message) {
    const logPayload = {
        stack,
        level,
        package: packageName,
        message
    };

    try {
        const response = await fetch('http://20.244.56.144/evaluation-service/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logPayload)
        });
        const result = await response.json();
        console.log('Log sent:', result);
    } catch (error) {
        console.error('Logging failed:', error);
    }
}

module.exports = log;