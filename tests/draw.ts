import { Peach } from '../src/index'
import { v4 as uuidv4 } from 'uuid'

(async () => {
  const client = new Peach({
    host: process.env.PEACH_HOST,
    apiKey: process.env.PEACH_API_KEY,
  })

  console.log('getting Draws for Peach Borrower Id and Loan Id...')
  const one = await client.draw.get('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
  if (one.success) {
    console.log(`Success! We now have ${one.draws!.data.length} Draws for this Borrower & Loan!`)
  } else {
    console.log('Error! Draws for Peach Borrower Id and Loan Id failed, and the output is:')
    console.log(one)
  }

  console.log('creating Draw for Borrower Id and Loan Id...')
  const drawId = uuidv4()
  const drawForm = {
    externalId: drawId,
    nickname: 'My Draw',
    status: 'pending',
    atOrigination: {
      interestRates: [ { days: null, rate: 0 } ],
      fees: {
        drawFeePercentageOfPrincipal: 0.1,
        serviceFeeAmount: 8.88,
        serviceFeeCapAmount: 200,
      },
      minPaymentCalcualtion: {
        percentageOfPrincipal: 0.01,
        minAmount: 1.99,
      },
      autoAmortization: {
        amortizationLogic: 'aggregatePurchasesInPeriod',
        duration: 12,
      },
    },
  }
  const twoA = await client.draw.create('BO-9BR3-GW8J', 'LN-5K97-XPVJ', drawForm, { readAfterWrite: true })
  if (twoA.success && twoA.draw?.externalId === drawId) {
    const pchDrawId = twoA.draw!.id!
    const extDrawId = twoA.draw!.externalId!
    console.log(`Success! Created Draw Id: ${pchDrawId} w/ externalId: ${extDrawId}`)

    console.log('getting Draw by Id for Borrower Id and Loan Id...')
    const twoB = await client.draw.byId('BO-9BR3-GW8J', 'LN-5K97-XPVJ', pchDrawId)
    if (twoB.success && twoB.draw?.id === pchDrawId) {
      console.log(`Success! Found new Draw Id: ${twoB.draw!.id} w/ externalId: ${twoB.draw!.externalId}`)
    } else {
      console.log('Error! Getting Draw by Id for Borrower Id and Loan Id failed, and the output is:')
      console.log(twoB)
    }

    console.log('getting Draw by externalId for Borrower Id and Loan Id...')
    const twoC = await client.draw.byId('BO-9BR3-GW8J', 'LN-5K97-XPVJ', `ext-${extDrawId}`)
    if (twoC.success && twoC.draw?.id === pchDrawId) {
      console.log(`Success! Found new Draw Id: ${twoC.draw!.id} w/ externalId: ${twoC.draw!.externalId}`)
    } else {
      console.log('Error! Getting Draw by Id for Borrower Id and Loan Id failed, and the output is:')
      console.log(twoC)
    }

    console.log('getting Draws for Peach Borrower Id and Loan Id...')
    const twoD = await client.draw.get('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
    if (twoD.success) {
      console.log(`Success! We now have ${twoD.draws!.data.length} Draws for this Borrower & Loan!`)
    } else {
      console.log('Error! Draws for Peach Borrower Id and Loan Id failed, and the output is:')
      console.log(twoD)
    }

    console.log('updating Draw by Id for Borrower Id and Loan Id...')
    const twoE = await client.draw.update('BO-9BR3-GW8J', 'LN-5K97-XPVJ', pchDrawId, {
      nickname: 'My Drawing',
    })
    // TODO:
    console.log('TWO-E [update()]', twoE)
    if (twoE.success && twoE.draw?.nickname === 'My Drawing') {
      console.log(`Success! Updated new Draw Id: ${twoE.draw!.id} w/ externalId: ${twoE.draw!.externalId}`)
    } else {
      console.log('Error! Updating Draw by Id for Borrower Id and Loan Id failed, and the output is:')
      console.log(twoE)
    }

    console.log('canceling Draw by Id for Borrower Id and Loan Id...')
    const twoF = await client.draw.cancel('BO-9BR3-GW8J', 'LN-5K97-XPVJ', pchDrawId)
    if (twoF.success) {
      console.log('Success!')
    } else {
      console.log('Error! Canceling Draw by Id for Borrower Id and Loan Id failed, and the output is:')
      console.log(twoF)
    }

    console.log('getting Draws for Peach Borrower Id and Loan Id...')
    const twoG = await client.draw.get('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
    if (twoG.success) {
      console.log(`Success! We now have ${twoG.draws!.data.length} Draws for this Borrower & Loan!`)
    } else {
      console.log('Error! Draws for Peach Borrower Id and Loan Id failed, and the output is:')
      console.log(twoG)
    }
  } else {
    console.log('Error! Creating Draw for Peach Borrower Id and Loan Id failed, and the output is:')
    console.log(twoA)
  }

})()
