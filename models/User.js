'user strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var eat = require('eat');

var userSchema = mongoose.Schema({
  username: String,
  randomString: String,
  basic: {
    email: {type: String, unique: true},
    password: String
  }
});

userSchema.methods.generateHash = function (password, callback) {
  bcrypt.genSalt(8, function (err, salt) {
    if (err) {
      return res.status(500).json({msg: 'internal server error'});
    }
    bcrypt.hash(password, salt, null, function (err, hash) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      callback(null, hash);
    })
  })
};

// userSchema.methods.checkPassword = function (password) {
//   return bcrypt.compareSync(password, this.basic.password);
// };

userSchema.methods.checkPassword = function (password, callback) {
  console.log('THIS : ' + this);
  console.log('PASSWORD : ' + password);
  bcrypt.compare(password, this.basic.password, function (err, result) {
    console.log('THIS.BASIC : ' + this.basic);
    console.log('RESULT : ' + result);
    if (err) {
      console.log(err);
      return;
      // return res.status(500).json({msg: 'internal server error'});
    }
    callback(null, result);
  })
};


userSchema.methods.generateToken = function (secret, callback) {
  // for assignment, generate eat with something that isn't id, e.g. random value on user
  eat.encode({randomString: this.randomString}, secret, callback);
};

userSchema.methods.owns = function(obj) {
  return obj.authorId === this._id;
};

module.exports = mongoose.model('User', userSchema);

//{email: 'test4@example.com', password: 'password123', username: 'test user 4'}
