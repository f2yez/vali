const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://lamanafei:AkaiSera@cluster0.upv53lm.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

  module.exports = mongoose;
