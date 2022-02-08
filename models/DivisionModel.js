const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DivisionSchema = new Schema({
    name: {
        type: String
    },
    president: {
        type: String
    }
});

const Division = mongoose.model('division', DivisionSchema);

module.exports = Division;