var config = {
    local: {
        mode: 'local',
        ip: '0.0.0.0',
        port: 3000
    },
    staging: {
        mode: 'staging',
        ip: '0.0.0.0',
        port: 4000
    },
    production: {
        mode: 'production',
        ip: '11.11.254.69',
        port: 5000
    }
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}