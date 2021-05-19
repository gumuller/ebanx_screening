const Account = require('../models/accounts')

async function resetState() {
  console.log('Resetting internal state...')
  await Account.query().delete()
}

async function getAccount(account_id) {
  const account = await Account.query().findById(account_id)
  return account
}

async function eventDeposit(destination, amount) {
  const account = await Account.query().findById(destination)
  if (!account) {
    const newAccount = await Account.query().insertAndFetch({
      id: destination,
      balance: amount,
    })

    return { id: newAccount.id.toString(), balance: newAccount.balance }
  }

  const accountNewBalance = await account
    .$query()
    .patchAndFetch({ balance: account.balance + parseInt(amount) })
  return {
    id: accountNewBalance.id.toString(),
    balance: accountNewBalance.balance,
  }
}

async function eventWithdraw(origin, amount) {
  const account = await Account.query().findById(origin)
  if (!account) {
    return null
  }

  let newBalance = account.balance - parseInt(amount)
  if (newBalance < 0)
    return { id: account.id.toString(), balance: account.balance }
  else {
    const newAccountBalance = await account
      .$query()
      .patchAndFetch({ balance: newBalance })
    return {
      id: newAccountBalance.id.toString(),
      balance: newAccountBalance.balance,
    }
  }
}

async function eventTransfer(origin, destination, amount) {
  const originAccount = await Account.query().findById(origin)
  let destinationAccount = await Account.query().findById(destination)
  if (!originAccount) {
    return null
  }

  if (!destinationAccount) {
    destinationAccount = await Account.query().insertAndFetch({
      id: destination,
      balance: 0,
    })
  }

  let newOriginBalance = originAccount.balance - parseInt(amount)
  if (newOriginBalance < 0)
    return { origin: originAccount, destination: destinationAccount }

  const newOrigin = await originAccount
    .$query()
    .patchAndFetch({ balance: newOriginBalance })

  const newDestination = await destinationAccount.$query().patchAndFetch({
    balance: destinationAccount.balance + parseInt(amount),
  })
  return {
    origin: { id: newOrigin.id.toString(), balance: newOrigin.balance },
    destination: {
      id: newDestination.id.toString(),
      balance: newDestination.balance,
    },
  }
}

module.exports = {
  resetState,
  getAccount,
  eventDeposit,
  eventWithdraw,
  eventTransfer,
}
