import { Peach } from '../src/index'
import { v4 as uuidv4 } from 'uuid'

(async () => {
  const client = new Peach({
    host: process.env.PEACH_HOST,
    apiKey: process.env.PEACH_API_KEY,
  })

  console.log('getting Contacts for Peach Borrower Id...')
  const one = await client.contact.get('BO-9BR3-GW8J')
  if (one.success) {
    console.log(`Success! We now have ${one.contacts!.data.length} Contacts for this Borrower!`)
  } else {
    console.log('Error! Contacts for Peach Borrower Id failed, and the output is:')
    console.log(one)
  }

  console.log('getting Contact by Id for Borrower Id...')
  const two = await client.contact.byId('BO-9BR3-GW8J', 'CT-LBM7-M69J')
  if (two.success && two.contact?.value === '+15126808574') {
    console.log('Success!')
  } else {
    console.log('Error! Getting Contact by Id for Borrower Id failed, and the output is:')
    console.log(two)
  }

  console.log('updating Contact for Borrower Id...')
  const treA = await client.contact.update('BO-9BR3-GW8J', 'CT-LBM7-M69J', {
    value: '+15126808577',
  }, { readAfterWrite: true })
  if (treA.success && treA.contact?.value === '+15126808577') {
    console.log('Success!')
  } else {
    console.log('Error! Updating Contact for Borrower Id failed, and the output is:')
    console.log(treA)
  }

  console.log('resetting Contact for Borrower Id...')
  const treB = await client.contact.update('BO-9BR3-GW8J', 'CT-LBM7-M69J', {
    value: '+15126808574'
  }, { readAfterWrite: true })
  if (treB.success && treB.contact?.value === '+15126808574') {
    console.log('Success!')
  } else {
    console.log('Error! Resetting Contact for Borrower Id failed, and the output is:')
    console.log(treB)
  }

  console.log('creating Contact for Borrower Id...')
  const fouId = uuidv4()
  const fouA = await client.contact.create('BO-9BR3-GW8J', {
    externalId: fouId,
    contactType: 'phone',
    value: '+13175551212',
    label: 'home',
    affiliation: 'parent',
    status: 'additional',
  }, { readAfterWrite: true })
  if (fouA.success && fouA.contact?.value === '+13175551212') {
    console.log('Success!')

    console.log('getting all Contacts for Borrower Id now...')
    const fouB = await client.contact.get('BO-9BR3-GW8J')
    if (fouB.success) {
      console.log(`Success! We now have ${fouB.contacts!.data.length} Contacts for this Borrower!`)
    } else {
      console.log('Error! Getting Contacts for Borrower Id failed, and the output is:')
      console.log(fouB)
    }

    console.log('deleting parent home phone Contact for Borrower Id now...')
    const fivA = await client.contact.delete('BO-9BR3-GW8J', fouA.contact!.id)
    if (fivA.success) {
      console.log('Success!')
    } else {
      console.log('Error! Archiving Contact for Borrower Id failed, and the output is:')
      console.log(fivA)
    }

    console.log('getting all Contacts for Borrower Id now...')
    const fivB = await client.contact.get('BO-9BR3-GW8J')
    if (fivB.success) {
      console.log(`Success! We now have ${fivB.contacts!.data.length} Contacts for this Borrower!`)
    } else {
      console.log('Error! Getting Contacts for Borrower Id failed, and the output is:')
      console.log(fivB)
    }
  } else {
    console.log('Error! Creating Contact for Borrower Id failed, and the output is:')
    console.log(fouA)
  }

  const sixAId = uuidv4()
  console.log(`creating new Contact ${sixAId} for Borrower Id...`)
  const sixA = await client.contact.create('BO-9BR3-GW8J', {
    externalId: sixAId,
    contactType: 'phone',
    value: '+16305551212',
    label: 'home',
    affiliation: 'parent',
    status: 'additional',
  }, { readAfterWrite: true })
  if (sixA.success && sixA.contact?.value === '+16305551212') {
    console.log(`Success! Created Contact id: ${sixA.contact?.id} as externalId: ${sixA.contact?.externalId}`)
  } else {
    console.log('Error! Creating Contact for Borrower Id failed, and the output is:')
    console.log(sixA)
  }

  const sixBId = uuidv4()
  console.log(`cloning new Contact ${sixBId} for Borrower Id...`)
  const sixB = await client.contact.clone('BO-9BR3-GW8J', sixA.contact!.id, {
    externalId: sixBId,
  }, { readAfterWrite: true })
  if (sixB.success && sixB.contact?.value === '+16305551212') {
    console.log(`Success! Created Contact id: ${sixB.contact!.id} as externalId: ${sixB.contact?.externalId}`)
  } else {
    console.log('Error! Creating Contact for Borrower Id failed, and the output is:')
    console.log(sixB)
  }

  console.log('checking clone source for status...')
  const sixC = await client.contact.byId('BO-9BR3-GW8J', sixA.contact!.id)
  if (sixC.success) {
    console.log(`Success! Contact id: ${sixC.contact!.id} as externalId: ${sixC.contact!.externalId}`)
    console.log(`...again Contact id: ${sixB.contact!.id} as externalId: ${sixB.contact!.externalId}`)
  } else {
    console.log('Error! Getting source of cloned Contact by Id for Borrower Id failed, and the output is:')
    console.log(sixC)
  }

})()
