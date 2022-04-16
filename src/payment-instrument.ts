import type { Peach, PeachOptions, PeachError } from './'

export interface PaymentInstrument {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isExternal?: boolean;
  externalId?: string;
  activeAt?: string;
  inactiveAt?: string;
  pendingAt?: string;
  failureReason?: string;
  failureDescriptionShort?: string;
  failureDescriptionLong?: string;
  status?: string;
  inactiveReason?: string;
  verified?: boolean;
  nickname?: string;
  instrumentType: string;
  accountNumber: string;
  routingNumber: string;
  institutionName?: string;
  accountType: string;
  accountHolderType: string;
  accountHolderName: string;
  accountLink?: AccountLink;
}

export interface AccountLink {
  vendor: string;
  accessToken: string;
  itemId?: string;
  accountId: string;
  dataServices?: string[];
  status?: string;
  recentError?: RecentError;
  errorCommunicationsSent?: number;
  lastErrorCommunicationAt?: string;
}

export interface RecentError {
  errorType?: string;
  errorTypeByVendor?: string;
  errorCodeByVendor?: string;
  errorDescriptionInternal?: string;
  errorDescriptionBorrower?: string;
}

export interface PaymentInstrumentList {
  count?: bigint;
  nextUrl?: string;
  previousUrl?: string;
  data: PaymentInstrument[];
}

export interface LinkBalance {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  availableBalanceAmount?: number;
  currentBalanceAmount?: number;
  currency?: string;
  error?: RecentError;
  lastSuccessfulBalance?: {
    createdAt?: string;
    availableBalanceAmount?: number;
    currentBalanceAmount?: number;
    currency?: string;
  };
}

import { isEmpty } from './'

export class PaymentInstrumentApi {
  client: Peach;

