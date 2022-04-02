import { Peach } from '../src/index'

(async () => {
  const client = new Peach({
    host: process.env.PEACH_HOST,
    apiKey: process.env.PEACH_API_KEY,
  })

  console.log('getting primary Identity for Peach Borrower Id...')
  const oneA = await client.identity.primary('BO-9BR3-GW8J')
  if (oneA.success && oneA.identity?.value === '999999999') {
    console.log('Success!')
  } else {
    console.log('Error! Primary Identity for Peach Borrower Id failed, and the output is:')
    console.log(oneA)
  }

  console.log('getting primary Identity for external Borrower Id...')
  const oneB = await client.identity.primary('ext-4efb9243-9bfd-4fb0-ac64-9719a5176217')
  if (oneB.success && oneB.identity?.value === '30-0000000') {
    console.log('Success!')
  } else {
    console.log('Error! Primary Identity for Peach Borrower Id failed, and the output is:')
    console.log(oneB)
  }

  console.log('getting all Identities for Borrower Id...')
  const two = await client.identity.get('BO-9BR3-GW8J')
  if (two.success) {
    console.log(`Success! We have ${two.identities!.data.length} Identities for this Borrower.`)
  } else {
    console.log('Error! Getting Identities for Borrower Id failed, and the output is:')
    console.log(two)
  }

  console.log('getting Identity by Id for Borrower Id...')
  const tre = await client.identity.byId('BO-9BR3-GW8J', 'BI-9BNM-541J')
  if (tre.success && tre.identity?.value === '999999999') {
    console.log('Success!')
  } else {
    console.log('Error! Getting Identity by Id for Borrower Id failed, and the output is:')
    console.log(tre)
  }

  console.log('updating Identity for Borrower Id...')
  const fouA = await client.identity.update('BO-9BR3-GW8J', 'BI-9BNM-541J', {
    value: '999999998',
  }, { readAfterWrite: true })
  if (fouA.success && fouA.identity?.value === '999999998') {
    console.log('Success!')
  } else {
    console.log('Error! Updating Identity for Borrower Id failed, and the output is:')
    console.log(fouA)
  }

  console.log('resetting Identity for Borrower Id...')
  const fouB = await client.identity.update('BO-9BR3-GW8J', 'BI-9BNM-541J', {
    value: '999999999'
  }, { readAfterWrite: true })
  if (fouB.success && fouB.identity?.value === '999999999') {
    console.log('Success!')
  } else {
    console.log('Error! Resetting Identity for Borrower Id failed, and the output is:')
    console.log(fouB)
  }

  console.log('creating Identity for Borrower Id...')
  const fivA = await client.identity.create('BO-9BR3-GW8J', {
    identityType: 'passport',
    value: '1111-X-22222',
    isPrimary: false,
  }, { readAfterWrite: true })
  if (fivA.success && fivA.identity?.value === '1111-X-22222') {
    console.log('Success!')
  } else {
    console.log('Error! Creating Identity for Borrower Id failed, and the output is:')
    console.log(fivA)
  }

  console.log('getting all Identities for Borrower Id now...')
  const fivB = await client.identity.get('BO-9BR3-GW8J')
  if (fivB.success) {
    console.log(`Success! We now have ${fivB.identities!.data.length} Identities for this Borrower!`)
  } else {
    console.log('Error! Getting Identities for Borrower Id failed, and the output is:')
    console.log(fivB)
  }

  console.log('archiving passport Identity for Borrower Id now...')
  const sixA = await client.identity.archive('BO-9BR3-GW8J', fivA.identity!.id)
  if (sixA.success) {
    console.log('Success!')
  } else {
    console.log('Error! Archiving Identity for Borrower Id failed, and the output is:')
    console.log(sixA)
  }

  console.log('getting all Identities for Borrower Id now...')
  const sixB = await client.identity.get('BO-9BR3-GW8J')
  if (sixB.success) {
    console.log(`Success! We now have ${sixB.identities!.data.length} Identities for this Borrower!`)
  } else {
    console.log('Error! Getting Identities for Borrower Id failed, and the output is:')
    console.log(sixB)
  }

})()
