import type { Peach, PeachOptions, PeachError, PeachSearch } from './'
import type { Identity } from './identity'

export interface BorrowerName {
  object?: string;
  prefix?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  maidenLastName?: string;
  suffix?: string;
  preferredFirstName?: string;
  current: boolean;
}

export interface CommPreferences {
  statementDeliveryChannels: string[];
  sendRemindersWhenCurrent: boolean;
}

export interface Borrower {
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  borrowerType: string;
  externalId?: string;
  status: string;
  statusUpdatedAt: string;
  collectionsIntensity: string;
  displayId: string;
  metadata: any;
  commPreferences: CommPreferences;
  object: string;
  name: BorrowerName;
  dateOfBirth?: string;
  identities: Identity[];
}

export interface BorrowerBusiness {
  businessType: string;
  businessName: string;
  businessLegalName: string;
  incorporatedCountry?: string;
  incorporatedState?: string;
}

export interface BorrowerList {
  total?: bigint;
  count?: bigint;
  nextUrl?: string;
  previousUrl?: string;
  data: Borrower[];
  search?: PeachSearch;
}

export class BorrowerApi {
  client: Peach;

  constructor(client: Peach, _options?: PeachOptions) {
    this.client = client
  }

  /*
   * Function to take a series of searchable fields, most of which are optional,
   * as input, and pass them to Peach, and have them return a *paged* list
   * of Borrowers that fit the criteria. If no argument is given, this returns
   * a list of *all* the Borrowers in the system.
   */
  async get(search: {
    status?: string,
    limit?: number,
    sortBy?: string[],
    startingAfter?: string,
    endingBefore?: string,
    borrowerType?: string,
    ids?: string[],
  } = {}): Promise<{
    success: boolean,
    borrowers?: BorrowerList,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      'people',
      { ...search }
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return { success: true, borrowers: { total: BigInt(0), count: BigInt(0), data: [] } }
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
    return { success, borrowers: resp.payload }
  }

  /*
   * Function to take a series of search criteria, most of which are optional,
   * as input, and pass them to Peach, and have them return a *paged* list
   * of Borrowers that fit the criteria. Some of these terms are fuzzy searches,
   * and others are exact searchs - like enums. It's best to consult the
   * Peach API docs to see what to use in these cases. If no arguments are
   * given, nothing will match, so nothing will be returned.
   */
  async search(search: {
    _hasTheWords?: string,
    _notTheWords?: string,
    address?: string,
    bankruptcyCourtCase?: string,
    borrowerType?: string,
    businessName?: string,
    caseId?: string,
    city?: string,
    dateOfBirth?: string,
    email?: string,
    emailExact?: string,
    employeeEmail?: string,
    employeeEmailExact?: string,
    employeePhone?: string,
    employeeName?: string,
    firstName?: string,
    fullName?: string,
    incorporatedState?: string,
    id?: string,
    lastName?: string,
    legalRepFirstName?: string,
    legalRepLastName?: string,
    legalRepEmail?: string,
    legalRepPhone?: string,
    loanId?: string,
    maidenName?: string,
    middleName?: string,
    paymentMethod?: string,
    phone?: string,
    postalCode?: string,
    state?: string,
    taxId?: string,
    _forceIndex?: string,
  } = {}): Promise<{
    success: boolean,
    borrowers?: BorrowerList,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      'people/search',
      { ...search }
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return { success: true, borrowers: { total: BigInt(0), count: BigInt(0), data: [] } }
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
    return { success, borrowers: resp.payload }
  }

  /*
   * Function to take a Peach Borrower Id - either Peach's own id
   * (BO-XXXX-XXXX), or an external id (ext-XXX), and some options, and get
   * the Borrower for that Id.
   */
  async byId(borrowerId: string, options?: {
    includeIdentity?: boolean,
  }): Promise<{
    success: boolean,
    borrower?: Borrower,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}`,
      options
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
    return { success, borrower: resp.payload?.data }
  }

  /*
   * Function to take a borrowerId, either the Peach Id (BO-XXXX-XXXX), or an
   * external id (ext-XXXX), and then some Borrower attributes, and update
   * the Borrower with that Id with these values. The return value will be
   * the updated Borrower.
   */
  async update(borrowerId: string, data: {
    borrowerType?: string,
    externalId?: string | null,
    status?: string
    collectionsIntensity?: string,
    metaData?: any,
    commPreferences?: CommPreferences,
    businessDetails?: BorrowerBusiness,
    name?: BorrowerName,
    dateOfBirth?: string,
    caseId?: string,
  } = {}): Promise<{
    success: boolean,
    borrower?: Borrower,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'PUT',
      `people/${borrowerId}`,
      undefined,
      { ...data },
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
    return { success, borrower: resp.payload?.data }
  }

  /*
   * Function to take the attributes of a new Borrower, and create that.
   * This can include the primary Identity of the Borrower so that you
   * don't have to create that in a separate step later.
   */
  async create(data: {
    borrowerType?: string,
    externalId?: string | null,
    status?: string
    collectionsIntensity?: string,
    metaData?: any,
    commPreferences?: CommPreferences,
    businessDetails?: BorrowerBusiness,
    name?: BorrowerName,
    dateOfBirth?: string,
    identity?: Partial<Identity>,
  }): Promise<{
    success: boolean,
    borrower?: Borrower,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      'people',
      undefined,
      { ...data },
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
    return { success, borrower: resp.payload?.data }
  }
}
