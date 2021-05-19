const { Model } = require('objection')
const Knex = require('knex')
const Knexfile = require('../knexfile')

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const routes = require('./routes')

const knex = Knex(Knexfile['development'])
Model.knex(knex)

const app = new Koa()
app.use(bodyParser())

app.use(routes.routes())
app.use(routes.allowedMethods())

app.listen(2000)
console.log('Server listening on port 2000...')
