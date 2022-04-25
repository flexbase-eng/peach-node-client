# peach-node-client

`peach-node-client` is a Node/JS and TypeScript Client for
[Peach](https://peachfinance.com) that allows you to use normal Node
syntax to Borrowers, Loans, Draws, Purchases, Transactions and other data
from the Peach
[API](https://sandboxdocs.peach.finance/).

## Install

```bash
# with npm
$ npm install peach-node-client
```

## Usage

This README isn't going to cover all the specifics of what Peach is,
and how to use it - it's targeted as a _companion_ to the Peach developer
[docs](https://sandboxdocs.peach.finance/)
that explain each of the endpoints and how the general Peach
[API](https://sandboxdocs.peach.finance/) works.

However, we'll put in plenty of examples so that it's clear how to use this
library to interact with Peach.

### Getting your API Key

The support Team at Peach will _likely_ issue you an API Key and a Host to
use for the `sandbox`, or `production` usage. There are other ways to be
authenticated with Peach, but given the nature of this Node client, it is
_probably_ being used for many users, as part of a back-end system, and so
the API Key is a good scheme.

### Creating the Client

All Peach functions are available from the client, and the basic
construction of the client is:

```typescript
import { Peach } from 'peach-node-client'
const client = new Peach({ apiKey: '123456789abcd' })
```

If you'd like to provide the base host in the constructor, for example,
if you wanted to point to the Peach `sandbox`, you can do that
with:

```typescript
const client = new Peach({
  apiKey: '123456789abcd',
  host: 'sandboxapi.peach.finance/api',
})
```

where the options can include:

* `host` - the hostname where all Peach calls should be sent

### Borrower Calls

As stated in the Peach
[documentation](https://sandboxdocs.peach.finance/#tag/Borrowers):

> The Borrower object represent a borrower. It allows you to maintain
> different statuses that are associated with the same borrower. The API
> allows you to create, delete and update your borrowers. You can retrieve
> an individual borrower as well as a list of all your borrowers.

#### [Create Borrower](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.borrower_create)

You can create with a Person or a Business as a _Borrower_ in the Peach
system with a single call:

```typescript
const resp = await client.borrower.create({
  borrowerType: 'business',
  externalId: '4efb9243-9bfd-4fb0-ac64-9719a5176217',
  status: 'active',
  commPreferences: {
    statementDeliveryChannels: [ 'email' ],
    sendRemindersWhenCurrent: true,
  },
  businessDetails: {
    businessType: 'LLC',
    businessName: 'Acme Steel',
    businessLegalName: 'Acme Steel, Inc.',
    incorporatedCountry: 'US',
    incorporatedState: 'CA',
  },
  identity: {
    identityType: 'taxID',
    value: '30-0000000',
    valid: true,
    issueDate: '2019-12-31',
    issuingCountry: 'US',
  }
})
```

and the response will be something like:

```javascript
{
  success: true,
  borrower: {
    borrowerType: 'business',
    businessDetails: {
      businessLegalName: 'Acme Steel, Inc.',
      businessName: 'Acme Steel',
      businessType: 'LLC',
      incorporatedCountry: 'US',
      incorporatedState: 'CA'
    },
    collectionsIntensity: 'normal',
    commPreferences: {
      sendRemindersWhenCurrent: true,
      statementDeliveryChannels: [Array]
    },
    companyId: 'CP-GDB3-G1JO',
    createdAt: '2022-03-31T18:57:13.997082+00:00',
    deletedAt: null,
    displayId: '4efb9243-9bfd-4fb0-ac64-9719a5176217',
    externalId: '4efb9243-9bfd-4fb0-ac64-9719a5176217',
    id: 'BO-RKX4-EGPK',
    identities: [ [Object] ],
    metaData: null,
    object: 'person',
    status: 'active',
    statusUpdatedAt: null,
    updatedAt: null,
    user: null
  }
}
```

If there had been an error, the response would be:

```javascript
{
  "success": false,
  "error": {
    "type": "peach",
    "error": "(Error message from Peach...)",
    "status": 200,
    "peachStatus": 200
  }
}
```

where:

* `status` is the HTTP response status from the call **_to_** Peach from
  your process.
* `peachStatus` is the `status` response that Peach returns in it's payload
  so that you know how the processing went _within_ Peach.

So looking at the `success` value of the response will quickly let you know the outcome of the call.

#### [Get Borrowers](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.borrowers_list)

You can get a list of all Borrowers at Peach with no arguments:

```typescript
const resp = await client.borrower.get()
```

or you can add in filtering criteria like the `status` or the `borrowerType`:

```typescript
const resp = await client.borrower.get({
  status: 'active',
  borrowerType: 'business',
})
```

and the result will look something like:

```javascript
{
  success: true,
  borrowers: {
    count: 2,
    total: 2,
    data: [
      {
        borrowerType: 'person',
        collectionsIntensity: 'normal',
        commPreferences: { sendRemindersWhenCurrent: true, statementDeliveryChannels: [] },
        companyId: 'CP-GDB3-G1JO',
        createdAt: '2022-03-25T15:30:05.017462+00:00',
        dateOfBirth: '1981-10-06',
        deletedAt: null,
        displayId: 'BO-9BR3-GW8J',
        externalId: null,
        id: 'BO-9BR3-GW8J',
        identities: [ [Object] ],
        metaData: null,
        name: {
          createdAt: '2022-03-25T15:30:05.023445+00:00',
          current: true,
          deletedAt: null,
          effectiveAt: null,
          firstName: 'Marty',
          id: 'BN-1J8E-X86B',
          lastName: 'McFly',
          maidenLastName: null,
          middleName: null,
          object: 'name',
          originalValue: {},
          preferredFirstName: null,
          prefix: null,
          source: 'lender',
          status: 'active',
          suffix: null,
          updatedAt: null
        },
        object: 'person',
        status: 'active',
        statusUpdatedAt: null,
        updatedAt: '2022-04-04T14:39:04.209698+00:00',
        user: {
          auths: [Array],
          companyId: 'CP-GDB3-G1JO',
          createdAt: '2022-03-25T15:32:09.052493+00:00',
          deletedAt: null,
          externalId: null,
          id: 'UR-LBMV-79DB',
          object: 'user',
          roleIds: [Array],
          status: 'active',
          type: 'borrower',
          updatedAt: '2022-03-25T15:32:09.271530+00:00',
          userId: 30686,
          userName: 'bradley.king+borrower@peachfinance.com'
        }
      },
      {
        borrowerType: 'business',
        businessDetails: {
          businessLegalName: 'Acme Steel, Inc.',
          businessName: 'Acme Steel',
          businessType: 'LLC',
          incorporatedCountry: 'US',
          incorporatedState: 'CA'
        },
        collectionsIntensity: 'normal',
        commPreferences: {
          sendRemindersWhenCurrent: true,
          statementDeliveryChannels: [Array]
        },
        companyId: 'CP-GDB3-G1JO',
        createdAt: '2022-03-31T18:57:13.997082+00:00',
        deletedAt: null,
        displayId: '4efb9243-9bfd-4fb0-ac64-9719a5176217',
        externalId: '4efb9243-9bfd-4fb0-ac64-9719a5176217',
        id: 'BO-RKX4-EGPK',
        identities: [ [Object] ],
        metaData: null,
        object: 'person',
        status: 'active',
        statusUpdatedAt: null,
        updatedAt: null,
        user: null
      }
    ]
  }
}
```

#### [Search Borrowers](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.borrower_search)

Peach has a function that allows for "fuzzy" searches of the Borrowers so
that exact matches are not required. This can be used to get a set of
Borrowers that looks to match the criteria, but you'll have to run through
the list in the results to see the details of each Borrower.

The call looks something like this:

```typescript
const resp = await client.borrower.search({
  borrowerType: 'business',
  city: 'Muncie',
})
```

and the results are similar to the `get()` call and will return a list
of Borrowers like:

```javascript
{
  success: true,
  borrowers: {
    count: 6,
    total: 6,
    data: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
  }
}
```

where each element of the `data` array is a complete Borrower object.

The list of search key/value pairs are in the Plaid docs.

#### [Get Borrower by Id](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.borrower_get)

Peach allows for lookups to be done by the Peach-generated Id, as well as
the `externalId` - assuming you prefeix `ext-` to the value of the `externalId`.
This might then look like:


```typescript
const resp = await client.borrower.byId('BO-9BR3-GW8J')
```

or if the `externalId` of that Borrower is `26e2ffb0-65e4-4fe1-a21a-569289583931`,
then the same call would be:

```typescript
const resp = await client.borrower.byId('ext-26e2ffb0-65e4-4fe1-a21a-569289583931')
```

and in both cases, the result might look like:

```javascript
{
  success: true,
  borrower: {
    borrowerType: 'person',
    collectionsIntensity: 'normal',
    commPreferences: { sendRemindersWhenCurrent: true, statementDeliveryChannels: [] },
    companyId: 'CP-GDB3-G1JO',
    createdAt: '2022-03-25T15:30:05.017462+00:00',
    dateOfBirth: '1981-10-06',
    deletedAt: null,
    displayId: 'BO-9BR3-GW8J',
    externalId: '26e2ffb0-65e4-4fe1-a21a-569289583931',
    id: 'BO-9BR3-GW8J',
    identities: [ [Object] ],
    metaData: null,
    name: {
      createdAt: '2022-03-25T15:30:05.023445+00:00',
      current: true,
      deletedAt: null,
      effectiveAt: null,
      firstName: 'Marty',
      id: 'BN-1J8E-X86B',
      lastName: 'McFly',
      maidenLastName: null,
      middleName: null,
      object: 'name',
      originalValue: {},
      preferredFirstName: null,
      prefix: null,
      source: 'lender',
      status: 'active',
      suffix: null,
      updatedAt: null
    },
    object: 'person',
    status: 'active',
    statusUpdatedAt: null,
    updatedAt: '2022-04-04T14:40:38.989176+00:00',
    user: {
      auths: [Array],
      companyId: 'CP-GDB3-G1JO',
      createdAt: '2022-03-25T15:32:09.052493+00:00',
      deletedAt: null,
      externalId: null,
      id: 'UR-LBMV-79DB',
      object: 'user',
      roleIds: [Array],
      status: 'active',
      type: 'borrower',
      updatedAt: '2022-03-25T15:32:09.271530+00:00',
      userId: 30686,
      userName: 'bradley.king+borrower@peachfinance.com'
    }
  }
}
```

#### [Update Borrower](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.borrower_update)

A simple update to a Borrower might then look like:


```typescript
const resp = await client.borrower.update('BO-9BR3-GW8J', {
  externalId: '26e2ffb0-65e4-4fe1-a21a-569289583931',
})
```

and the results will be just like that of the `byId()` function:

```javascript
{
  success: true,
  borrower: {
    borrowerType: 'person',
    collectionsIntensity: 'normal',
    commPreferences: { sendRemindersWhenCurrent: true, statementDeliveryChannels: [] },
    companyId: 'CP-GDB3-G1JO',
    createdAt: '2022-03-25T15:30:05.017462+00:00',
    dateOfBirth: '1981-10-06',
    deletedAt: null,
    displayId: 'BO-9BR3-GW8J',
    externalId: '26e2ffb0-65e4-4fe1-a21a-569289583931',
    id: 'BO-9BR3-GW8J',
    identities: [ [Object] ],
    metaData: null,
    name: [Object],
    object: 'person',
    status: 'active',
    statusUpdatedAt: null,
    updatedAt: '2022-04-04T14:40:38.989176+00:00',
    user: [Object]
  }
}
```

### Identity Calls

As stated in the Peach
[documentation](https://sandboxdocs.peach.finance/#tag/Identity):

> Identity objects represent various forms of identification that a borrower
> may have. We allow one primary identity per borrower, and any number of
> secondary identities. The identity sent when creating a borrower is the
> primary identity, and cannot be deleted/archived or changed to be a
> secondary identity.

#### [Get Primary Identity](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.get_primary_identity)

Given a Borrower Id, either a Peach id (BO-XXXX-XXXX), or an external Id
(ext-XXXX) you can get the _primary_ Identity of this Borrower with
something like this:

```typescript
const resp = await client.identity.primary('BO-9BR3-GW8J')
```

and the response will be something like:

```javascript
{
  success: true,
  identity: {
    createdAt: '2022-03-25T15:30:05.279849+00:00',
    deletedAt: null,
    expirationDate: null,
    id: 'BI-9BNM-541J',
    identityType: 'SSN',
    isArchived: false,
    isPrimary: true,
    issueDate: null,
    issuingCountry: 'US',
    object: 'identity',
    updatedAt: '2022-04-01T10:13:58.192561+00:00',
    valid: true,
    value: '999999999'
  }
}
```

If there had been an error, the response would be:

```javascript
{
  "success": false,
  "error": {
    "type": "peach",
    "error": "(Error message from Peach...)"
    "status": 200,
    "peachStatus": 200
  }
}
```

where:

* `status` is the HTTP response status from the call **_to_** Peach from
  your process.
* `peachStatus` is the `status` response that Peach returns in it's payload
  so that you know how the processing went _within_ Peach.

#### [Get Identities](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.list_identities)

You can get all the identities for a Borrower with something like this:

```typescript
const resp = await client.identity.get('BO-9BR3-GW8J')
```

and the response will be something like:

```javascript
{
  success: true,
  identities: {
    count: 2,
    data: [
      {
        createdAt: '2022-03-25T15:30:05.279849+00:00',
        deletedAt: null,
        expirationDate: null,
        id: 'BI-9BNM-541J',
        identityType: 'SSN',
        isArchived: false,
        isPrimary: true,
        issueDate: null,
        issuingCountry: 'US',
        object: 'identity',
        updatedAt: '2022-04-04T17:11:11.272816+00:00',
        valid: true,
        value: '999999999'
      },
      {
        createdAt: '2022-04-04T17:11:11.833664+00:00',
        deletedAt: null,
        expirationDate: null,
        id: 'BI-VK2L-LROB',
        identityType: 'passport',
        isArchived: false,
        isPrimary: false,
        issueDate: null,
        issuingCountry: '',
        object: 'identity',
        updatedAt: null,
        valid: true,
        value: '1111-X-22222'
      }
    ]
  }
}
```

#### [Create Identity](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.create_identity)

You can create a new Identity for a Borrower with a single call looking
something like this:

```typescript
const resp = await client.identity.create('BO-9BR3-GW8J', {
  identityType: 'passport',
  value: '1111-X-22222',
  isPrimary: false,
}, { readAfterWrite: true })
```

This introduces a concept that this library has on several functions:
_read-after-write_, defaulting to `false`, and is available to the caller
to force a second call to Peach - a "read" of the data after the "update"
has been complete.

The response will be something like:

```javascript
{
  success: true,
  identity: {
    createdAt: '2022-04-04T17:16:04.258646+00:00',
    deletedAt: null,
    expirationDate: null,
    id: 'BI-2BQV-VEYJ',
    identityType: 'passport',
    isArchived: false,
    isPrimary: false,
    issueDate: null,
    issuingCountry: '',
    object: 'identity',
    updatedAt: null,
    valid: true,
    value: '1111-X-22222'
  }
}
```

#### [Get Identity by Id](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.get_identity)

If you know the Peach Id (BI-XXXX-XXXX) or the external Id (ext-XXXX) of the
Identity you want, you can get it directly with something like this:

```typescript
const resp = await client.identity.byId('BI-2BQV-VEYJ')
```

and the response will be something like:

```javascript
{
  success: true,
  identity: {
    createdAt: '2022-03-25T15:30:05.279849+00:00',
    deletedAt: null,
    expirationDate: null,
    id: 'BI-9BNM-541J',
    identityType: 'SSN',
    isArchived: false,
    isPrimary: true,
    issueDate: null,
    issuingCountry: 'US',
    object: 'identity',
    updatedAt: '2022-04-04T17:16:03.697970+00:00',
    valid: true,
    value: '999999999'
  }
}
```

#### [Update Identity](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.update_identity)

When you want to update an Identity, you will need the Borrower Id, either
the Peach Id (BO-XXXX-XXXX), or it's external Id (ext-XXXX), and the Identity
Id, either the Peach Id (BI-XXXX-XXXX), or it's external Id (ext-XXXX), as
well as the fields you'd like to update. Not all fields are able to be changed,
so check the Peach docs, but the basic call for changing the `value` of an
Identity is something like this:

```typescript
const resp = await client.identity.update('BO-9BR3-GW8J', 'BI-9BNM-541J', {
  value: '999999998',
}, { readAfterWrite: true })
```

and the response will be something like:

```javascript
{
  success: true,
  identity: {
    createdAt: '2022-03-25T15:30:05.279849+00:00',
    deletedAt: null,
    expirationDate: null,
    id: 'BI-9BNM-541J',
    identityType: 'SSN',
    isArchived: false,
    isPrimary: true,
    issueDate: null,
    issuingCountry: 'US',
    object: 'identity',
    updatedAt: '2022-04-04T17:24:24.601651+00:00',
    valid: true,
    value: '999999998'
  }
}
```

#### [Archive Identity](https://sandboxdocs.peach.finance/#operation/peach.people.handlers.delete_identity)

A _non-Primary_ Identity can be "Archived", or _soft-deleted_, so that it
doesn't appear in standard queries on the Borrower, using a call something
like this:

```typescript
const resp = await client.identity.archive('BO-9BR3-GW8J', 'BI-9BNM-541J')
```

Where the first argument is the Borrower Id, either Peach, or external, and the
second argument is the Identity Id, either Peach, or external. And the response will be something like:

```javascript
{
  success: true,
}
```

as the Identity is pretty much taken _off the board_ at this point in time.

### Contact Calls

As stated in the Peach
[documentation](https://sandboxdocs.peach.finance/#tag/Contact-Information):

> This object allows you to add a Borrower's contact information. A
> Borrower can have multiple contacts.

#### [Create Contact](https://sandboxdocs.peach.finance/#operation/peach.people.contact.handlers.contacts_add)

You can create a Contact, and associate it with a Borrower with a call
something like this:

```typescript
const resp = await client.contact.create('BO-9BR3-GW8J', {
  externalId: '894df0d0-ae38-445b-bc4c-845861c5fdf5',
  contactType: 'phone',
  value: '+13175551212',
  label: 'home',
  affiliation: 'parent',
  status: 'additional',
}, { readAfterWrite: true })
```

and the response will be something like:

```javascript
{
  success: true,
  contact: {
    address: null,
    affiliation: 'parent',
    authorizedThirdParty: false,
    companyId: 'CP-GDB3-G1JO',
    contactType: 'phone',
    createdAt: '2022-04-04T17:37:12.660560+00:00',
    deletedAt: null,
    externalId: 'dd631b4a-bf5f-4e43-8a0a-45a159a8b62b',
    id: 'CT-MJ1Z-292K',
    label: 'home',
    name: null,
    object: 'contact',
    personId: 'BO-9BR3-GW8J',
    phoneDisconnectionDetails: {
      disconnectionStatus: null,
      lastDisconnectCheckDate: null,
      lastKnownConnectionDate: null
    },
    powerOfAttorney: false,
    receiveTextMessages: false,
    receiveTextMessagesLastConsentAt: null,
    status: 'additional',
    updatedAt: null,
    valid: true,
    value: '+13175551212',
    verified: false
  }
}
```

#### [Get Contacts](https://sandboxdocs.peach.finance/#operation/peach.people.contact.handlers.contacts_get_all)

You can get all the Contacts for a given Borrower by passing in the Borrower Id,
be it the Peach Id (BO-XXXX-XXXX), or the externalId (ext-XXXX), and a simple
example of getting all the Contacts looks something like this:

```typescript
const resp = await client.contact.get('BO-9BR3-GW8J')
```

But you can also include several filtering criteria, like:

```typescript
const resp = await client.contact.get('BO-9BR3-GW8J', {
  collidesWithEmail: 'steve@apple.com'
})
```

and the list of filtering fields are all covered in the Peach docs.


The response will be something like:

```javascript
{
  success: true,
  contacts: {
    count: 6,
    total: 6,
    data: [ [Object], [Object], [Object], [Object], [Object], [Object] ]
  }
}
```

where each element in the `data` array is a complete Contact object.

#### [Get Contact by Id](https://sandboxdocs.peach.finance/#operation/peach.people.contact.handlers.contacts_get)

If you know the specific Id for a Contact, either the Peach Id (CT-XXXX-XXXX),
or the external Id (ext-XXXX), as well as the Id for the Borrower, then you
can get the Contact with a call that looks something like this:

```typescript
const resp = await client.contact.byId('BO-9BR3-GW8J', 'CT-LBM7-M69J')
```

where the first argument is the BOrrower Id, and the second is the Contact Id.

The response will be something like:

```javascript
{
  success: true,
  contact: {
    address: null,
    affiliation: 'self',
    authorizedThirdParty: false,
    companyId: 'CP-GDB3-G1JO',
    contactType: 'phone',
    createdAt: '2022-03-30T19:19:14.204270+00:00',
    deletedAt: null,
    externalId: null,
    id: 'CT-LBM7-M69J',
    label: 'personal',
    name: null,
    object: 'contact',
    personId: 'BO-9BR3-GW8J',
    phoneDisconnectionDetails: {
      disconnectionStatus: null,
      lastDisconnectCheckDate: null,
      lastKnownConnectionDate: '2022-03-30'
    },
    powerOfAttorney: false,
    receiveTextMessages: false,
    receiveTextMessagesLastConsentAt: null,
    status: 'primary',
    updatedAt: '2022-04-04T17:42:58.604181+00:00',
    valid: true,
    value: '+15126808574',
    verified: false
  }
}
```

#### [Update Contact](https://sandboxdocs.peach.finance/#operation/peach.people.contact.handlers.contacts_update)

When you want to update a Contact, you will need the Borrower Id, either the
Peach Id (BO-XXXX-XXXX), or it’s external Id (ext-XXXX), and the Contact Id,
either the Peach Id (CT-XXXX-XXXX), or it’s external Id (ext-XXXX), as well
as the fields you’d like to update. Not all fields are able to be changed,
so check the Peach docs, but the basic call for changing the value of a
Contact is something like this:

```typescript
const resp = await client.contact.update('BO-9BR3-GW8J', 'CT-LBM7-M69J', {
  value: '+15126808577',
}, { readAfterWrite: true })
```

and the response will be something like:

```javascript
{
  success: true,
  contact: {
    address: null,
    affiliation: 'self',
    authorizedThirdParty: false,
    companyId: 'CP-GDB3-G1JO',
    contactType: 'phone',
    createdAt: '2022-03-30T19:19:14.204270+00:00',
    deletedAt: null,
    externalId: null,
    id: 'CT-LBM7-M69J',
    label: 'personal',
    name: null,
    object: 'contact',
    personId: 'BO-9BR3-GW8J',
    phoneDisconnectionDetails: {
      disconnectionStatus: null,
      lastDisconnectCheckDate: null,
      lastKnownConnectionDate: '2022-03-30'
    },
    powerOfAttorney: false,
    receiveTextMessages: false,
    receiveTextMessagesLastConsentAt: null,
    status: 'primary',
    updatedAt: '2022-04-04T18:05:27.460451+00:00',
    valid: true,
    value: '+15126808577',
    verified: false
  }
}
```

#### [Delete Contact](https://sandboxdocs.peach.finance/#operation/peach.people.contact.handlers.contacts_delete)

A Contact can be deleted from a Borrower with the Borrower's Id and the
Contact Id. Of course, these can be eitehr Peach Ids or external Ids, and
the call looks something like this:

```typescript
const resp = await client.contact.delete('BO-9BR3-GW8J', 'CT-LBM7-M69J')
```

and the response will be something like:

```javascript
{
  success: true,
}
```

It's important to note that these will be _hard-deletes_ and different
from the Identity `archive()` function as those are retained in the system
after they are archived.

#### [Clone Contact](https://sandboxdocs.peach.finance/#operation/peach.people.contact.handlers.contacts_clone)

As stated in the Peach docs, the cloning operation of a Contact works in
an interesting way:

> Clones the borrower's contact information. Copies all properties from
> the existing contact and applies the passed properties. Sets externalId
> of the existing contact to null. Sets the status of the existing contact
> to archived. Returns the new contact with a new Peach Id.

The call looks something like this:

```typescript
const resp = await client.contact.clone('BO-9BR3-GW8J', 'CT-LBM7-M69J', {
  externalId: '1e39edb2-530c-48f8-9952-590a911010d6',
}, { readAfterWrite: true })
```

where we have asked Peach to assign the `externalId` to the newly cloned
Contact. The response will be something like:

```javascript
{
  success: true,
  contact: {
    address: null,
    affiliation: 'parent',
    authorizedThirdParty: false,
    companyId: 'CP-GDB3-G1JO',
    contactType: 'phone',
    createdAt: '2022-04-04T18:22:25.317984+00:00',
    deletedAt: null,
    externalId: '1e39edb2-530c-48f8-9952-590a911010d6',
    id: 'CT-VK2R-618B',
    label: 'home',
    name: null,
    object: 'contact',
    personId: 'BO-9BR3-GW8J',
    phoneDisconnectionDetails: {
      disconnectionStatus: null,
      lastDisconnectCheckDate: null,
      lastKnownConnectionDate: null
    },
    powerOfAttorney: false,
    receiveTextMessages: false,
    receiveTextMessagesLastConsentAt: null,
    status: 'additional',
    updatedAt: '2022-04-04T18:22:25.707472+00:00',
    valid: true,
    value: '+16305551212',
    verified: false
  }
}
```

### Loan Calls

As stated in the Peach
[documentation](https://sandboxdocs.peach.finance/#tag/Loans):

> Borrowers typically have loans. We support multiple loan types and each
> loan type comes with its set of federal and state compliance rules. You
> can maintain different statuses of a loan. A borrower can have multiple
> loans. A loan can belong to multiple people but only one borrower can be
> defined as a `mainBorrower`. A loan is always created using the
> `mainBorrower` borrower identifier. Other people can be added as part of
> the loan details.
>
> All loan attributes can be updated as long as the loan is in `pending`
> status. Once the loan status changes to `originated` some attributes become
> read only and cannot be updated.
>
> A Loan doesn't start accruing interest until it is activated. To activate
> the loan, call `Activate a loan`. On activation the loan can use the due
> dates and payments schedule from the `atOrigination` object or the loan can
> be re-amortized using the activation date as the loan start date.

#### [Create Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loans_add)

Creating a Loan for a Borrower starts with the Borrower Id, either Peach Id,
or external Id, and then those fields necessary to get the Loan started. The
call might look something like this:

```typescript
const resp = await client.loan.create('BO-9BR3-GW8J', {
  type: 'lineOfCredit',
  externalId: 'c9bcd411-02ee-4476-a5b4-f08fd7d89923',
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
}, { readAfterWrite: true })
```

The response will be something like:

```javascript
{
  success: true,
  loan: {
    assetDisplayName: 'Line of Credit',
    assetType: 'businessOpenEndUnsecured',
    atOrigination: {
      aprEffective: null,
      aprNominal: null,
      bufferToPushOutSchedule: null,
      creditLimitAmount: 45000,
      discountProgramIds: null,
      downPaymentAmount: 0,
      fees: [Object],
      interestRates: [Array],
      investors: [Array],
      isValidMerchantId: false,
      itemsOrServicesFinanced: null,
      mdr: [Object],
      merchantId: null,
      originatingCreditorName: 'Bank of Mars',
      originationLicense: 'nationalBank',
      paymentFrequency: 'monthly',
      personAddress: [Object],
      promoPrograms: null,
      promoRates: null,
      skipCreditReporting: false,
      specificDays: [Array],
      validAddress: true
    },
    chargedOffReason: null,
    companyId: 'CP-GDB3-G1JO',
    current: { autopayEnabled: false, creditLimitAmount: null },
    declineReason: null,
    displayId: '6f43e10a-79df-4368-b450-879fbc529511',
    endDate: null,
    externalId: '6f43e10a-79df-4368-b450-879fbc529511',
    id: 'LN-OKZG-5WQB',
    isClosed: false,
    loanTypeId: 'LT-25K9-7GJ6',
    mainBorrowerId: 'BO-9BR3-GW8J',
    metaData: null,
    newDrawsAllowed: true,
    nickname: 'My First LoC',
    object: 'lineOfCredit',
    ratesValidation: {
      interestRateAtOrigBelowMin: false,
      interestRateAtOrigExceedsMax: false
    },
    servicedBy: 'creditor',
    status: 'originated',
    timestamps: {
      acceleratedAt: null,
      activatedAt: null,
      chargedOffAt: null,
      closedAt: null,
      createdAt: '2022-04-04T20:13:53.127801+00:00',
      deletedAt: null,
      frozenAt: null,
      lastAmortizedAt: null,
      originatedAt: '2022-04-04T20:13:53.354431+00:00',
      paidOffAt: null,
      startedAt: null,
      updatedAt: '2022-04-04T20:13:53.383073+00:00'
    },
    type: 'lineOfCredit'
  }
}
```

#### [Get Loans](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loans_get)

With the Borrower Id, be it the Peach Id, or the external Id, you can get
all the Loans for that Borrower with:

```typescript
const resp = await client.loan.get('BO-9BR3-GW8J')
```

The response will be something like:

```javascript
{
  success: true,
  loans: {
    count: 4,
    total: 4,
    data: [ [Object], [Object], [Object], [Object] ]
  }
}
```

where each element of the `data` array is a complete Loan, as you might get
from `byId()`.

#### [Get Loan by Id](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_get)

You can get a single Loan by providing the Borrower Id and Loan Id, be they
Peach Ids or external Ids, with a call like:

```typescript
const resp = await client.loan.byId('BO-9BR3-GW8J', LN-OKZG-5WQB)
```

The response will be something like:

```javascript
{
  success: true,
  loan: {
    assetDisplayName: 'Line of Credit',
    assetType: 'businessOpenEndUnsecured',
    atOrigination: {
      aprEffective: null,
      aprNominal: null,
      bufferToPushOutSchedule: null,
      creditLimitAmount: 45000,
      discountProgramIds: null,
      downPaymentAmount: 0,
      fees: [Object],
      interestRates: [Array],
      investors: [Array],
      isValidMerchantId: false,
      itemsOrServicesFinanced: null,
      mdr: [Object],
      merchantId: null,
      originatingCreditorName: 'Bank of Mars',
      originationLicense: 'nationalBank',
      paymentFrequency: 'monthly',
      personAddress: [Object],
      promoPrograms: null,
      promoRates: null,
      skipCreditReporting: false,
      specificDays: [Array],
      validAddress: true
    },
    chargedOffReason: null,
    companyId: 'CP-GDB3-G1JO',
    current: { autopayEnabled: false, creditLimitAmount: null },
    declineReason: null,
    displayId: '6f43e10a-79df-4368-b450-879fbc529511',
    endDate: null,
    externalId: '6f43e10a-79df-4368-b450-879fbc529511',
    id: 'LN-OKZG-5WQB',
    isClosed: false,
    loanTypeId: 'LT-25K9-7GJ6',
    mainBorrowerId: 'BO-9BR3-GW8J',
    metaData: null,
    newDrawsAllowed: true,
    nickname: 'My First LoC',
    object: 'lineOfCredit',
    ratesValidation: {
      interestRateAtOrigBelowMin: false,
      interestRateAtOrigExceedsMax: false
    },
    servicedBy: 'creditor',
    status: 'originated',
    timestamps: {
      acceleratedAt: null,
      activatedAt: null,
      chargedOffAt: null,
      closedAt: null,
      createdAt: '2022-04-04T20:13:53.127801+00:00',
      deletedAt: null,
      frozenAt: null,
      lastAmortizedAt: null,
      originatedAt: '2022-04-04T20:13:53.354431+00:00',
      paidOffAt: null,
      startedAt: null,
      updatedAt: '2022-04-04T20:13:53.383073+00:00'
    },
    type: 'lineOfCredit'
  }
}
```

#### [Update Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_update)

There are several parts of a Loan that are updateable - based on the state
of the Loan. The editable fields are documented in the Peach docs. To
update a Loan, you can make a call like:

```typescript
const resp = await client.loan.update('BO-9BR3-GW8J', 'LN-5K97-XPVJ', {
  nickname: 'DustBin Expansion',
}, { readAfterWrite: true })
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be similar to the response from `byId()`, where the updated Load is returned.

#### [Get Loan Periods](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.get_loan_periods)

The call to return the Loan's payment periods looks something like this:

```typescript
const resp = await client.loan.periods('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  periods: {
    data: [
      {
        dueDate: '2022-04-30',
        endDate: '2022-04-09',
        id: 'PE-BOQQ-3M2J',
        object: 'loanPeriod',
        startDate: '2022-04-01',
        statementDate: '2022-04-10'
      }
    ]
  }
}
```

#### [Activate Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_activate)

Once a Loan is created, is has to be _Activated_ in order to be visible
to the Borrower, and to start accruing interest. This is done with a call
like:

```typescript
const resp = await client.loan.activate('BO-9BR3-GW8J', 'LN-OKZG-5WQB')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  schedule: [
    {
      amount: 0,
      date: '2022-05-10',
      dynamicFeeDetails: [Object],
      interestAmount: 0,
      interestBeforeDiscountAmount: 0,
      isDeferred: false,
      originalAmount: 0,
      paymentType: 'periodicPayment',
      periodId: 'PE-BRQQ-ZVMJ',
      principalAmount: 0,
      status: 'booked',
      unroundedInterestAmount: '0',
      unroundedInterestBeforeDiscountAmount: '0',
      unroundedPrincipalAmount: '0'
    }
  ]
}
```

#### [Reimburse](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_reimburse)

From the Peach docs:

> The reimburse call should be used when the lender owes money to a borrower
> on a given loan. The call will execute a reimbursement according to the
> specified `reimbursementAmount`. If the `reimbursementAmount` is greater
> than the amount owed to the borrower, the system will not process the
> reimbursement and return an error. Funds are reimbursed to a specified
> payment instrument. The endpoint will update the ledger and create a
> new transaction.
>
> If the loan type is installment, the loan must be in `paidOff` status to
> process reimbursement. If the loan type is line of credit, the loan can be
> in `active`, `accelerated`, `chargedOff` or `paidOff` status to process
> reimbursement.
>
> If `paymentInstrumentId` is `isExternal=true`, the payment method can be
> of any type (e.g. bank account, card, etc.) If `paymentInstrumentId` is
> `isExternal=false` and Peach is processing payments (per company
> configuration), the payment method must be a bank account.

Making the reimpurse call looks something like this:

```typescript
const resp = await client.loan.reimburse('BO-9BR3-GW8J', 'LN-OKZG-5WQB', {
  isExternal: true,
  reimbursementAmount: 250,
})
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  reimbursement: {
    ...
  }
}
```

**Note:** We haven't specificed the types on this return value in this client
due to insufficient testing.

#### [Cancel Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_cancel)

From the Peach docs:

> The cancel loan function will change the status of a loan to `canceled`,
> and trigger any cancellation-related logic, such as removing a loan from
> active monitoring and handling the accounting treatment for canceled loans.
>
> A loan must be in `originated` or `pending` status to be canceled.

To cancel a Loan, simply call:

```typescript
const resp = await client.loan.cancelsearch('BO-9BR3-GW8J', 'LN-OKZG-5WQB')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be a simple `success` boolean:

```javascript
{
  success: true,
}
```

#### [Close Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_close)

The call for closing a Loan is something like:

```typescript
const resp = await client.loan.close('BO-9BR3-GW8J', 'LN-OKZG-5WQB', {
  closeReason: 'This is the reason we have closed the Loan.',
})
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be a simple `success` boolean:

```javascript
{
  success: true,
}
```

#### [Get Loan Credit Limit](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_get_credit_limit)

If all you are interested in for a Loan is the Credit Limit, this call will
return just the core details about that:

```typescript
const resp = await client.loan.creditLimit('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  adverseActionReason: 'None',
  caseId: null,
  creditLimitAmount: 50000,
  sendNotice: true,
}
```

#### [Update Loan Credit Limit](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_update_credit_limit)

You can update just the Credit Limit on a Loan with a call something like:

```typescript
const resp = await client.loan.updateCreditLimit(
 'BO-9BR3-GW8J',
 'LN-5K97-XPVJ',
 { creditLimitAmount: 75000 },
)
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like the response from `byId()` - which is the complete Loan.

#### [Freeze Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_freeze)

From the Peach docs:

> Freeze loan will change the status of an `active` **_installment_** loan
> to `frozen` effective as of the current date. The loan will remain in a
> frozen status until the Unfreeze endpoint is called.

It is important to note this is only valid on installment Loans and not
Lines of Credit.

The call looks something like this:

```typescript
const resp = await client.loan.freeze('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be a simple `success` boolean:

```javascript
{
  success: true,
}
```

#### [Unfreeze Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_unfreeze)


From the Peach docs:

> The Unfreeze endpoint will change the status of a `frozen` loan back to
> `active`.

It is important to note this is only valid on installment Loans and not
Lines of Credit.

The call looks something like this:

```typescript
const resp = await client.loan.unfreeze('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be a simple `success` boolean:

```javascript
{
  success: true,
  paymentFrequency: 'weekly',
  specificDays: [ 10 ],
  schedule: [
    {
      ...
    }
  ]
}
```

#### [Accelerate Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_accelerate)

From the Peach docs:

> The accelerate endpoint will change the status of an `active` loan to
> `accelerated`, and trigger any acceleration-related logic and accounting
> treatment.
>
> Acceleration is only valid for installment and line of credit loans.

The call looks something like this:

```typescript
const resp = await client.loan.accelerate('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  acceleratedAmount: 0,
}
```

#### [Reverse Accelerate](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_accelerate_reverse)

From the Peach docs:

> A loan must be in `accelerated` status to be reversed.
>
> The reverse accelerate endpoint will reverse a loan in `accelerated` status,
> and roll back any acceleration-related logic and accounting treatment.
>
> Reverse acceleration triggers a replay of the loan starting from the day of
> acceleration as if the loan was in `active` status. This means if the
> acceleration occurred on day 90 of the loan, and the reverse acceleration
> is triggered on day 100, the loan will be replayed as an `active` loan
> with interest accrual between days 90-100. If the reversal is triggered
> on day 90 (the same day of the acceleration), no additional interest is
> accrued. The result of a reverse acceleration is a loan in `active` status.
>
> The `accelerationDueWithin` and `chargeOffDueWithin` configurations of the
> loan are still in force. So a loan could possibly go back to `accelerated`
> or `chargedOff` status during the next day if the balance is not paid on
> the day a reversal was made.

The call looks something like this:

```typescript
const resp = await client.loan.reverseAccelerate('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  reverseAcceleratedAmount: 0,
}
```

#### [Charge-Off Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_charge_off)

From the Peach docs:

> The charge-off function will change the status of a loan to `charged-off`,
> and trigger any charge-off-related logic and accounting treatment.
>
> A loan must be in `accelerated` status before being moved to `charged-off`.
> If an `active` loan is being charged off, this endpoint will handle moving
> the loan status to `accelerated` before charging off. Charge-off is only
> valid for installment and line of credit loans.

The call looks something like this:

```typescript
const resp = await client.loan.chargeOff('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  chargeOffAmount: 0,
}
```

#### [Reverse Charge-Off](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_charge_off_reverse)

From the Peach docs:

> A loan must be in `charged-off` status to be reversed.
>
> The reverse charge-off function will reverse a loan in `chargedOff` status,
> and roll back any charge-off-related logic and accounting treatment.
>
> Reverse charge-off triggers a replay of the loan starting from the day of
> charge off as if the loan was in `active` status. This means if the charge-off
> occurred on day 120 of the loan, and the reverse charge-off is triggered on
> day 130, the loan will be replayed as an `active` loan with interest accrual
> between days 120-130. If the reversal is triggered on day 120 (the same day
> of the charge-off), no additional interest is accrued. The result of a
> reverse charge-off is a loan in `active` status.
>
> The `chargeOffDueWithin` configurations of the loan is still in force. So
> a loan could possibly go back to `chargedOff` status during the next day
> if the balance is not paid on the day a reversal was made.

The call looks something like this:

```typescript
const resp = await client.loan.reverseChargeOff('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  reverseChargeOffAmount: 0,
}
```

#### [Refresh Loan](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_refresh)

From the Peach docs:

> In the case that a loan is out of sync, the `refresh()` function will make
> sure that obligations, expected payments, and interest accrual is brought
> into sync.
>
> Refresh loan is only valid for the statuses of `active`, `accelerate`,
> `paidOff`, and `chargedOff`.

The call looks something like this:

```typescript
const resp = await client.loan.refresh('BO-9BR3-GW8J', 'LN-5K97-XPVJ')
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be a simple `success` boolean:

```javascript
{
  success: true,
}
```

### Draw Calls

As stated in the Peach
[documentation](https://sandboxdocs.peach.finance/#tag/Line-of-Credit-Draws):

> This object represents a draw. Draws can me made on Line of Credit loans
> only. Draws can be amortized or non-amortized. If amortized, the draw will
> be amortized over the selected number of periods and aligned to the Line
> of Credit due dates. If non-amortized, the draw is due on a due date
> following the current period statement creation. A draw can have different
> interest and promo rates from the Line of Credit. Each draw has a unique
> identifier, similar to a loan.

#### [Create Draw](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_draws_post)

Creating a Draw looks something like this:

```typescript
const resp = await client.draw.create('BO-9BR3-GW8J', 'LN-5K97-XPVJ', {
  externalId: 'b83309f4-3338-4e33-bab8-b3050d6a4102',
  nickname: 'My Draw',
  status: 'originated',
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
})
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  draw: {
    assetDisplayName: 'Line of Credit',
    atOrigination: {
      aprEffective: null,
      aprNominal: null,
      autoAmortization: [Object],
      creditLimitAmount: null,
      fees: [Object],
      gracePeriod: [Object],
      interestRates: [Array],
      mdr: [Object],
      minPaymentCalculation: [Object],
      promoRates: null
    },
    companyId: 'CP-GDB3-G1JO',
    current: { creditLimitAmount: null, periodicPayment: null },
    declineReason: null,
    displayId: '18f5cd34-399d-4651-b600-ca85557b8081',
    endDate: null,
    externalId: '18f5cd34-399d-4651-b600-ca85557b8081',
    id: 'LN-2BQP-ZXYJ',
    isClosed: false,
    lineOfCreditId: 'LN-5K97-XPVJ',
    loanTypeId: 'LT-25K9-7GJ6',
    mainBorrowerId: 'BO-9BR3-GW8J',
    metaData: null,
    nickname: 'My Draw',
    object: 'draw',
    ratesValidation: {
      interestRateAtOrigBelowMin: false,
      interestRateAtOrigExceedsMax: false
    },
    servicedBy: 'creditor',
    status: 'pending',
    timestamps: {
      acceleratedAt: null,
      activatedAt: null,
      chargedOffAt: null,
      closedAt: null,
      createdAt: '2022-04-05T13:34:51.398398+00:00',
      deletedAt: null,
      frozenAt: null,
      lastAmortizedAt: null,
      originatedAt: null,
      paidOffAt: null,
      startedAt: null,
      updatedAt: '2022-04-05T13:34:51.441659+00:00'
    },
    type: 'draw'
  }
}
```

#### [Get Draws](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_draws_get)

The call to get Draws for a Borrower, and Loan, looks something like this:

```typescript
const resp = await client.draw.get('BO-9BR3-GW8J', 'LN-5K97-XPVJ', {
  status: 'originated'
})
```

where the first two arguments are the Borrower Id, and Loan Id - and can be
the Peach Ids or external Ids, if they have been assigned, and the optional
third argument is a series of the filtering criteria that are further
documented in the Peach docs. The response will be something like:

```javascript
{
  success: true,
  draws: {
    count: 1,
    total: 1,
    data: [
      {
        assetDisplayName: 'Line of Credit',
        atOrigination: {
          aprEffective: null,
          aprNominal: null,
          autoAmortization: [Object],
          creditLimitAmount: null,
          fees: [Object],
          gracePeriod: [Object],
          interestRates: [Array],
          mdr: [Object],
          minPaymentCalculation: [Object],
          promoRates: null
        },
        companyId: 'CP-GDB3-G1JO',
        current: { creditLimitAmount: null, periodicPayment: null },
        declineReason: null,
        displayId: '8f3ef3d9-600c-42e6-bb2c-c82b6d07f6f6',
        endDate: null,
        externalId: '8f3ef3d9-600c-42e6-bb2c-c82b6d07f6f6',
        id: 'LN-RKXE-D5ZB',
        isClosed: true,
        lineOfCreditId: 'LN-5K97-XPVJ',
        loanTypeId: 'LT-25K9-7GJ6',
        mainBorrowerId: 'BO-9BR3-GW8J',
        metaData: null,
        nickname: 'My Draw',
        object: 'draw',
        ratesValidation: {
          interestRateAtOrigBelowMin: false,
          interestRateAtOrigExceedsMax: false
        },
        servicedBy: 'creditor',
        status: 'pending',
        timestamps: {
          acceleratedAt: null,
          activatedAt: null,
          chargedOffAt: null,
          closedAt: '2022-04-05T11:24:49.566219+00:00',
          createdAt: '2022-04-05T11:24:48.321331+00:00',
          deletedAt: null,
          frozenAt: null,
          lastAmortizedAt: null,
          originatedAt: null,
          paidOffAt: null,
          startedAt: null,
          updatedAt: '2022-04-05T11:24:49.571167+00:00'
        },
        type: 'draw'
      }
    ],
  }
}
```

#### [Get Draw by Id](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_draw_get)

The call to get a single Draw for a Borrower and Loan looks something like this:

```typescript
const resp = await client.draw.byId(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ'
)
```

where the arguments are the Borrower Id, Loan Id, and Draw Id - and can be
the Peach Ids or external Ids, if they have been assigned. The response will
be something like:

```javascript
{
  success: true,
  draw: {
    assetDisplayName: 'Line of Credit',
    atOrigination: {
      aprEffective: null,
      aprNominal: null,
      autoAmortization: [Object],
      creditLimitAmount: null,
      fees: [Object],
      gracePeriod: [Object],
      interestRates: [Array],
      mdr: [Object],
      minPaymentCalculation: [Object],
      promoRates: null
    },
    companyId: 'CP-GDB3-G1JO',
    current: { creditLimitAmount: null, periodicPayment: null },
    declineReason: null,
    displayId: '18f5cd34-399d-4651-b600-ca85557b8081',
    endDate: null,
    externalId: '18f5cd34-399d-4651-b600-ca85557b8081',
    id: 'LN-2BQP-ZXYJ',
    isClosed: false,
    lineOfCreditId: 'LN-5K97-XPVJ',
    loanTypeId: 'LT-25K9-7GJ6',
    mainBorrowerId: 'BO-9BR3-GW8J',
    metaData: null,
    nickname: 'My Draw',
    object: 'draw',
    ratesValidation: {
      interestRateAtOrigBelowMin: false,
      interestRateAtOrigExceedsMax: false
    },
    servicedBy: 'creditor',
    status: 'pending',
    timestamps: {
      acceleratedAt: null,
      activatedAt: null,
      chargedOffAt: null,
      closedAt: null,
      createdAt: '2022-04-05T13:34:51.398398+00:00',
      deletedAt: null,
      frozenAt: null,
      lastAmortizedAt: null,
      originatedAt: null,
      paidOffAt: null,
      startedAt: null,
      updatedAt: '2022-04-05T13:34:51.441659+00:00'
    },
    type: 'draw'
  }
}
```

#### [Update Draw](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_update)

There are several updateable fields on a Draw, and the call to change one or
more of them looks something like this:

```typescript
const resp = await client.draw.update(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  {
    nickname: 'Scooby-Doo'
  }
)
```

where the first three arguments are the Borrower Id, Loan Id, and Draw Id -
and can be the Peach Ids or external Ids, if they have been assigned, and
the fourth argument contains those values you'd like to change from the list
of allowable settings to change in the Peach docs. The response will
be something like:

```javascript
{
  success: true,
  draw: {
    assetDisplayName: 'Line of Credit',
    atOrigination: {
      aprEffective: null,
      aprNominal: null,
      autoAmortization: [Object],
      creditLimitAmount: null,
      fees: [Object],
      gracePeriod: [Object],
      interestRates: [Array],
      mdr: [Object],
      minPaymentCalculation: [Object],
      promoRates: null
    },
    companyId: 'CP-GDB3-G1JO',
    current: { creditLimitAmount: null, periodicPayment: null },
    declineReason: null,
    displayId: '18f5cd34-399d-4651-b600-ca85557b8081',
    endDate: null,
    externalId: '18f5cd34-399d-4651-b600-ca85557b8081',
    id: 'LN-2BQP-ZXYJ',
    isClosed: false,
    lineOfCreditId: 'LN-5K97-XPVJ',
    loanTypeId: 'LT-25K9-7GJ6',
    mainBorrowerId: 'BO-9BR3-GW8J',
    metaData: null,
    nickname: 'Scooby-Doo',
    object: 'draw',
    ratesValidation: {
      interestRateAtOrigBelowMin: false,
      interestRateAtOrigExceedsMax: false
    },
    servicedBy: 'creditor',
    status: 'pending',
    timestamps: {
      acceleratedAt: null,
      activatedAt: null,
      chargedOffAt: null,
      closedAt: null,
      createdAt: '2022-04-05T13:34:51.398398+00:00',
      deletedAt: null,
      frozenAt: null,
      lastAmortizedAt: null,
      originatedAt: null,
      paidOffAt: null,
      startedAt: null,
      updatedAt: '2022-04-05T13:34:51.441659+00:00'
    },
    type: 'draw'
  }
}
```

#### [Activate Draw](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_activate)

The call looks something like this:

```typescript
const resp = await client.draw.activate(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
)
```

where the first three arguments are the Borrower Id, Loan Id, and Draw Id -
and can be the Peach Ids or external Ids, if they have been assigned. The response will be something like:

```javascript
{
  success: true,
  schedule: [
    {
      amount: 0.0,
      date: "2022-05-10",
      dynamicFeeDetails: {
        apiName: null,
        displayName: null,
        dynamicFeeTypeId: null,
        loanFeeId: null,
        transactionId: null
      },
      interestAmount: 0.0,
      interestBeforeDiscountAmount: 0.0,
      isDeferred: false,
      originalAmount: 0.0,
      paymentType: "periodicPayment",
      periodId: "PE-K9P4-62OB",
      principalAmount: 0.0,
      status: "booked",
      unroundedInterestAmount: "0",
      unroundedInterestBeforeDiscountAmount: "0",
      unroundedPrincipalAmount: "0"
    }
  ],
  ratesValidation: { ... },
  amountsValidation: { ... },
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Draw Credit Limit](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_get_credit_limit)

It's possible to get the Credit Limit on a single Draw, and the call
looks something like this:

```typescript
const resp = await client.draw.creditLimit(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
)
```

where the first three arguments are the Borrower Id, Loan Id, and Draw Id -
and can be the Peach Ids or external Ids, if they have been assigned. The response will be something like:

```javascript
{
  success: true,
  caseId: null,
  creditLimitAmount: 50000
}
```

#### [Update Draw Credit Limit](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_update_credit_limit)

The call to update the Draw's Credit Limit looks something like this:

```typescript
const resp = await client.draw.updateCreditLimit(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  {
    creditLimitAmount: 45000
  }
)
```

where the first three arguments are the Borrower Id, Loan Id, and Draw Id -
and can be the Peach Ids or external Ids, if they have been assigned. The response will be something like the output of `byId()` for a Draw.

#### [Preview Draw Amortization](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.preview_draw_amortize)

It's possible to do simple _What if?_ amortizations on a _potential_ Draw
by calling the `previewAmortization()` function. The call looks something
like this:

```typescript
const resp = await client.draw.previewAmortization(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  {
    purchaseAmount: 15000,
    duration: 24,
    startDate: '2022-05-01',
  }
)
```

where the first two arguments are the Borrower Id, and Loan Id -
and can be the Peach Ids or external Ids, if they have been assigned. The response will be something like:

```javascript
{
  success: true,
  schedule: [
    { ... }
  ]
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Amortize Draw](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.loan_draw_amortize)

It's possible to amortize an existing Draw, and the call looks something
like this:

```typescript
const resp = await client.draw.amortize(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  {
    duration: 24,
  }
)
```

where the first two arguments are the Borrower Id, and Loan Id -
and can be the Peach Ids or external Ids, if they have been assigned. The response will be something like:

```javascript
{
  success: true,
  schedule: [
    { ... }
  ]
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Close Draw](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_close)

The call to close a Draw looks something like this:

```typescript
const resp = await client.draw.close(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
)
```

where the first three arguments are the Borrower Id, Loan Id, and Draw Id -
and can be the Peach Ids or external Ids, if they have been assigned. The response will be a simple `success` boolean:

```javascript
{
  success: true,
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Cancel Draw](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_cancel)

From the Peach docs:

> The cancel draw function will change the status of a draw to `canceled`,
> and trigger any cancellation-related logic.
>
> An `active` draw can be canceled if it has no `active` purchases.

The call looks something like this:

```typescript
const resp = await client.draw.cancel(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
)
```

where the first three arguments are the Borrower Id, Loan Id, and Draw Id -
and can be the Peach Ids or external Ids, if they have been assigned. The response will be a simple `success` boolean:

```javascript
{
  success: true,
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

### Purchase Calls

As stated in the Peach
[documentation](https://sandboxdocs.peach.finance/#tag/Line-of-Credit-Purchases):

> Identity objects represent various forms of identification that a borrower
> may have. We allow one primary identity per borrower, and any number of
> secondary identities. The identity sent when creating a borrower is the
> primary identity, and cannot be deleted/archived or changed to be a
> secondary identity.

#### [Create Purchase](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_purchases_create)

The call to create a Purchase on a Draw, on a Loan, for a Borrower, looks
something like this:

```typescript
const resp = await client.purchase.create(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  {
    externalId: 'f649d348-8a15-4359-9673-d1efbd75020e',
    type: 'regular',
    amount: 75.50,
    purchaseDate: '2022-04-02',
    purchaseDetails: {
      description: 'Big Drill',
      pointOfSaleType: 'online',
      merchantName: 'HomeDepot',
    },
    status: 'settled',
  }
)
```

where the first three arguments are the Borrower Id, Loan Id, and Draw Id -
and can be the Peach Ids or external Ids, if they have been assigned. The
response will be something like:

```javascript
{
  success: true,
  purchase: {
    amount: 75.5,
    declineReason: null,
    displayId: 'f649d348-8a15-4359-9673-d1efbd75020e',
    eligibleDisputeAmount: 75.5,
    externalId: 'f649d348-8a15-4359-9673-d1efbd75020e',
    id: 'DP-OB7O-L16B',
    metadata: null,
    originalAmount: 75.5,
    originalPurchaseId: null,
    purchaseDate: '2022-04-14',
    purchaseDetails: {
      categoryId: null,
      conversionRate: 1,
      description: 'Big Drill',
      externalCardId: null,
      isValidMerchantId: false,
      merchantId: null,
      merchantName: 'HomeDepot',
      metadata: null,
      originalCurrencyAmount: null,
      originalCurrencyCode: 'USD',
      pointOfSaleType: 'physical'
    },
    status: 'settled',
    timestamps: {
      createdAt: '2022-04-14T18:08:35.847211+00:00',
      updatedAt: '2022-04-14T18:08:34.857352+00:00'
    },
    type: 'regular'
  }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Purchases](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_purchases_get)

The call to get all Purchases for a Draw, on a Loan, for a Borrower looks
something like this:

```typescript
const resp = await client.purchase.get(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  {
    status: 'settled',
  }
)
```

where the first three arguments are the Borrower Id, Loan Id, and Draw Id -
and can be the Peach Ids or external Ids, if they have been assigned. The
fourth argument are the filtering fields, documented in the Peach docs,
to select which Purchases you want to see. The response will be something
like:

```javascript
{
  success: true,
  purchases: {
    count: 1,
    total: 1,
    data: [
      { ... },
    ],
  }
  ]
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Purchase by Id](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_purchase_get_one)

The call to get a specific Purchase on a Draw, on a Loan, for a Borrower,
looks something like this:

```typescript
const resp = await client.purchase.byId(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  'XX-XXXX-XXXX'
)
```

where the arguments are the Borrower Id, Loan Id, Draw Id, and Purchase Id -
and can be the Peach Ids or external Ids, if they have been assigned. The
response will be something like:

```javascript
{
  success: true,
  purchase: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Update Purchase](https://sandboxdocs.peach.finance/#operation/peach.people.loans.handlers.draw_purchase_update)

The call to update the possible fields on a Purchase, on a Draw, on a Loan,
for a Borrower, looks something like this:

```typescript
const resp = await client.purchase.update(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  'XX-XXXX-XXXX',
  {
    status: 'settled',
  }
)
```

where the arguments are the Borrower Id, Loan Id, Draw Id, and Purchase Id -
and can be the Peach Ids or external Ids, if they have been assigned. The
response will be something like:

```javascript
{
  success: true,
  purchase: {
    amount: 60,
    declineReason: null,
    displayId: '4facb63a-442c-467e-8677-a004d7cec60b',
    eligibleDisputeAmount: 0,
    externalId: '4facb63a-442c-467e-8677-a004d7cec60b',
    id: 'DP-5K9P-M7YB',
    metadata: null,
    originalAmount: null,
    originalPurchaseId: null,
    purchaseDate: '2022-04-14',
    purchaseDetails: {
      categoryId: null,
      conversionRate: 1,
      description: 'Big Drill',
      externalCardId: null,
      isValidMerchantId: false,
      merchantId: null,
      merchantName: 'HomeDepot',
      metadata: null,
      originalCurrencyAmount: null,
      originalCurrencyCode: 'USD',
      pointOfSaleType: 'physical'
    },
    status: 'pending',
    timestamps: {
      createdAt: '2022-04-14T18:17:57.337643+00:00',
      updatedAt: '2022-04-14T18:17:58.584053+00:00'
    },
    type: 'regular'
  }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Create Purchase Dispute](https://sandboxdocs.peach.finance/#operation/peach.loans.purchase_disputes.handlers.purchase_dispute_create)

The call to create a Purchase Dispute on a Purchase, on a Draw, on a Loan,
for a Borrower, looks something like this:

```typescript
const resp = await client.purchaseDispute.create(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  'XX-XXXX-XXXX',
  {
    externalId: '2273fd8c-2fd5-4f8d-b3c4-9c541c742bdc',
    status: 'submitted',
    disputedAmount: 52.55,
  }
)
```

where the arguments are the Borrower Id, Loan Id, Draw Id, and Purchase Id -
and can be the Peach Ids or external Ids, if they have been assigned. The
response will be something like:

```javascript
{
  success: true,
  dispute: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Purchase Disputes](https://sandboxdocs.peach.finance/#operation/peach.loans.purchase_disputes.handlers.purchase_disputes_list_for_purchase)

The call to list all the Purchase Disputes on a Draw, on a Loan, for a
Borrower, looks something like this:

```typescript
const resp = await client.purchaseDispute.get(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  'XX-XXXX-XXXX'
)
```

where the arguments are the Borrower Id, Loan Id, Draw Id, and Purchase Id -
and can be the Peach Ids or external Ids, if they have been assigned. The
response will be something like:

```javascript
{
  success: true,
  disputes: [
    { ... }
  ]
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Draw Purchase Disputes](https://sandboxdocs.peach.finance/#operation/peach.loans.purchase_disputes.handlers.purchase_disputes_list_for_draw)

The call to get all the Purchase Disputes for a Draw, on a Loan, for a
Borrower, looks something like this:

```typescript
const resp = await client.purchaseDispute.getForDraw(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
)
```

where the arguments are the Borrower Id, Loan Id, and Draw Id -
and can be the Peach Ids or external Ids, if they have been assigned. The
response will be something like:

```javascript
{
  success: true,
  disputes: [
    { ... }
  ]
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Line of Credit Purchase Disputes](https://sandboxdocs.peach.finance/#operation/peach.loans.purchase_disputes.handlers.purchase_disputes_list_for_loc)

The call to get all the Purchase Disputes on a Loan, for a Borrower,
looks something like this:

```typescript
const resp = await client.purchaseDispute.getForLoan(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
)
```

where the arguments are the Borrower Id, and Loan Id -
and can be the Peach Ids or external Ids, if they have been assigned. The
response will be something like:

```javascript
{
  success: true,
  disputes: [
    { ... }
  ]
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Purchase Dispute by Id](https://sandboxdocs.peach.finance/#operation/peach.loans.purchase_disputes.handlers.purchase_dispute_get)

The call to get a specific Purchase Dispute by it's Id looks something like
this:

```typescript
const resp = await client.purchaseDispute.byId(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  'XX-XXXX-XXXX'
)
```

where the arguments are the Borrower Id, Loan Id, Draw Id, Purchase Id,
and Purchase Dispute Id - and can be the Peach Ids or external Ids, if
they have been assigned. The response will be something like:

```javascript
{
  success: true,
  dispute: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Update Purchase Dispute](https://sandboxdocs.peach.finance/#operation/peach.loans.purchase_disputes.handlers.purchase_dispute_update)

The call to update a Purchase Dispute on a Purchase, on a Draw, on a Loan,
for a Borrower, looks something like this:

```typescript
const resp = await client.purchaseDispute.update(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'LN-2BQP-ZXYJ',
  'XX-XXXX-XXXX',
  'YY-XXXX-XXXX',
  {
    externalId: 'f637c3e7-ccc8-44fb-ac66-1da222a6e406',
    status: 'expired'
  },
  {
    sync: true
  }
)
```

where the arguments are the Borrower Id, Loan Id, Draw Id, Purchase Id,
and Purchase Dispute Id - and can be the Peach Ids or external Ids, if
they have been assigned. The next argument is the data to update the Dispute
with, and the final, optional, argument is the flag indicating if this is
to be an asynchronous call, or a synchronous one. The default is async.
The response will be something like:

```javascript
{
  success: true,
  dispute: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

### Transaction Calls

As stated in the Peach
[documentation](https://sandboxdocs.peach.finance/#tag/Transactions):

> Identity objects represent various forms of identification that a borrower
> may have. We allow one primary identity per borrower, and any number of
> secondary identities. The identity sent when creating a borrower is the
> primary identity, and cannot be deleted/archived or changed to be a
> secondary identity.

#### [Create Transaction](https://sandboxdocs.peach.finance/#operation/peach.transactions.handlers.transactions_create)

The call to creeate a Transaction on a Loan, for a Borrower, looks
something like this:

```typescript
const resp = await client.transaction.create(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  {
    type: 'oneTime',
    drawId: 'LN-2BQP-ZXYJ',
    externalId: 'b3fe35d6-e4a2-4048-b7ba-3120d46ddd15',
    isExternal: true,
    status: 'succeeded',
    amount: 520.50
  }
)
```

where the arguments are the Borrower Id, and Loan Id - and can be the Peach
Ids or external Ids, if they have been assigned. The next argument is the
data to create the Transaction. The response will be something like:

```javascript
{
  success: true,
  transaction: {
    achConfirmed: false,
    achProcessedSameDay: false,
    achReturnCode: null,
    achSameDay: false,
    actualAmount: 110,
    autopayPaymentIds: null,
    autopayPlanId: null,
    avsResult: null,
    cancelLongDescription: null,
    cancelReason: null,
    cancelShortDescription: null,
    chargebackDetails: { amount: 0, chargebacks: [] },
    companyId: 'CP-GDB3-G1JO',
    createdBy: { id: 'UR-2KVR-1RDB', name: 'peachapi@lenderco.com' },
    drawId: null,
    enablePrepayments: false,
    externalId: 'bf9d84bd-00fa-4e15-bfd5-6fef33cc1a9e',
    failureDescriptionLong: null,
    failureDescriptionShort: null,
    failureReason: null,
    id: 'TX-LBM8-X3VB',
    isExternal: true,
    isVirtual: false,
    loanId: 'LN-MJ1E-PYPK',
    mainBorrowerId: 'BO-9BR3-GW8J',
    object: 'transaction',
    paidFeesAmount: 0,
    paidInterestAmount: 0,
    paidOverAmount: 0,
    paidPrincipalAmount: 0,
    parentTransactionId: null,
    paymentDetails: {
      fromInstrument: [Object],
      fromInstrumentId: 'PT-DB34-W9KO',
      reason: 'oneTimePayment',
      toInstrument: [Object],
      toInstrumentId: 'PT-VPBO-QXJ2',
      type: 'ach'
    },
    processingFeeAmount: null,
    processingFeeType: null,
    processorFailureDetails: null,
    processorFailureReason: null,
    processorMerchantId: null,
    processorReconciliationId: null,
    processorReversalId: null,
    processorTransactionId: null,
    retryAttempt: null,
    retryOriginalTransactionId: null,
    reversedByTransactionExternalId: null,
    reversedByTransactionId: null,
    reversedTransactionId: null,
    reversedTransactionStatus: null,
    reversingTransactionStatus: null,
    scheduledAmount: 110,
    serviceCreditDetails: { reason: 'oneTimePayment', sponsor: null, type: null },
    status: 'pending',
    timestamps: {
      appliedAt: null,
      canceledAt: null,
      chargebackAt: null,
      createdAt: '2022-04-15T21:18:45.140425+00:00',
      deletedAt: null,
      displayDate: '2022-04-15',
      effectiveDate: '2022-04-15',
      failedAt: null,
      inDisputeAt: null,
      initiatedAt: null,
      originalEffectiveDate: '2022-04-15',
      pendingAt: null,
      scheduledDate: '2022-04-15',
      succeededAt: null,
      updatedAt: null
    },
    transactionType: 'payment'
  }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Transactions](https://sandboxdocs.peach.finance/#operation/peach.transactions.handlers.loan_transactions_get_all)

The call to get Transactions on a Loan, for a Borrower, looks something
like this:

```typescript
const resp = await client.transaction.get(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  {
    isExternal: true,
    status: 'succeeded'
  }
)
```

where the arguments are the Borrower Id, and Loan Id - and can be the Peach
Ids or external Ids, if they have been assigned. The next argument is the
data to filter the Transactions on for that Loan. The response will be
something like:

```javascript
{
  success: true,
  transactions: [
    { ... }
  ]
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Transaction by Id](https://sandboxdocs.peach.finance/#operation/peach.transactions.handlers.transactions_get_by_id)

The call to get a specific Transaction on a Loan, for a Borrower, looks
something like this:

```typescript
const resp = await client.transaction.byId(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'YY-XXXX-XXXX'
)
```

where the arguments are the Borrower Id, Loan Id, and Transaction Id - and
can be the Peach Ids or external Ids, if they have been assigned. The
response will be something like:

```javascript
{
  success: true,
  transaction: {
    achConfirmed: false,
    achProcessedSameDay: false,
    achReturnCode: null,
    achSameDay: false,
    actualAmount: 110,
    autopayPaymentIds: null,
    autopayPlanId: null,
    avsResult: null,
    cancelLongDescription: null,
    cancelReason: null,
    cancelShortDescription: null,
    chargebackDetails: { amount: 0, chargebacks: [] },
    companyId: 'CP-GDB3-G1JO',
    createdBy: { id: 'UR-2KVR-1RDB', name: 'peachapi@lenderco.com' },
    drawId: null,
    enablePrepayments: false,
    externalId: 'bf9d84bd-00fa-4e15-bfd5-6fef33cc1a9e',
    failureDescriptionLong: null,
    failureDescriptionShort: null,
    failureReason: null,
    id: 'TX-LBM8-X3VB',
    isExternal: true,
    isVirtual: false,
    loanId: 'LN-MJ1E-PYPK',
    mainBorrowerId: 'BO-9BR3-GW8J',
    object: 'transaction',
    paidFeesAmount: 0.25,
    paidInterestAmount: 0,
    paidOverAmount: 0,
    paidPrincipalAmount: 109.75,
    parentTransactionId: null,
    paymentDetails: {
      fromInstrument: [Object],
      fromInstrumentId: 'PT-DB34-W9KO',
      reason: 'oneTimePayment',
      toInstrument: [Object],
      toInstrumentId: 'PT-VPBO-QXJ2',
      type: 'ach'
    },
    processingFeeAmount: null,
    processingFeeType: null,
    processorFailureDetails: null,
    processorFailureReason: null,
    processorMerchantId: null,
    processorReconciliationId: null,
    processorReversalId: null,
    processorTransactionId: null,
    retryAttempt: null,
    retryOriginalTransactionId: null,
    reversedByTransactionExternalId: null,
    reversedByTransactionId: null,
    reversedTransactionId: null,
    reversedTransactionStatus: null,
    reversingTransactionStatus: null,
    scheduledAmount: 110,
    serviceCreditDetails: { reason: 'oneTimePayment', sponsor: null, type: null },
    status: 'pending',
    timestamps: {
      appliedAt: '2022-04-15T21:18:45.176183+00:00',
      canceledAt: null,
      chargebackAt: null,
      createdAt: '2022-04-15T21:18:45.140425+00:00',
      deletedAt: null,
      displayDate: '2022-04-15',
      effectiveDate: '2022-04-15',
      failedAt: null,
      inDisputeAt: null,
      initiatedAt: null,
      originalEffectiveDate: '2022-04-15',
      pendingAt: null,
      scheduledDate: '2022-04-15',
      succeededAt: null,
      updatedAt: '2022-04-15T21:18:46.946081+00:00'
    },
    transactionType: 'payment'
  }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Update Transaction](https://sandboxdocs.peach.finance/#operation/peach.transactions.handlers.transactions_update)

The call to update the allowable values on a Transaction looks something
like this:

```typescript
const resp = await client.transaction.update(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'YY-XXXX-XXXX',
  {
    actualAmount: 75.52,
    status: 'succeeded'
  }
)
```

where the arguments are the Borrower Id, Loan Id, and Transaction Id - and
can be the Peach Ids or external Ids, if they have been assigned. The fourth
argument is the data elements to update on this Transaction, and are listed
in detail in the Peach docs. The response will be something like:

```javascript
{
  success: true,
  transaction: {
    achConfirmed: false,
    achProcessedSameDay: false,
    achReturnCode: null,
    achSameDay: false,
    actualAmount: 110,
    autopayPaymentIds: null,
    autopayPlanId: null,
    avsResult: null,
    cancelLongDescription: null,
    cancelReason: null,
    cancelShortDescription: null,
    chargebackDetails: { amount: 0, chargebacks: [] },
    companyId: 'CP-GDB3-G1JO',
    createdBy: { id: 'UR-2KVR-1RDB', name: 'peachapi@lenderco.com' },
    drawId: null,
    enablePrepayments: false,
    externalId: 'a76a2b94-6ed6-46e7-bb1f-a748675754f5',
    failureDescriptionLong: null,
    failureDescriptionShort: null,
    failureReason: null,
    id: 'TX-QBW5-ML4J',
    isExternal: true,
    isVirtual: false,
    loanId: 'LN-9BN9-X3NB',
    mainBorrowerId: 'BO-9BR3-GW8J',
    object: 'transaction',
    paidFeesAmount: 0.25,
    paidInterestAmount: 0,
    paidOverAmount: 0,
    paidPrincipalAmount: 109.75,
    parentTransactionId: null,
    paymentDetails: {
      fromInstrument: [Object],
      fromInstrumentId: 'PT-MJ14-YRJP',
      reason: 'oneTimePayment',
      toInstrument: [Object],
      toInstrumentId: 'PT-VPBO-QXJ2',
      type: 'ach'
    },
    processingFeeAmount: null,
    processingFeeType: null,
    processorFailureDetails: null,
    processorFailureReason: null,
    processorMerchantId: null,
    processorReconciliationId: null,
    processorReversalId: null,
    processorTransactionId: null,
    retryAttempt: null,
    retryOriginalTransactionId: null,
    reversedByTransactionExternalId: null,
    reversedByTransactionId: null,
    reversedTransactionId: null,
    reversedTransactionStatus: null,
    reversingTransactionStatus: null,
    scheduledAmount: 110,
    serviceCreditDetails: { reason: 'oneTimePayment', sponsor: null, type: null },
    status: 'succeeded',
    timestamps: {
      appliedAt: '2022-04-15T21:23:08.112442+00:00',
      canceledAt: null,
      chargebackAt: null,
      createdAt: '2022-04-15T21:23:08.076006+00:00',
      deletedAt: null,
      displayDate: '2022-04-15',
      effectiveDate: '2022-04-15',
      failedAt: null,
      inDisputeAt: null,
      initiatedAt: null,
      originalEffectiveDate: '2022-04-15',
      pendingAt: null,
      scheduledDate: '2022-04-15',
      succeededAt: '2022-04-15T21:23:11.240944+00:00',
      updatedAt: '2022-04-15T21:23:11.242488+00:00'
    },
    transactionType: 'payment'
  }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Cancel Transaction](https://sandboxdocs.peach.finance/#operation/peach.transactions.handlers.transaction_cancel)

The call to cancel a Transaction, on a Loan, for a Borrower, looks
something like this:

```typescript
const resp = await client.transaction.cancel(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'YY-XXXX-XXXX',
)
```

where the arguments are the Borrower Id, Loan Id, and Transaction Id - and
can be the Peach Ids or external Ids, if they have been assigned. The
response will be a simple `success` boolean:

```javascript
{
  success: true,
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Reverse Transaction](https://sandboxdocs.peach.finance/#operation/peach.transactions.handlers.transaction_reverse)

The call to reverse a Transaction on a Loan, for a Borrower, looks
something like this:

```typescript
const resp = await client.transaction.reverse(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'YY-XXXX-XXXX',
  {
    sync: true,
  }
)
```

where the arguments are the Borrower Id, Loan Id, and Transaction Id - and
can be the Peach Ids or external Ids, if they have been assigned. The fourth
argument are the options on the call, as detailed on the Peach docs. The
response look something like this:

```javascript
{
  success: true,
  transaction: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Backdate Transaction](https://sandboxdocs.peach.finance/#operation/peach.transactions.handlers.transaction_backdate)

From the Peach docs:

> Backdate a transaction. Can only be applied to transactions with
> `status=succeeded`. Can be applied to payments or service credits.

The call to back-date a Transaction, on a Loan, for a Borrower, looks
something like this:

```typescript
const resp = await client.transaction.backdate(
  'BO-9BR3-GW8J',
  'LN-5K97-XPVJ',
  'YY-XXXX-XXXX',
  {
    effectiveDate: '2022-02-14',
    sync: true,
  }
)
```

where the arguments are the Borrower Id, Loan Id, and Transaction Id - and
can be the Peach Ids or external Ids, if they have been assigned. The fourth
argument are the options on the call, as detailed on the Peach docs. The
response look something like this:

```javascript
{
  success: true,
  transaction: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

### Payment Instrument Calls

As stated in the Peach
[documentation](https://sandboxdocs.peach.finance/#tag/Payment-Instruments):

> This object represents a bank account, credit card, debit card or
> check belonging to a borrower.

#### [Create Payment Instrument](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.person_payment_instrument_create)

From the Peach docs:

> When creating a payment instrument using the Plaid Account option, two
> flows are supported:
>
> 1) Pass only `accessToken` and `accountIds`. This will create a payment
> instrument with `status`=`inactive`. You can then use Update payment
> instrument endpoint to set the `accountHolderType`, and `accountHolderName`
> fields, and set the `status` to `active`.
>
> 2) Pass the required fields as well as `accountHolderType`, and
> `accountHolderName`. This will create a payment instrument with
> `status`=`active`. The payment instrument will then be ready to use.
>
> _Note: This endpoint returns an array containing a single payment
> instrument to allow future support for Plaid multi-account select._

 looks
something like this:

```typescript
const resp = await client.paymentInstrument.create('BO-9BR3-GW8J', {
  isExternal: true,
  externalId: 'ae7e6c94-4b82-4128-aa01-839e99db26b6',
  status: 'pending',
  verified: false,
  nickname: 'Business Bank Account',
  instrumentType: 'bankAccount',
  accountNumber: '2323',
  routingNumber: '021313103',
  accountType: 'checking',
  accountHolderType: 'business',
  accountHolderName: "Chips Cookies"
}, { readAfterWrite: true })
```
where the arguments are the Borrower Id, which can be the Peach Id or the
external Id, if it's set, and then the data for the creation of the Payment
Instrument. The response looks something like this:

```javascript
{
  success: true,
  instrument: {
    accountHolderName: 'ABC Roofing',
    accountHolderType: 'business',
    accountLink: null,
    accountNumber: 'c9csfpr3gbo5vtdkgig0',
    accountNumberLastFour: '5764',
    accountType: 'checking',
    activeAt: null,
    createdAt: '2022-04-15T19:30:47.915787+00:00',
    deletedAt: null,
    externalId: '2d9107be-a835-4903-a7bf-66754418882c',
    failureDescriptionLong: null,
    failureDescriptionShort: null,
    failureReason: null,
    id: 'PT-OB54-EGJ2',
    inactiveAt: null,
    inactiveReason: null,
    institutionName: 'CITIZENS BANK NA',
    instrumentType: 'bankAccount',
    isExternal: true,
    nickname: 'Business Bank Account',
    object: 'bankAccount',
    pendingAt: '2022-04-15T19:30:47.695857+00:00',
    routingNumber: '021313103',
    status: 'pending',
    updatedAt: '2022-04-15T19:30:47.926267+00:00',
    verified: false
  }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Payment Instruments](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.person_payment_instrument_get_all)

The call to get Payment Instruments for a Borrower looks something like this:

```typescript
const resp = await client.paymentInstrument.get('BO-9BR3-GW8J')
```

where the argument is the Borrower Id, and can be the Peach Id, or the
external Id, if it's been assigned. The response look something like this:

```javascript
{
  success: true,
  instruments: {
    count: 2,
    data: [
      {
        accountHolderName: 'Chips Cookies',
        accountHolderType: 'business',
        accountLink: null,
        accountNumber: 'c9crk7r3gbo5vtdkgi10',
        accountNumberLastFour: '2323',
        accountType: 'checking',
        activeAt: '2022-04-15T18:31:59.466310+00:00',
        createdAt: '2022-04-15T18:31:59.682501+00:00',
        deletedAt: null,
        externalId: 'bf4f8aa4-8d7c-479b-93ec-f861f849e28f',
        failureDescriptionLong: null,
        failureDescriptionShort: null,
        failureReason: null,
        id: 'PT-2K6V-GEB4',
        inactiveAt: null,
        inactiveReason: null,
        institutionName: 'CITIZENS BANK NA',
        instrumentType: 'bankAccount',
        isExternal: true,
        nickname: 'Business Bank Account',
        object: 'bankAccount',
        pendingAt: null,
        routingNumber: '021313103',
        status: 'active',
        updatedAt: '2022-04-15T18:31:59.702893+00:00',
        verified: false
      },
      { ... }
    ]
  }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Payment Instrument by Id](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.person_payment_instrument_get)

The call to get Payment Instruments for a Borrower looks something like this:

```typescript
const resp = await client.paymentInstrument.byId('BO-9BR3-GW8J', 'ext-123456')
```

where the arguments are the Borrower Id, which can be the Peach Id, or the
external Id, if it's assigned, and the Payment Instrument Id, which can also
be either the Peach Id, or a properly assigned external Id. The
response look something like this:

```javascript
{
  success: true,
  instrument: {
    accountHolderName: 'ABC Roofing',
    accountHolderType: 'business',
    accountLink: null,
    accountNumber: 'c9csmt0jp49pfunuv460',
    accountNumberLastFour: '4307',
    accountType: 'checking',
    activeAt: null,
    createdAt: '2022-04-15T19:45:56.564487+00:00',
    deletedAt: null,
    externalId: '1e26aef8-9e24-463a-9b31-c6ba0301192f',
    failureDescriptionLong: null,
    failureDescriptionShort: null,
    failureReason: null,
    id: 'PT-WBL3-V3JP',
    inactiveAt: null,
    inactiveReason: null,
    institutionName: 'CITIZENS BANK NA',
    instrumentType: 'bankAccount',
    isExternal: true,
    nickname: 'Business Bank Account',
    object: 'bankAccount',
    pendingAt: '2022-04-15T19:45:56.369423+00:00',
    routingNumber: '021313103',
    status: 'pending',
    updatedAt: '2022-04-15T19:45:56.576805+00:00',
    verified: false
  }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Update Payment Instrument](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.person_payment_instrument_update)

The function to update a Payment Instrument, looks something like this:

```typescript
const resp = await client.paymentInstrument.update(
  'BO-9BR3-GW8J',
  'ext-123456',
  {
    nickname: 'Materials Account',
  },
)

```

where the arguments are the Borrower Id, and Payment Instrument Id, both
can be either Peach Ids, or properly set external Ids. The
response look something like this:

```javascript
{
  success: true,
  instrument: {
    accountHolderName: 'ABC Roofing',
    accountHolderType: 'business',
    accountLink: null,
    accountNumber: 'c9csmt0jp49pfunuv460',
    accountNumberLastFour: '4307',
    accountType: 'checking',
    activeAt: null,
    createdAt: '2022-04-15T19:45:56.564487+00:00',
    deletedAt: null,
    externalId: '1e26aef8-9e24-463a-9b31-c6ba0301192f',
    failureDescriptionLong: null,
    failureDescriptionShort: null,
    failureReason: null,
    id: 'PT-WBL3-V3JP',
    inactiveAt: null,
    inactiveReason: null,
    institutionName: 'CITIZENS BANK NA',
    instrumentType: 'bankAccount',
    isExternal: true,
    nickname: 'Business Bank Account',
    object: 'bankAccount',
    pendingAt: '2022-04-15T19:45:56.369423+00:00',
    routingNumber: '021313103',
    status: 'pending',
    updatedAt: '2022-04-15T19:45:56.576805+00:00',
    verified: false
  }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Delete Payment Instrument](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.person_payment_instrument_delete)

The call to delete the Payment Instrument for a Borrower, looks
something like this:

```typescript
const resp = await client.paymentInstrument.delete('BO-9BR3-GW8J', 'ext-123456')
```

where the arguments are the Borrower Id, and Payment Instrument Id, both
can be either Peach Ids, or properly set external Ids. The
response look something like this:

```javascript
{
  success: true,
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Verify Amounts of Microdeposits](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.person_payment_instrument_verify)

The call to verify the microdeposits used to correctly identify the account
associated with a Payment Instrument, looks something like this:

```typescript
const resp = await client.paymentInstrument.verify(
  'BO-9BR3-GW8J',
  'ext-123456',
  25,
  32,
)
```

where the arguments are the Borrower Id, and Payment Instrument Id, both
can be either Peach Ids, or properly set external Ids, as well as the
value of the two microdeposits. The response looks something like this:

```javascript
{
  success: true,
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Create Account Link](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.account_link_post)

From the Peach docs:

> Add a data vendor link for this payment instrument. If one is already
> present, it is replaced.

The call to create the account link for the Payment Instrument, looks
something like this:

```typescript
const resp = await client.paymentInstrument.createLink(
  'BO-9BR3-GW8J',
  'ext-123456',
  {
    vendor: 'plaid',
    accessToken: '123abc',
    itemId: '12g34df',
    accountId: '1122abc',
  },
)
```

where the arguments are the Borrower Id, and Payment Instrument Id, both
can be either Peach Ids, or properly set external Ids, as well as the
data surrounding the Plaid Link exchange.
The response look something like this:

```javascript
{
  success: true,
  data: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Update Account Link](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.account_link_put)

From the Peach docs:

> Update record keeping details about the account link. This can not be
> used to set up a new account link.

The call to update the account link for the Payment Instrument, looks
something like this:

```typescript
const resp = await client.paymentInstrument.updateLink(
  'BO-9BR3-GW8J',
  'ext-123456',
)
```

where the arguments are the Borrower Id, and Payment Instrument Id, both
can be either Peach Ids, or properly set external Ids. The
response look something like this:

```javascript
{
  success: true,
  data: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Delete Account Link](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.account_link_delete)

From the Peach docs:

> Retrieve the data vendor link details for this payment instrument.

The call to delete, or drop, an account link for a Payment Instrument, looks
something like this:

```typescript
const resp = await client.paymentInstrument.deleteLink(
  'BO-9BR3-GW8J',
  'ext-123456',
)
```

where the arguments are the Borrower Id, and Payment Instrument Id, both
can be either Peach Ids, or properly set external Ids. The
response look something like this:

```javascript
{
  success: true,
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Refresh Balance Data](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.balances_post)

From the Peach docs:

> Fetch updated balance data from the account link associated with this
> payment instrument.

The call to refresh the balance data for the account link associated with
this Payment Instrument, looks something like this:

```typescript
const resp = await client.paymentInstrument.refreshBalance(
  'BO-9BR3-GW8J',
  'ext-123456',
)
```

where the arguments are the Borrower Id, and Payment Instrument Id, both
can be either Peach Ids, or properly set external Ids. The
response look something like this:

```javascript
{
  success: true,
  balance: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

#### [Get Balance Data](https://sandboxdocs.peach.finance/#operation/peach.payment_instruments.handlers.balances_get)

From the Peach docs:

> Get stored balance data for the account associated with the payment
> instrument.

The call to get the balance of the linked account, looks
something like this:

```typescript
const resp = await client.paymentInstrument.refreshBalance(
  'BO-9BR3-GW8J',
  'ext-123456',
)
```

where the arguments are the Borrower Id, and Payment Instrument Id, both
can be either Peach Ids, or properly set external Ids. The
response look something like this:

```javascript
{
  success: true,
  balance: { ... }
}
```

**Note:** We haven't example data on this return value in this client
due to insufficient testing.

## Development

For those interested in working on the library, there are a few things that
will make that job a little simpler. The organization of the code is all in
`src/`, with one module per _section_ of the Client: `borrower`, `identity`,
etc. This makes location of the function very easy.

Additionally, the main communication with the Peach service is in the
`src/index.ts` module in the `fire()` function. In the constructor for the
Client, each of the _sections_ are created, and then they link back to the
main class for their communication work.

### Setup

In order to work with the code, the development dependencies include `dotenv`
so that each user can create a `.env` file with a single value for working
with Peach:

* `PEACH_API_KEY` - this is the API Key as provided by Peach to your team.
  It's meant to be secret, so try not to share, but the Peach production
  security also includes Certificates, so it's more than just a key.
* `PEACH_HOST` - this is the specific host where calls should be sent, and
  will default to the Peach production host, but can also be set to be the
  `sandbox` instance for testing. This will need to include the `/api` on
  the end - in keeping with the documents sent by Peach to get started.

### Testing

There are several test scripts that test, and validate, information on the
Peach service exercising different parts of the API. Each is
self-contained, and can be run with:

```bash
$ npm run ts tests/borrowers.ts

> peach-node-client@0.1.0 ts
> ts-node -r dotenv/config "tests/borrower.ts"

getting list of Borrowers...
Success! Found 2 Borrowers, out of a total of 2.
searching for Borrowers by fuzzy firstName ...
Success! Found 1 Borrowers.
searching for Borrowers by fuzzy lastName ...
Success! Found 1 Borrowers.
getting Borrower by Id...
Success!
updating Borrower... adding externalId...
Success!
getting updated Borrower by Id...
Success!
Success! The update to the Borrower for externalId worked!
getting updated Borrower by externalId...
Success!
updating Borrower... resetting externalId...
Success!
looking for Borrower: "Acme Steel"...
The Borrower already exists - this test had to have worked.
```

Each of the tests will run a series of calls through the Client, and check the
results to see that the operation succeeded. As shown, if the steps all
report back with `Success!` then things are working.

If there is an issue with one of the calls, then an `Error!` will be printed
out, and the data returned from the client will be dumped to the console.
