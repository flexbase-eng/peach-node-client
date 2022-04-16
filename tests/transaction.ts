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

  const extInstId = uuidv4()
  const accountNumber = (10000 + Math.floor((Math.random() * 10000) + 1)).toString().substr(1,5)
  console.log(`creating Payment Instrument for Borrower Id ${pchBorrowerId}...`)
  const oneC = await client.paymentInstrument.create(pchBorrowerId, {
    isExternal: true,
    externalId: extInstId,
    status: 'active',
    nickname: 'Business Bank Account',
    instrumentType: 'bankAccount',
    accountNumber,
    routingNumber: '021313103',
    accountType: 'checking',
    accountHolderType: 'business',
    accountHolderName: "ABC Roofing"
  }, { readAfterWrite: true })
  if (oneC.success) {
    console.log(`Success! Create Payment Instrument ${oneC?.instrument!.id}`)
  } else {
    console.log('Error! Creating Payment Instrument for Borrower Id failed, and the output is:')
    console.log(oneC)
    return
  }
  const pchInstId = oneC.instrument!.id

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
  const oneD = await client.draw.create(pchBorrowerId, pchLoanId, drawForm, { readAfterWrite: true })
  if (!oneD?.success || oneD?.draw?.externalId !== drawId) {
    console.log(`Error! Creating Draw for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(oneD)
    return
  }

  const pchDrawId = oneD.draw!.id!
  const extDrawId = oneD.draw!.externalId!
  console.log(`Success! Created Draw Id: ${pchDrawId} w/ externalId: ${extDrawId}`)

  console.log(`activating new Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const oneE = await client.draw.activate(pchBorrowerId, pchLoanId, pchDrawId)
  if (!oneE?.success) {
    console.log(`Error! Activating new Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId}, and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(oneE)
    return
  }
  console.log('Success!')

  const purchaseId = uuidv4()
  const purchaseDate = new Date().toISOString().substring(0,10)
  console.log(`creating Purchase on new Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const oneF = await client.purchase.create(pchBorrowerId, pchLoanId, pchDrawId, {
    externalId: purchaseId,
    type: 'regular',
    status: 'pending',
    amount: 525.00,
    purchaseDate,
    purchaseDetails: {
      description: 'Very Big Drill',
      pointOfSaleType: 'physical',
      merchantName: 'HomeDepot',
    }
  }, {
    sync: true
  })
  if (!oneF?.success || oneF?.purchase?.externalId !== purchaseId) {
    console.log(`Error! Creating Purchase for new Draw ${pchDrawId} for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(oneF)
    return
  }
  const pchPurchaseId = oneF.purchase!.id!
  const extPurchaseId = oneF.purchase!.externalId!
  console.log(`Success! A new Purchase id: ${pchPurchaseId} (externalId: ${extPurchaseId}) for: ${oneF.purchase!.amount} has been added to the Draw, Loan, and Borrower!`)

  console.log(`creating Transaction for Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const transId = uuidv4()
  const transForm = {
    type: 'oneTime',
    isExternal: true,
    externalId: transId,
    status: 'pending',
    amount: 110.00,
    paymentInstrumentId: pchInstId,
  }
  const twoA = await client.transaction.create(pchBorrowerId, pchLoanId, transForm, { sync: true })
  if (!twoA?.success || twoA?.transaction?.externalId !== transId) {
    console.log(`Error! Creating Transaction for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(twoA)
    return
  }

  const pchTransactionId = twoA.transaction!.id!
  const extTransactionId = twoA.transaction!.externalId!
  console.log(`Success! Created Transaction Id: ${pchTransactionId} w/ externalId: ${extTransactionId}`)

  console.log(`getting Transaction by Id ${pchTransactionId} for Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const twoB = await client.transaction.byId(pchBorrowerId, pchLoanId, pchTransactionId)
  if (!twoB?.success || twoB?.transaction?.id !== pchTransactionId) {
    console.log(`Error! Getting Transaction by Id ${pchTransactionId} for Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(twoB)
    return
  }
  console.log(`Success! Found new Transaction Id: ${pchTransactionId} w/ externalId: ${extTransactionId}`)

  console.log(`updating new Transaction ${pchTransactionId} for Peach Borrower Id ${pchBorrowerId} and Loan Id ${pchLoanId}...`)
  const twoC = await client.transaction.update(pchBorrowerId, pchLoanId, pchTransactionId, {
    status: 'succeeded',
  }, {
    sync: true,
  })
  if (!twoC?.success) {
    console.log(`Error! Updating new Transaction ${pchTransactionId} for Peach Borrower Id ${pchBorrowerId}, and Loan Id ${pchLoanId} failed, and the output is:`)
    console.log(twoC)
    return
  }
  console.log('Success!')

})()
