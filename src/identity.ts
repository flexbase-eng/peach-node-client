import type { Peach, PeachOptions, PeachError } from './'

export interface Identity {
  id: string;
  createdAt: string;
  deletedAt?: string;
  identityType: string;
  value: string;
  valid: boolean;
  issueDate: string;
  expirationDate?: string;
  issuingCountry?: string;
  isArchived?: boolean;
  isPrimary?: boolean;
}

export interface IdentityList {
  count?: bigint;
  nextUrl?: string;
  previousUrl?: string;
  data: Identity[];
}

export class IdentityApi {
  client: Peach;

  constructor(client: Peach, _options?: PeachOptions) {
    this.client = client
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and return the primary Identity
   * for this Borrower.
   */
  async primary(borrowerId: string): Promise<{
    success: boolean,
    identity?: Identity,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/identity`,
    )
    if (resp?.response?.status >= 400) {
      // build error message from all possible sources...
      let error = resp?.payload?.error || resp?.payload?.message
      if (resp.payload?.detail) {
        error = `${resp.payload.title}: ${resp.payload.detail}`
      }
      return {
        success: false,
        error: {
          type: 'peach',
          error,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, identity: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and return the primary Identity
   * for this Borrower.
   */
  async get(borrowerId: string, options?: {
    includeArchived?: boolean,
  }): Promise<{
    success: boolean,
    identities?: IdentityList,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/identities`,
      options,
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return { success: true, identities: { count: BigInt(0), data: [] } }
    }
    // ...now catch the other errors...
    if (resp?.response?.status >= 400) {
      // build error message from all possible sources...
      let error = resp?.payload?.error || resp?.payload?.message
      if (resp.payload?.detail) {
        error = `${resp.payload.title}: ${resp.payload.detail}`
      }
      return {
        success: false,
        error: {
          type: 'peach',
          error,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, identities: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and the Peach Identity Id, and return
   * the proper Identity for this Borrower.
   */
  async byId(borrowerId: string, identityId: string): Promise<{
    success: boolean,
    identity?: Identity,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/identities/${identityId}`,
    )
    if (resp?.response?.status >= 400) {
      // build error message from all possible sources...
      let error = resp?.payload?.error || resp?.payload?.message
      if (resp.payload?.detail) {
        error = `${resp.payload.title}: ${resp.payload.detail}`
      }
      return {
        success: false,
        error: {
          type: 'peach',
          error,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, identity: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Identity Id, and the editable
   * fields for an Identity, and return the proper updated Identity for
   * this Borrower.
   *
   * The option 'readAfterWrite' allows for the verification step of doing
   * a read from Peach _after_ the update is successfully done, just to
   * make sure that the values are what you expected.
   */
  async update(borrowerId: string, identityId: string, data: {
    identityType?: string,
    value?: string,
    valid?: boolean,
    issueDate?: string,
    expirationDate?: string,
    issuingCountry?: string,
    isArchived?: boolean,
    caseId?: string,
  }, options: {
    readAfterWrite?: boolean
  } = {}): Promise<{
    success: boolean,
    identity?: Identity,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'PUT',
      `people/${borrowerId}/identities/${identityId}`,
      undefined,
      data,
    )
    if (resp?.response?.status >= 400) {
      // build error message from all possible sources...
      let error = resp?.payload?.error || resp?.payload?.message
      if (resp.payload?.detail) {
        error = `${resp.payload.title}: ${resp.payload.detail}`
      }
      return {
        success: false,
        error: {
          type: 'peach',
          error,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    // see if the user wants a read-after-write check
    if (options.readAfterWrite) {
      // we have to refetch it to see any PII data... odd but true.
      return (await this.byId(borrowerId, identityId))
    }
    // ...no need, we return exactly what we have.
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, identity: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Identity Id, and archive the
   * Identity for this Borrower.
   */
  async archive(borrowerId: string, identityId: string, options?: {
    caseId?: string,
  }): Promise<{
    success: boolean,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'DELETE',
      `people/${borrowerId}/identities/${identityId}`,
      options,
    )
    if (resp?.response?.status >= 400) {
      // build error message from all possible sources...
      let error = resp?.payload?.error || resp?.payload?.message
      if (resp.payload?.detail) {
        error = `${resp.payload.title}: ${resp.payload.detail}`
      }
      return {
        success: false,
        error: {
          type: 'peach',
          error,
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
   * or an external id (ext-XXXX), and the attributes of a new Identity,
   * and create that Identity, and assign it to the indicated Borrower.
   *
   * The option 'readAfterWrite' allows for the verification step of doing
   * a read from Peach _after_ the creation is successfully done, just to
   * make sure that the values are what you expected.
   */
  async create(borrowerId: string, data: {
    identityType: string,
    value: string,
    valid?: boolean,
    issueDate?: string,
    expirationDate?: string,
    issuingCountry?: string,
    isArchived?: boolean,
    isPrimary?: boolean,
    caseId?: string,
  }, options: {
    readAfterWrite?: boolean
  } = {}): Promise<{
    success: boolean,
    identity?: Identity,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/identities`,
      undefined,
      data,
    )
    if (resp?.response?.status >= 400) {
      // build error message from all possible sources...
      let error = resp?.payload?.error || resp?.payload?.message
      if (resp.payload?.detail) {
        error = `${resp.payload.title}: ${resp.payload.detail}`
      }
      return {
        success: false,
        error: {
          type: 'peach',
          error,
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
    return { success, identity: resp.payload?.data }
  }
}
