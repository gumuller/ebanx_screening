const Router = require('@koa/router')
const router = new Router()
const {
  resetState,
  getAccount,
  eventDeposit,
  eventWithdraw,
  eventTransfer,
} = require('../controllers/accounts')

const depositSchema = require('../schemas/deposit')
const withdrawSchema = require('../schemas/withdraw')
const transferSchema = require('../schemas/transfer')

function format(str) {
  return str.replace(/:{/g, ': {').replace(/,"/g, ', "')
}

function registerAccountRoutes(router) {
  router.post('/reset', async ctx => {
    console.log('Reseting internal state...')
    resetState()
    ctx.status = 200
  })

  router.get('/balance', async ctx => {
    const account_id = ctx.request.query.account_id
    if (!account_id) {
      ctx.body = 0
      ctx.status = 404
      return
    }

    const account = await getAccount(account_id)
    if (!account) {
      ctx.body = 0
      ctx.status = 404
      return
    }

    ctx.body = account.balance
    ctx.status = 200
  })

  router.post('/event', async ctx => {
    if (ctx.request.body.type === 'deposit') {
      try {
        await depositSchema.validateAsync(ctx.request.body)
      } catch (error) {
        ctx.body = error
        ctx.status = 400
        return
      }

      const payload = await eventDeposit(
        ctx.request.body.destination,
        ctx.request.body.amount
      )

      ctx.body = format(JSON.stringify({ destination: payload }))
      ctx.status = 201
    } else if (ctx.request.body.type === 'withdraw') {
      try {
        await withdrawSchema.validateAsync(ctx.request.body)
      } catch (error) {
        ctx.body = error
        ctx.status = 400
        return
      }

      const payload = await eventWithdraw(
        ctx.request.body.origin,
        ctx.request.body.amount
      )
      if (!payload) {
        ctx.body = 0
        ctx.status = 404
        return
      }

      ctx.body = format(JSON.stringify({ origin: payload }))
      ctx.status = 201
    } else if (ctx.request.body.type === 'transfer') {
      try {
        await transferSchema.validateAsync(ctx.request.body)
      } catch (error) {
        ctx.body = error
        ctx.status = 400
        return
      }

      const payload = await eventTransfer(
        ctx.request.body.origin,
        ctx.request.body.destination,
        ctx.request.body.amount
      )
      if (!payload) {
        ctx.body = 0
        ctx.status = 404
        return
      }

      ctx.body = format(JSON.stringify(payload))
      ctx.status = 201
    }
  })
}

registerAccountRoutes(router)

module.exports = router
