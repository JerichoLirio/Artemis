function getData(){
    const fs = require('fs');
    let rawdata = fs.readFileSync('./data/userData.json');
    return JSON.parse(rawdata);
}

module.exports.getData = getData;