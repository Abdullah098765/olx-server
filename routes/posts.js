import express from 'express'
import a from './schema.js/adData.js'
import mongoose from 'mongoose'

const router = express.Router()




a.Messages.watch().on('change', change => {
  io.emit('new-message-' + change.fullDocument.contactId, change)
  console.log(change)
})

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
    console.log(req.body);

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


  a.AdData.where({viwesCount:{$in:req.body.viewerId}}).findOne((err, data)=>{
    console.log(data);
  })

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

export default router
