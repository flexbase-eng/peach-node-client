import { Peach } from '../src/index'
import { v4 as uuidv4 } from 'uuid'

(async () => {
  const client = new Peach({
    host: process.env.PEACH_HOST,
    apiKey: process.env.PEACH_API_KEY,
  })

  // console.log('getting Loans for Peach Borrower Id...')
  // const one = await client.loan.get('BO-9BR3-GW8J')
  // if (one.success) {
  //   console.log(`Success! We now have ${one.loans!.data.length} Loans for this Borrower!`)
  // } else {
  //   console.log('Error! Loans for Peach Borrower Id failed, and the output is:')
  //   console.log(one)
  // }

  // console.log('getting Loan by Id for Borrower Id...')
  // const two = await client.loan.byId('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
  // if (two.success && two.loan?.loanTypeId === 'LT-25K9-7GJ6') {
  //   console.log('Success!')
  // } else {
  //   console.log('Error! Getting Loan by Id for Borrower Id failed, and the output is:')
  //   console.log(two)
  // }

  // console.log('updating Loan nickname for Borrower Id...')
  // const twoNick = two.loan!.nickname
  // const treA = await client.loan.update('BO-9BR3-GW8J', 'LN-5K97-XPVJ', {
  //   nickname: 'DustBin Expansion',
  // }, { readAfterWrite: true })
  // if (treA.success && treA.loan?.nickname === 'DustBin Expansion') {
  //   console.log(`Success! Loan nickname: '${treA.loan?.nickname}'`)
  // } else {
  //   console.log('Error! Updating Loan for Borrower Id failed, and the output is:')
  //   console.log(treA)
  // }

  // console.log('resetting Loan nickname for Borrower Id...')
  // const treB = await client.loan.update('BO-9BR3-GW8J', 'LN-5K97-XPVJ', {
  //   nickname: twoNick,
  // }, { readAfterWrite: true })
  // if (treB.success && treB.loan?.nickname === twoNick) {
  //   console.log(`Success! Loan nickname: '${treB.loan?.nickname}'`)
  // } else {
  //   console.log('Error! Resetting Loan for Borrower Id failed, and the output is:')
  //   console.log(treB)
  // }

  // TO TEST:
  // console.log('creating Loan for Borrower Id...')
  const _fouId = uuidv4()
  // const fouA = await client.loan.create('BO-9BR3-GW8J', {
  //   type: 'lineOfCredit',
  //   externalId: fouId,
  //   loanTypeId: 'LT-25K9-7GJ6',
  //   servicedBy: 'creditor',
  //   nickname: 'My First LoC'
  //   status: 'originated',
  //   newDrawsAllowed: true,
  //   atOrigination: {
  //     personAddressId: 'CT-LBM7-M69J',
  //     interestRates: [ { days: null, rate: 0.0 }],
  //     paymentFrequency: 'monthly',
  //     specificDays: [ 10 ],
  //     originationLicense: 'nationalBank',
  //     originatingCreditorName: 'Bank of Mars',
  //     creditLimitAmount: 45000,
  //     fees: {
  //       originationFeeAmount: 0.0,
  //     },
  //   },
  // }, { readAfterWrite: true })
  // if (fouA.success && fouA.loan?.value === '+13175551212') {
  //   console.log('Success!')

  //   console.log('getting all Loans for Borrower Id now...')
  //   const fouB = await client.loan.get('BO-9BR3-GW8J')
  //   if (fouB.success) {
  //     console.log(`Success! We now have ${fouB.loans!.data.length} Loans for this Borrower!`)
  //   } else {
  //     console.log('Error! Getting Loans for Borrower Id failed, and the output is:')
  //     console.log(fouB)
  //   }

  //   console.log('canceling new Loan for Borrower Id now...')
  //   const fivA = await client.loan.cancel('BO-9BR3-GW8J', fouA.loan!.id)
  //   if (fivA.success) {
  //     console.log('Success!')
  //   } else {
  //     console.log('Error! Canceling Loan for Borrower Id failed, and the output is:')
  //     console.log(fivA)
  //   }

  //   console.log('getting all Loans for Borrower Id now...')
  //   const fivB = await client.loan.get('BO-9BR3-GW8J')
  //   if (fivB.success) {
  //     console.log(`Success! We now have ${fivB.contacts!.data.length} Loans for this Borrower!`)
  //   } else {
  //     console.log('Error! Getting Loans for Borrower Id failed, and the output is:')
  //     console.log(fivB)
  //   }
  // } else {
  //   console.log('Error! Creating Loan for Borrower Id failed, and the output is:')
  //   console.log(fouA)
  // }
  // ==================================

  // console.log('getting Loan periods for Loan Id...')
  // const six = await client.loan.periods('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
  // console.log(six)
  // if (six.success) {
  //   console.log(`Success! We now have ${six.periods!.data.length} periods for this Loan!`)
  // } else {
  //   console.log('Error! Getting periods for Loan Id failed, and the output is:')
  //   console.log(six)
  // }

  console.log('getting Loan Credit Limit by Id for Borrower Id...')
  const sevA = await client.loan.creditLimit('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
  if (sevA.success && sevA.creditLimitAmount! > 0) {
    console.log(`Success! Loan ${'LN-5K97-XPVJ'} has a credit limit of: ${sevA.creditLimitAmount}`)
  } else {
    console.log('Error! Getting Loan Credit Limit by Id for Borrower Id failed, and the output is:')
    console.log(sevA)
  }

  console.log('updating Loan Credit Limit by Id for Borrower Id...')
  const sevB = await client.loan.updateCreditLimit(
    'BO-9BR3-GW8J',
    'LN-5K97-XPVJ',
    { creditLimitAmount: 75000 },
  )
  if (sevB.success && sevB.loan!.current!.creditLimitAmount! === 75000) {
    console.log(`Success! Loan ${'LN-5K97-XPVJ'} has a credit limit of: ${sevB.loan!.current!.creditLimitAmount!}`)

    console.log('resetting Loan Credit Limit by Id for Borrower Id...')
    const sevC = await client.loan.updateCreditLimit(
      'BO-9BR3-GW8J',
      'LN-5K97-XPVJ',
      { creditLimitAmount: sevA.creditLimitAmount! },
    )
    if (sevC.success && sevC.loan!.current!.creditLimitAmount! === sevA.creditLimitAmount!) {
      console.log(`Success! Loan ${'LN-5K97-XPVJ'} has a credit limit of: ${sevC.loan!.current!.creditLimitAmount}`)
    } else {
      console.log('Error! Resetting Loan Credit Limit by Id for Borrower Id failed, and the output is:')
      console.log(sevC)
    }
  } else {
    console.log('Error! Updating Loan Credit Limit by Id for Borrower Id failed, and the output is:')
    console.log(sevB)
  }


})()
