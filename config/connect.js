const mongoose = require('mongoose')

async function connect(){
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Database connection successfully`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {connect}