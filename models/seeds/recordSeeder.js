if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bcrypt = require("bcryptjs")
const Record = require('../record')
const db = require('../../config/mongoose')
const User = require("../user")
const recordList = require('./record.json')
const Category = require('../category')

const SEED_USER = [
  {
    name: '小新',
    email: 'user1@example.com',
    password: '123',
    recordListIndex: [0, 1]
  },
  {
    name: '廣志',
    email: 'user2@example.com',
    password: '123',
    recordListIndex: [2, 3, 4]
  }
]

db.once('open', async () => {
  try {
    for (const seedUser of SEED_USER) {
      const user = await User.findOne({ email: seedUser.email })
      if (user) {
        console.log('User already exists.')
        return process.exit()
      }

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(seedUser.password, salt)

      const newUser = await User.create({
        name: seedUser.name,
        email: seedUser.email,
        password: hash
      })

      console.log('seedUser created!')

      const userRecord = []
      for (const index of seedUser.recordListIndex) {
        recordList[index].userId = newUser._id
        const category = await Category.findOne({ name: recordList[index].category }).lean()
        recordList[index].categoryId = category._id
        userRecord.push(recordList[index])
      }

      await Record.create(userRecord)
    }

    console.log('done')
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})

