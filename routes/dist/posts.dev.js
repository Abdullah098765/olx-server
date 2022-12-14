"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _adData = _interopRequireDefault(require("./schema.js/adData.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import { io } from '../socket/io.js'
var router = _express["default"].Router(); // User


router.post('/user', function (req, res) {
  var user = new _adData["default"].User({
    displayName: req.body.displayName,
    email: req.body.email,
    uid: req.body.uid,
    isOnline: null,
    blocked: false,
    photoURL: req.body.photoURL
  });
  user.save();

  _adData["default"].User.find().then(function (e) {
    res.send(e); // console.log(e)
  });
});
router.post('/get-user', function (req, res) {
  _adData["default"].User.findOne({
    uid: req.body.uid
  }).then(function (e) {
    res.send(e); // console.log(e)
  });
});
router.get('/get-users', function (req, res) {
  _adData["default"].User.find().then(function (e) {
    res.send(e); // console.log(e)
  });
});
router.post('/block_user', function (req, res) {
  _adData["default"].User.where({
    uid: req.body.userUid
  }).updateOne({
    blocked: true
  }).exec();

  console.log(req.body);
});
router.post('/unblock', function (req, res) {
  _adData["default"].User.where({
    uid: req.body.userUid
  }).updateOne({
    blocked: false
  }).exec(); // console.log(req.body)

}); // Ad Routs

router.post('/posts', function (req, res) {
  console.log('Pakistan');

  if (req.body.id !== undefined) {
    // a.AdData.populate('user')
    //   .findOne({ _id: req.body.id })
    //   .then(e => {
    //     res.send(e)
    //   })
    //   .catch(err => {})
    _adData["default"].AdData.where({
      _id: req.body.id
    }).populate('seller').findOne().then(function (e) {
      res.send(e);
    });
  } else {
    var doc = new _adData["default"].AdData(req.body);
    doc.save();

    _adData["default"].AdData.find().then(function (e) {
      res.send(e);
      console.log(req.body);
    });
  }
});
router.get('/get_posts', function (req, res) {
  _adData["default"].AdData.find().then(function (e) {
    res.send(e);
  });
});
router.post('/get_posts', function (req, res) {
  _adData["default"].AdData.find({
    city: req.body.city
  }).then(function (e) {
    res.send(e);
  });
});
router.post('/get_my_ads', function (req, res) {
  _adData["default"].AdData.find({
    ownerId: req.body.myId
  }).then(function (e) {
    res.send(e);
  });
});
router.post('/views', function (req, res) {
  console.log(req.body);

  _adData["default"].AdData.where({
    viwesCount: {
      $in: req.body.viewerId
    }
  }).findOne(function (err, data) {
    console.log(data);
  });

  _adData["default"].AdData.updateOne({
    _id: req.body.id
  }, {
    $push: {
      viwesCount: req.body.viewerId
    }
  }).then(function (e) {
    console.log(e);
  });
});
router.post('/delete', function (req, res) {
  _adData["default"].AdData.findOneAndDelete({
    _id: req.body.idForDelete
  }).then(function (deleted) {
    res.send('deleted');
  });
});
router.post('/edit_ad', function (req, res) {
  // console.log(req.body)
  _adData["default"].AdData.findOneAndUpdate({
    _id: req.body._id
  }, req.body).then(function (update) {
    console.log(update);
  });
});
router.post('/search_ads', function (req, res) {
  _adData["default"].AdData.where({
    $or: [{
      adTitle: {
        $regex: new RegExp(req.body.searchValue, 'gi')
      }
    }, {
      adDiscription: {
        $regex: new RegExp(req.body.searchValue, 'gi')
      }
    }]
  }).find().then(function (e) {
    res.send(e);
    console.log(e);
  });
}); // Admin Ad Routs
// router.post('/get_post_filter', function (req, res) {
//   if (req.body.filterBy === 'Expired') {
//     console.log(req.body.filterBy)
//     a.AdData.find({ expired: true }).then(e => {
//       res.send(e)
//     })
//   } else if (req.body.filterBy === 'Recent') {
//     console.log(req.body.filterBy)
//     a.AdData.find({ expired: false }).then(e => {
//       res.send(e)
//     })
//   }
//   console.log(req.body.filterBy)
// })
//Contacts Routs

router.post('/contacts', function (req, res) {
  console.log('tid');
  var contact = new _adData["default"].ContactWithSeller(req.body);
  contact.save();

  _adData["default"].ContactWithSeller.find().then(function (e) {
    res.send(e);
  });
});
router.post('/my_contacts', function (req, res) {
  _adData["default"].ContactWithSeller.where({
    $or: [{
      clientId: req.body.inboxId
    }, {
      sellerUid: req.body.inboxId
    }]
  }).populate('ad').populate('seller').populate('client').find().then(function (e) {
    res.send(e);
  }); // a.ContactWithSeller.findOneAndDelete({ clientName:'Sabir Ali.'}).then(deleted => {
  // })

});
router.post('/messages', function (req, res) {
  var message = new _adData["default"].Messages(req.body);
  message.save();
  console.log(req.body);

  _adData["default"].Messages.find().then(function (e) {
    res.send(e);
  });
});
router.post('/on-focus-on-contact', function (req, res) {
  _adData["default"].Messages.find({
    contactId: req.body.contactId
  }).then(function (e) {
    res.send(e);
  });
}); // io.on('connection', socket => {
//   console.log('connection', socket.handshake.query.name)
//   a.User.where({ uid: socket.handshake.query.name })
//     .updateOne({ isOnline: true })
//     .exec()
//   socket.on('disconnect', reason => {
//     a.User.where({ uid: socket.handshake.query.name })
//       .updateOne({ isOnline: false })
//       .exec()
//     console.log('disconnect',socket.handshake.query.name)
//     // console.log('disconnect ', socket.handshake.query.name)
//   })
// })
// a.Messages.watch().on('change', change => {
//   io.emit('new-message-' + change.fullDocument.contactId, change)
//   console.log(change.fullDocument.contactId)
// })

_nodeSchedule["default"].scheduleJob('59 * * * * *', function () {
  _adData["default"].AdData.where({
    timestamp: {
      $lt: Date.now() - 43200000
    }
  }).find().updateMany({
    expired: false
  }, {
    expired: true
  }).exec();
});

var _default = router;
exports["default"] = _default;