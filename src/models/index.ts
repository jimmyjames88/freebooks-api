import fs from 'fs'
import path from 'path'
import { Sequelize, DataTypes } from 'sequelize'
import config from '../config/config.json';

const basename = path.basename(__filename);
const env = 'development'
const conf = config[env]
const db: any = {}

export let sequelize: any
sequelize = new Sequelize(conf.database, conf.username, conf.password, {
  host: '127.0.0.1',
  port: conf.port,
  dialect: 'mysql',
  dialectOptions: {
    decimalNumbers: true
  }
})

fs
  .readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts' &&
      file.indexOf('.test.ts') === -1
    )
  })
  .forEach((file: string) => {
    const model = require(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
