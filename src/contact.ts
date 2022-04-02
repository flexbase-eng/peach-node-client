import type { Peach, PeachOptions, PeachError } from './'

export interface Contact {
  object: string;
  id: string;
  externalId?: string;
  contactType: string;
  label?: string;
  affiliation?: string;
  name?: string;
  value?: string;
  address?: ContactAddress;
  companyId?: string;
  personId?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  status?: string;
  valid?: boolean;
  verified?: boolean;
  receiveTextMessages?: boolean;
  receiveTextMessagesLastConsentAt?: string;
  authorizedThirdParty?: boolean;
  powerOfAttorney?: boolean;
  phoneDisconnectionDetails?: ContactPhoneDisconnectDetails;
}

export interface ContactAddress {
  object: string;
  id: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  countyOrRegion?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  poBox?: string;
}

export interface ContactPhoneDisconnectDetails {
  lastKnownConnectionDate?: string;
  lastDisconnectCheckDate?: string;
  disconnectionStatus?: string;
}

export interface ContactList {
  count?: bigint;
  nextUrl?: string;
  previousUrl?: string;
  data: Contact[];
}

import { isEmpty } from './'

export class ContactApi {
  client: Peach;

  constructor(client: Peach, _options?: PeachOptions) {
    this.client = client
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and return the Contacts for this Borrower
   * that match the provided optional criteria - or all of them if no filtering
   * options are provided.
   */
  async get(borrowerId: string, options: {
    limit?: number,
    startingAfter?: string,
    endingBefore?: string,
    sortBy?: string[],
    collidesWithEmail?: string,
    collidesWithPhone?: string,
    contactType?: string,
    affiliation?: string,
    label?: string,
    status?: string,
    includeArchived?: boolean,
    includeLegal?: boolean,
    receiveTextMessages?: boolean,
  } = {}): Promise<{
    success: boolean,
    contacts?: ContactList,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/contacts`,
      options,
    )
    if (resp?.response?.status >= 400) {
      return {
        success: false,
        error: {
          type: 'peach',
          error: resp?.payload?.message,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, contacts: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and the Peach Contact Id, and return
   * the proper Contact for this Borrower.
   */
  async byId(borrowerId: string, contactId: string): Promise<{
    success: boolean,
    contact?: Contact,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/contacts/${contactId}`,
    )
    if (resp?.response?.status >= 400) {
      return {
        success: false,
        error: {
          type: 'peach',
          error: resp?.payload?.message,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, contact: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Contact Id, and the editable
   * fields for an Contact, and return the proper updated Contact for
   * this Borrower.
   *
   * The option 'readAfterWrite' allows for the verification step of doing
   * a read from Peach _after_ the update is successfully done, just to
   * make sure that the values are what you expected.
   */
  async update(borrowerId: string, contactId: string, data: {
    externalId?: string,
    contactType?: string,
    label?: string,
    affiliation?: string,
    name?: string,
    value?: string,
    address?: ContactAddress,
    valid?: boolean,
    verified?: boolean,
    receiveTextMessages?: boolean,
    authorizedThirdParty?: boolean,
    powerOfAttorney?: boolean,
    phoneDisconnectDetails?: ContactPhoneDisconnectDetails,
  }, options: {
    readAfterWrite?: boolean,
    confirmationCode?: string,
    validate?: boolean,
  } = {}): Promise<{
    success: boolean,
    contact?: Contact,
    error?: PeachError,
  }> {
    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.confirmationCode)) {
      query.confirmationCode = options.confirmationCode
    }
    if (!isEmpty(options.validate)) {
      query.validate = options.validate
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query

    // ...now we can make the call
    const resp = await this.client.fire(
      'PUT',
      `people/${borrowerId}/contacts/${contactId}`,
      query,
      data,
    )
    if (resp?.response?.status >= 400) {
      return {
        success: false,
        error: {
          type: 'peach',
          error: resp?.payload?.message,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    // see if the user wants a read-after-write check
    if (options.readAfterWrite) {
      // we have to refetch it to see any PII data... odd but true.
      return (await this.byId(borrowerId, contactId))
    }
    // ...no need, we return exactly what we have.
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, contact: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Contact Id, and archive the
   * Identity for this Borrower.
   */
  async archive(borrowerId: string, contactId: string): Promise<{
    success: boolean,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'DELETE',
      `people/${borrowerId}/contacts/${contactId}`,
    )
    if (resp?.response?.status >= 400) {
      return {
        success: false,
        error: {
          type: 'peach',
          error: resp?.payload?.message,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and the attributes of a new Contact,
   * and create that Contact, and assign it to the indicated Borrower.
   *
   * The option 'readAfterWrite' allows for the verification step of doing
   * a read from Peach _after_ the creation is successfully done, just to
   * make sure that the values are what you expected.
   */
  async create(borrowerId: string, data: {
    externalId?: string,
    contactType?: string,
    label?: string,
    affiliation?: string,
    name?: string,
    value?: string,
    address?: ContactAddress,
    valid?: boolean,
    verified?: boolean,
    receiveTextMessages?: boolean,
    authorizedThirdParty?: boolean,
    powerOfAttorney?: boolean,
    phoneDisconnectDetails?: ContactPhoneDisconnectDetails,
    status?: string,
  }, options: {
    readAfterWrite?: boolean,
    confirmationCode?: string,
    validate?: boolean,
  } = {}): Promise<{
    success: boolean,
    contact?: Contact,
    error?: PeachError,
  }> {
    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.confirmationCode)) {
      query.confirmationCode = options.confirmationCode
    }
    if (!isEmpty(options.validate)) {
      query.validate = options.validate
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query

    // ...now we can make the call
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/contacts`,
      query,
      data,
    )
    if (resp?.response?.status >= 400) {
      return {
        success: false,
        error: {
          type: 'peach',
          error: resp?.payload?.message,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    // see if the user wants a read-after-write check
    if (options.readAfterWrite) {
      // we have to refetch it to see any PII data... odd but true.
      return (await this.byId(borrowerId, resp.payload?.data.id))
    }
    // ...no need, we return exactly what we have.
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, contact: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Contact Id, and the editable
   * fields for an Contact, and return the proper updated Contact for
   * this Borrower.
   *
   * The option 'readAfterWrite' allows for the verification step of doing
   * a read from Peach _after_ the update is successfully done, just to
   * make sure that the values are what you expected.
   */
  async clone(borrowerId: string, contactId: string, data: {
    externalId?: string,
    contactType?: string,
    label?: string,
    affiliation?: string,
    name?: string,
    value?: string,
    address?: ContactAddress,
    valid?: boolean,
    verified?: boolean,
    receiveTextMessages?: boolean,
    authorizedThirdParty?: boolean,
    powerOfAttorney?: boolean,
    status?: string,
  }, options: {
    readAfterWrite?: boolean,
    confirmationCode?: string,
    validate?: boolean,
  } = {}): Promise<{
    success: boolean,
    contact?: Contact,
    error?: PeachError,
  }> {
    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.confirmationCode)) {
      query.confirmationCode = options.confirmationCode
    }
    if (!isEmpty(options.validate)) {
      query.validate = options.validate
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query

    // ...now we can make the call
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/contacts/${contactId}/clone`,
      query,
      data,
    )
    if (resp?.response?.status >= 400) {
      return {
        success: false,
        error: {
          type: 'peach',
          error: resp?.payload?.message,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    // see if the user wants a read-after-write check
    if (options.readAfterWrite) {
      // we have to refetch it to see any PII data... odd but true.
      return (await this.byId(borrowerId, contactId))
    }
    // ...no need, we return exactly what we have.
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, contact: resp.payload?.data }
  }
}
