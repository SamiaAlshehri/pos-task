const bcrypt = require('bcrypt');

const saltRounds = 10;

bcrypt.hash('Admin@123', saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Admin hash:', hash);
});

bcrypt.hash('User@123', saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('User hash:', hash);
});