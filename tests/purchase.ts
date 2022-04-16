import { Peach } from '../src/index'
import { v4 as uuidv4 } from 'uuid'

(async () => {
  const client = new Peach({
    host: process.env.PEACH_HOST,
    apiKey: process.env.PEACH_API_KEY,
  })

  // this is the Borrower we'll use for these tests...
  const pchBorrowerId = 'BO-9BR3-GW8J'

  console.log(`creating Loan for Borrower Id ${pchBorrowerId}...`)
  const loanId = uuidv4()
  const loanForm = {
    type: 'lineOfCredit',
    externalId: loanId,
    loanTypeId: 'LT-25K9-7GJ6',
    servicedBy: 'creditor',
    nickname: 'My First LoC',
    status: 'originated',
    newDrawsAllowed: true,
    atOrigination: {
      personAddress: {
        addressLine1: '1 Main St',
        city: 'Houston',
        state: 'TX',
        postalCode: '77002',
        country: 'US',
      },
      interestRates: [ { days: null, rate: 0.0 }],
      paymentFrequency: 'monthly',
      specificDays: [ 10 ],
      originationLicense: 'nationalBank',
      originatingCreditorName: 'Bank of Mars',
      creditLimitAmount: 45000,
      fees: {
        originationFeeAmount: 0.0,
      },
    },
  }
  const oneA = await client.loan.create(pchBorrowerId, loanForm, { readAfterWrite: true })
  if (!oneA?.success || oneA?.loan?.externalId !== loanId) {
    console.log(`Error! Creating Loan for Borrower Id ${pchBorrowerId} failed, and the output is:`)
    console.log(oneA)
    return
  }

  const pchLoanId = oneA.loan!.id!
  const extLoanId = oneA.loan!.externalId!
  console.log(`Success! Created Loan: ${pchLoanId} w/ externalId: ${extLoanId}`)

  console.log(`activating Loan ${pchLoanId} for Borrower Id ${pchBorrowerId} now...`)
  const oneB = await client.loan.activate(pchBorrowerId, pchLoanId)
  if (!oneB?.success) {
    console.log(`Error! Activating Loan ${pchLoanId} for Borrower Id ${pchBorrowerId} failed, and the output is:`)
    console.log(oneB)
    return
  }
  console.log('Success!')

  console.log(`creating Draw for Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const drawId = uuidv4()
  const drawForm = {
    externalId: drawId,
    nickname: 'My Draw',
    status: 'originated',
    atOrigination: {
      interestRates: [ { days: null, rate: 0 } ],
      fees: {
        originationFeeAmount: 0.25,
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
  const twoA = await client.draw.create(pchBorrowerId, pchLoanId, drawForm, { readAfterWrite: true })
  if (!twoA?.success || twoA?.draw?.externalId !== drawId) {
    console.log(`Error! Creating Draw for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(twoA)
    return
  }

  const pchDrawId = twoA.draw!.id!
  const extDrawId = twoA.draw!.externalId!
  console.log(`Success! Created Draw Id: ${pchDrawId} w/ externalId: ${extDrawId}`)

  console.log(`getting Draw by Id ${pchDrawId} for Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const twoB = await client.draw.byId(pchBorrowerId, pchLoanId, pchDrawId)
  if (!twoB?.success || twoB?.draw?.id !== pchDrawId) {
    console.log(`Error! Getting Draw by Id ${pchDrawId} for Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(twoB)
    return
  }
  console.log(`Success! Found new Draw Id: ${pchDrawId} w/ externalId: ${extDrawId}`)

  console.log(`activating new Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const twoC = await client.draw.activate(pchBorrowerId, pchLoanId, pchDrawId)
  if (!twoC?.success) {
    console.log(`Error! Activating new Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId}, and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(twoC)
    return
  }
  console.log('Success!')

  const purchaseId = uuidv4()
  const purchaseDate = new Date().toISOString().substring(0,10)
  console.log(`creating Purchase on new Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const treA = await client.purchase.create(pchBorrowerId, pchLoanId, pchDrawId, {
    externalId: purchaseId,
    type: 'regular',
    status: 'pending',
    amount: 75.50,
    purchaseDate,
    purchaseDetails: {
      description: 'Big Drill',
      pointOfSaleType: 'physical',
      merchantName: 'HomeDepot',
    }
  }, {
    sync: true
  })
  if (!treA?.success || treA?.purchase?.externalId !== purchaseId) {
    console.log(`Error! Creating Purchase for new Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(treA)
    return
  }
  const pchPurchaseId = treA.purchase!.id!
  const extPurchaseId = treA.purchase!.externalId!
  console.log(`Success! A new Purchase id: ${pchPurchaseId} (externalId: ${extPurchaseId}) for: ${treA.purchase!.amount} has been added to the Draw, Loan, and Borrower!`)

  console.log(`getting Purchases for Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const treB = await client.purchase.get(pchBorrowerId, pchLoanId, pchDrawId)
  if (!treB?.success) {
    console.log(`Error! Purchases for Peach Borrower Id ${pchBorrowerId}, Loan Id ${pchLoanId}, and Draw Id ${pchDrawId} failed, and the output is:`)
    console.log(treB)
    return
  }
  console.log(`Success! We now have ${treB.purchases!.data.length} Purchases for this Borrower, Loan, & Draw!`)

  console.log(`updating new Purchase ${pchPurchaseId} for Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const fouA = await client.purchase.update(
    pchBorrowerId,
    pchLoanId,
    pchDrawId,
    pchPurchaseId,
    {
      amount: 60.00,
    },
    {
      sync: true
    }
  )
  if (!fouA?.success) {
    console.log('Error! Updating Purchase for Peach Borrower Id, Loan Id, and Draw Id failed, and the output is:')
    console.log(fouA)
    return
  }
  console.log(`Success! The new Purchase id: ${pchPurchaseId} now has the amount: ${fouA.purchase!.amount} for the Draw, Loan, and Borrower!`)

})()
