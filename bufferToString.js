const DatauriParser = require("datauri/parser")
const parser = new DatauriParser()

module.exports = (originalname, buffer) => {
    const extname = require('path').extname(originalname)
    // return datauri.format(extname, buffer).content
    return parser.format(extname, buffer).content
}