  constructor(client: Peach, _options?: PeachOptions) {
    this.client = client
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and some optional search (filtering)
   * parameters for the Payment Instruments for that Borrower.
   */
  async get(
    borrowerId: string,
    search: {
      isExternal?: boolean,
    } = {},
  ): Promise<{
    success: boolean,
    instruments?: PaymentInstrumentList,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/payment-instruments`,
      { ...search }
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return { success: true, instruments: { count: BigInt(0), data: [] } }
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
    return { success, instruments: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and the Peach Payment Instrument Id and
   * returns that Paymnt Instrument for that Borrower.
   */
  async byId(
    borrowerId: string,
    paymentInstrumentId: string,
  ): Promise<{
    success: boolean,
    instrument?: PaymentInstrument,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/payment-instruments/${paymentInstrumentId}`,
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
    return { success, instrument: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Payment Instrument Id,
   * along with the updateable fields for the Instrument, and a few options
   * for the execution of the call, and returns the result.
   */
  async update(
    borrowerId: string,
    paymentInstrumentId: string,
    data: {
      status?: string,
      inactiveReason?: string,
      verified?: boolean,
      nickname?: string,
      accountType?: string,
      accountHolderType?: string,
      accountHolderName?: string,
      accountLink?: AccountLink,
    },
    options: {
      sync?: boolean,
      readAfterWrite?: boolean,
    } = {},
  ): Promise<{
    success: boolean,
    instrument?: PaymentInstrument,
    error?: PeachError
  }> {
    // check the arguments for validity
    if (data?.accountHolderName && data?.accountHolderName.match(/[^a-zA-Z0-9\s]/g)) {
      return {
        success: false,
        error: {
          type: 'peach',
          error: `The 'accountHolderName' contains an illegal character that will fail parsing checks at Peach. Please stick to a-z, 0-9, and a space. Value: "${data.accountHolderName}"`,
        },
      }
    }

    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.sync)) {
      query.sync = options.sync
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query

    // ...now we can make the call
    const resp = await this.client.fire(
      'PUT',
      `people/${borrowerId}/payment-instruments/${paymentInstrumentId}`,
      query,
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
    // for this, they will return an object, so just use it
    const instrument = resp.payload?.data || {}
    // see if the user wants a read-after-write check
    if (options.readAfterWrite && instrument.id) {
      // we have to refetch it to see any PII data... odd but true.
      return (await this.byId(borrowerId, instrument.id))
    }
    // ...no need, we return exactly what we have.
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, instrument: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Draw Id,
   * and the fields for the creation of a Purchase and assign it to the
   * Draw, for the Loan, for the Borrower.
   */
  async create(
    borrowerId: string,
    data: {
      isExternal?: boolean;
      externalId?: string;
      pendingAt?: string;
      status?: string;
      inactiveReason?: string;
      verified?: boolean;
      nickname?: string;
      instrumentType: string;
      accountNumber: string;
      routingNumber: string;
      accountType: string;
      accountHolderType: string;
      accountHolderName: string;
      accountLink?: AccountLink;
    },
    options: {
      force?: boolean,
      sync?: boolean,
      allowDuplicates?: boolean,
      readAfterWrite?: boolean,
    } = {},
  ): Promise<{
    success: boolean,
    instrument?: PaymentInstrument,
    error?: PeachError
  }> {
    // check the arguments for validity
    if (data.accountHolderName.match(/[^a-zA-Z0-9\s]/g)) {
      return {
        success: false,
        error: {
          type: 'peach',
          error: `The 'accountHolderName' contains an illegal character that will fail parsing checks at Peach. Please stick to a-z, 0-9, and a space. Value: "${data.accountHolderName}"`,
        },
      }
    }

    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.force)) {
      query.force = options.force
    }
    if (!isEmpty(options.sync)) {
      query.sync = options.sync
    }
    if (!isEmpty(options.allowDuplicates)) {
      query.allowDuplicates = options.allowDuplicates
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query

    // ...now we can make the call
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/payment-instruments`,
      query,
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
    // they will return an array, but only one element in it
    const [instrument] = resp.payload?.data || []
    // see if the user wants a read-after-write check
    if (options.readAfterWrite) {
      // we have to refetch it to see any PII data... odd but true.
      return (await this.byId(borrowerId, instrument.id))
    }
    // ...no need, we return exactly what we have.
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, instrument }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Payment Instrument Id,
   * and removes it from the system.
   */
  async delete(borrowerId: string, paymentInstrumentId: string): Promise<{
    success: boolean,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'DELETE',
      `people/${borrowerId}/payment-instruments/${paymentInstrumentId}`,
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
   * or an external id (ext-XXXX), the Peach Payment Instrument Id,
   * along with the two microdeposits to the account to verify that the
   * account is, in fact, the account associated with this Payment
   * Instrument.
   */
  async verify(
    borrowerId: string,
    paymentInstrumentId: string,
    deposit1: number,
    deposit2: number,
  ): Promise<{
    success: boolean,
    instrument?: PaymentInstrument,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/payment-instruments/${paymentInstrumentId}/verify`,
      undefined,
      { deposit1, deposit2 },
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
   * or an external id (ext-XXXX), the Peach Payment Instrument Id,
   * along with some data of the Plaid Link interaction, and it will
   * update the information in the system.
   */
  async createLink(
    borrowerId: string,
    paymentInstrumentId: string,
    data: {
      vendor: string,
      accessToken: string,
      itemId?: string,
      accountId: string,
      dataServices?: string[],
      status?: string,
      recentError?: RecentError,
    },
  ): Promise<{
    success: boolean,
    data?: {
      vendor: string,
      accessToken: string,
      itemId?: string,
      accountId: string,
      dataServices?: string[],
      status?: string,
      recentError?: RecentError,
      errorCommunicationsSent?: number,
      lastErrorCommunicationAt?: string,
    },
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/payment-instruments/${paymentInstrumentId}/account-link`,
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
    return { success, data: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Payment Instrument Id,
   * along with some information about that link updating, and will
   * call into the service to update that link.
   */
  async updateLink(
    borrowerId: string,
    paymentInstrumentId: string,
    data: {
      dataServices?: string[],
      lastErrorCommunicationAt?: string,
    } = {},
  ): Promise<{
    success: boolean,
    data?: {
      vendor: string,
      accessToken: string,
      itemId?: string,
      accountId: string,
      dataServices?: string[],
      status?: string,
      recentError?: RecentError,
      errorCommunicationsSent?: number,
      lastErrorCommunicationAt?: string,
    },
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'PUT',
      `people/${borrowerId}/payment-instruments/${paymentInstrumentId}/account-link`,
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
    return { success, data: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Payment Instrument Id,
   * and will delete that link for this Payment Instrument.
   */
  async deleteLink(
    borrowerId: string,
    paymentInstrumentId: string,
  ): Promise<{
    success: boolean,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'DELETE',
      `people/${borrowerId}/payment-instruments/${paymentInstrumentId}/account-link`,
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
   * or an external id (ext-XXXX), the Peach Payment Instrument Id,
   * and pull the current balance data from the account link at this
   * time.
   */
  async getBalance(
    borrowerId: string,
    paymentInstrumentId: string,
  ): Promise<{
    success: boolean,
    balance?: LinkBalance,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/payment-instruments/${paymentInstrumentId}/balance`,
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
    return { success, balance: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Payment Instrument Id,
   * and pull the current balance data from the account link at this
   * time. This should only be called once the initial balance data has
   * been pulled with `getBalance()`.
   */
  async refreshBalance(
    borrowerId: string,
    paymentInstrumentId: string,
  ): Promise<{
    success: boolean,
    balance?: LinkBalance,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/payment-instruments/${paymentInstrumentId}/balance`,
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
    return { success, balance: resp.payload?.data }
  }
}
