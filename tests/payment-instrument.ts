import { Peach } from '../src/index'
import { v4 as uuidv4 } from 'uuid'

(async () => {
  const client = new Peach({
    host: process.env.PEACH_HOST,
    apiKey: process.env.PEACH_API_KEY,
  })

  const pchBorrId = 'BO-9BR3-GW8J'
  console.log(`getting Payment Instruments for Peach Borrower Id ${pchBorrId}...`)
  const one = await client.paymentInstrument.get(pchBorrId, { isExternal: true })
  if (one.success) {
    console.log(`Success! Got ${one.instruments!.count!} Payment Instruments for Borrower Id ${pchBorrId}`)
  } else {
    console.log('Error! Payment Instruments for Peach Borrower Id failed, and the output is:')
    console.log(one)
    return
  }

  console.log(`getting Payment Instrument by Id for Borrower Id ${pchBorrId}...`)
  const two = await client.paymentInstrument.byId(pchBorrId, 'PT-2K6V-GEB4')
  if (two.success) {
    console.log('Success! Found the Payment Instrument for PT-2K6V-GEB4')
  } else {
    console.log('Error! Getting Payment Instrument by Id for Borrower Id failed, and the output is:')
    console.log(two)
    return
  }

  const extInstId = uuidv4()
  const accountNumber = (10000 + Math.floor((Math.random() * 10000) + 1)).toString().substr(1,5)
  console.log(`creating Payment Instrument for Borrower Id ${pchBorrId}...`)
  const treA = await client.paymentInstrument.create(pchBorrId, {
    isExternal: true,
    externalId: extInstId,
    status: 'pending',
    nickname: 'Business Bank Account',
    instrumentType: 'bankAccount',
    accountNumber,
    routingNumber: '021313103',
    accountType: 'checking',
    accountHolderType: 'business',
    accountHolderName: 'ABC Roofing'
  }, { readAfterWrite: true })
  if (treA.success) {
    console.log(`Success! Create Payment Instrument ${treA?.instrument!.id}`)
  } else {
    console.log('Error! Creating Payment Instrument for Borrower Id failed, and the output is:')
    console.log(treA)
    return
  }

  const pchInstId = treA?.instrument!.id
  console.log(`getting new Payment Instrument by Id ${pchInstId} for Borrower Id ${pchBorrId}...`)
  const treB = await client.paymentInstrument.byId(pchBorrId, pchInstId)
  if (treB.success) {
    console.log('Success!')
  } else {
    console.log('Error! Getting Payment Instrument by Id for Borrower Id failed, and the output is:')
    console.log(treB)
    return
  }

  console.log(`updating Payment Instrument ${pchInstId} for Borrower Id ${pchBorrId}...`)
  const fou = await client.paymentInstrument.update(pchBorrId, pchInstId, {
    nickname: 'Big Red One',
  }, { sync: true, readAfterWrite: true })
  if (fou.success && fou.instrument?.nickname === 'Big Red One') {
    console.log('Success!')
  } else {
    console.log('Error! Updating Payment Instrument for Borrower Id failed, and the output is:')
    console.log(fou)
    return
  }

  console.log(`deleting Payment Instrument ${pchInstId} for Borrower Id ${pchBorrId} now...`)
  const fivA = await client.paymentInstrument.delete(pchBorrId, pchInstId)
  if (fivA.success) {
    console.log('Success!')
  } else {
    console.log('Error! Deleting Payment Instrument for Borrower Id failed, and the output is:')
    console.log(fivA)
    return
  }

  console.log(`getting Payment Instruments for Peach Borrower Id ${pchBorrId}...`)
  const fivB = await client.paymentInstrument.get(pchBorrId, { isExternal: true })
  if (fivB.success) {
    console.log(`Success! Got ${fivB.instruments!.count!} Payment Instruments for Borrower Id ${pchBorrId}`)
    console.log(fivB.instruments!.data.map(inst => inst.id))
  } else {
    console.log('Error! Payment Instruments for Peach Borrower Id failed, and the output is:')
    console.log(fivB)
    return
  }

})()
