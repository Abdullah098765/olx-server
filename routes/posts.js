import express from 'express'
import a from './schema.js/adData.js'
import mongoose from 'mongoose'
// import { io } from '../socket/io.js'
import schedule from 'node-schedule'


const router = express.Router()

// User

router.post('/user', function (req, res) {
  const user = new a.User({
    displayName: req.body.displayName,
    email: req.body.email,
    uid: req.body.uid,
    isOnline: null,
    photoURL: req.body.photoURL
  })
  user.save()
  a.User.find().then(e => {
    res.send(e)
    // console.log(e)
  })
})
router.post('/get-user', function (req, res) {
  a.User.findOne({ uid: req.body.uid }).then(e => {
    res.send(e)
    // console.log(e)
  })
})

// Ad Routs

router.post('/posts', function (req, res) {
  if (req.body.id !== undefined) {
    // a.AdData.populate('user')
    //   .findOne({ _id: req.body.id })

    //   .then(e => {
    //     res.send(e)
    //   })
    //   .catch(err => {})

    a.AdData.where({ _id: req.body.id })
      .populate('seller')
      .findOne()
      .then(e => {
        res.send(e)
      })
  } else {
    const doc = new a.AdData(req.body)
    doc.save()
    a.AdData.find().then(e => {
      res.send(e)
      console.log(req.body)
    })
  }
})

router.get('/get_posts', function (req, res) {
  a.AdData.find().then(e => {
    res.send(e)
  })
})

router.post('/get_posts', function (req, res) {
  a.AdData.find({ city: req.body.city }).then(e => {
    res.send(e)
  })
})

router.post('/get_my_ads', function (req, res) {
  a.AdData.find({ ownerId: req.body.myId }).then(e => {
    res.send(e)
  })
})

router.post('/views', function (req, res) {
  console.log(req.body)

  a.AdData.where({ viwesCount: { $in: req.body.viewerId } }).findOne(
    (err, data) => {
      console.log(data)
    }
  )

  a.AdData.updateOne(
    { _id: req.body.id },
    { $push: { viwesCount: req.body.viewerId } }
  ).then(e => {
    console.log(e)
  })
})

router.post('/delete', function (req, res) {
  a.AdData.findOneAndDelete({ _id: req.body.idForDelete }).then(deleted => {
    res.send('deleted')
  })
})

router.post('/edit_ad', function (req, res) {
  // console.log(req.body)
  a.AdData.findOneAndUpdate({ _id: req.body._id }, req.body).then(update => {
    console.log(update)
  })
})

//Contacts Routs

router.post('/contacts', function (req, res) {
  console.log('tid')

  const contact = new a.ContactWithSeller(req.body)
  contact.save()
  a.ContactWithSeller.find().then(e => {
    res.send(e)
  })
})

router.post('/my_contacts', function (req, res) {
  a.ContactWithSeller.where({
    $or: [
      {
        clientId: req.body.inboxId
      },
      {
        sellerUid: req.body.inboxId
      }
    ]
  })
    .populate('ad')
    .populate('seller')
    .populate('client')
    .find()
    .then(e => {
      res.send(e)
    })

  // a.ContactWithSeller.findOneAndDelete({ clientName:'Sabir Ali.'}).then(deleted => {
  // })
})

router.post('/messages', function (req, res) {
  const message = new a.Messages(req.body)
  message.save()
  console.log(req.body)
  a.Messages.find().then(e => {
    res.send(e)
  })
})

router.post('/on-focus-on-contact', function (req, res) {
  a.Messages.find({ contactId: req.body.contactId }).then(e => {
    res.send(e)
  })
})

// io.on('connection', socket => {
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


schedule.scheduleJob('3 * * * * *', function () {
  a.AdData.find()
    .updateMany({ timestamp: { $lt: Date.now() - 18000 } }, { expired: false })
    .then(data => {
      console.log(data)
    })

  console.log('The answer to life, the universe, and everything!')
})

export default router
