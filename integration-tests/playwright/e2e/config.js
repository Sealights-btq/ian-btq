module.exports = {
    baseUrl: process.env.machine_dns || process.env.MACHINE_DNS || 'http://internal-ian.btq.sealights.co:8081',
    baseUrlNew: process.env.machine_dns || process.env.MACHINE_DNS || 'http://internal-ian.btq.sealights.co:8081',
    timeout: 30000, // Increased timeout for better reliability
    username: 'ian@testim.io',
    password: 'Testim123',
    loggedInUser: 'Hello, John',
    expectedPageTitle: 'Space & Beyond | Testim.io demo'
    
};

