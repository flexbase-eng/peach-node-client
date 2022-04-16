import type { Peach, PeachOptions, PeachError } from './'
import type {
  DeclineReason,
  LoanTimestamps,
  RatesValidation,
  AmountsValidation,
  LoanCurrent,
  LoanOrigination,
  LoanSchedule,
} from './loan'

export interface Draw {
  object?: string;
  id?: string;
  externalId?: string;
  displayId?: string;
  assetDisplayName?: string;
  declineReason?: DeclineReason;
  timestamps?: LoanTimestamps;
  endDate?: string;
  metaData?: any;
  nickname?: string;
  ratesValidation?: RatesValidation;
  status: string;
  isClosed?: boolean;
  current?: LoanCurrent;
  atOrigination?: LoanOrigination;
}

export interface DrawList {
  count?: bigint;
  nextUrl?: string;
  previousUrl?: string;
  data: Draw[];
}

import { isEmpty } from './'

export class DrawApi {
  client: Peach;

  constructor(client: Peach, _options?: PeachOptions) {
    this.client = client
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and some optional
   * search (filtering) parameters for the Draws for that Loan for that
   * Borrower.
   */
  async get(borrowerId: string, loanId: string, search: {
    statuses?: string[],
    isClosed?: boolean,
    isAmotrized?: boolean,
    startedBefore?: string,
    limit?: number,
    startingAfter?: string,
    endingBefore?: string,
  } = {}): Promise<{
    success: boolean,
    draws?: DrawList,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/draws`,
      { ...search }
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return { success: true, draws: { count: BigInt(0), data: [] } }
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
    return { success, draws: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and returns that Draw
   * for that Loan for that Borrower.
   */
  async byId(borrowerId: string, loanId: string, drawId: string): Promise<{
    success: boolean,
    draw?: Draw,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}`,
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
    return { success, draw: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Draw Id,
   * and the updateable fields for the Draw and returns the result.
   *
   * The option 'readAfterWrite' allows for the verification step of doing
   * a read from Peach _after_ the update is successfully done, just to
   * make sure that the values are what you expected.
   */
  async update(borrowerId: string, loanId: string, drawId: string, data: {
    nickname?: string,
    externalId?: string | null,
    status?: string,
    atOrigination?: Partial<LoanOrigination>,
  }, options: {
    readAfterWrite?: boolean,
    validate?: boolean,
    force?: boolean,
  } = {}): Promise<{
    success: boolean,
    draw?: Draw,
    error?: PeachError,
  }> {
    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.validate)) {
      query.validate = options.validate
    }
    if (!isEmpty(options.force)) {
      query.force = options.force
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query

    // ...now we can make the call
    const resp = await this.client.fire(
      'PUT',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}`,
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
    // see if the user wants a read-after-write check
    if (options.readAfterWrite) {
      // we have to refetch it to see any PII data... odd but true.
      return (await this.byId(borrowerId, loanId, drawId))
    }
    // ...no need, we return exactly what we have.
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, draw: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Draw Id,
   * and the fields for the creation of a Draw and assign it to the Loan
   * for the Borrower.
   *
   * The option 'readAfterWrite' allows for the verification step of doing
   * a read from Peach _after_ the creation is successfully done, just to
   * make sure that the values are what you expected.
   */
  async create(borrowerId: string, loanId: string, data: {
    externalId?: string,
    declineReason?: DeclineReason,
    timestamps?: LoanTimestamps,
    metaData?: any,
    nickname?: string,
    status: string,
    isClosed?: boolean,
    atOrigination?: LoanOrigination,
  }, options: {
    readAfterWrite?: boolean,
  } = {}): Promise<{
    success: boolean,
    draw?: Draw,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/draws`,
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
    // see if the user wants a read-after-write check
    if (options.readAfterWrite) {
      // we have to refetch it to see any PII data... odd but true.
      return (await this.byId(borrowerId, loanId, resp.payload?.data?.id))
    }
    // ...no need, we return exactly what we have.
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, draw: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and the Peach Draw Id
   * and activates the Draw. This will trigger any activation-related
   * logic at Peach.
   */
  async activate(borrowerId: string, loanId: string, drawId: string): Promise<{
    success: boolean,
    schedule?: LoanSchedule,
    ratesValidation?: RatesValidation,
    amountsValidation?: AmountsValidation,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/activate`,
      undefined,
      {},
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
    return { ...resp.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and the Peach Draw Id,
   * and an optional effectiveDate, and returns the current credit limit for
   * that Draw.
   */
  async creditLimit(borrowerId: string, loanId: string, drawId: string, options: {
    effectiveDate?: string,
  } = {}): Promise<{
    success: boolean,
    creditLimitAmount?: number,
    caseId?: string,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/credit-limit`,
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
    return { ...resp.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and the Peach Draw Id
   * and *at least* the creditLimitAmount, and updates the credit limit on
   * that Draw, and returns the new credit limit for that Draw.
   */
  async updateCreditLimit(borrowerId: string, loanId: string, drawId: string, options: {
    creditLimitAmount: number,
    caseId?: string,
  }): Promise<{
    success: boolean,
    draw?: Draw,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/credit-limit`,
      undefined,
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
    return { success, draw: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and some parameters
   * for the potential Draw, and returns the schedule for that potential
   * Draw.
   */
  async previewAmortization(borrowerId: string, loanId: string, options: {
    purchaseAmount: number,
    duration?: number,
    recuringAmount?: number,
    startDate?: string,
    drawFee?: number,
    serviceFeeAmount?: number,
    serviceCapAmount?: number,
  }): Promise<{
    success: boolean,
    schedule?: LoanSchedule[],
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/amortize-preview`,
      undefined,
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
    return { ...resp.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and the Peach Draw Id
   * and some parameters for the amortization and returns the schedule for
   * the Draw.
   */
  async amortize(borrowerId: string, loanId: string, drawId: string, options: {
    previewMode?: boolean,
    duration?: number,
    recuringAmount?: number,
  }): Promise<{
    success: boolean,
    schedule?: LoanSchedule[],
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/amortize`,
      undefined,
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
    return { ...resp.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Draw Id,
   * and some execution options, and cancel the Draw. This will trigger
   * any cancellation-related logic at Peach.
   */
  async cancel(borrowerId: string, loanId: string, drawId: string, options: {
    force?: boolean,
    cancellationReason?: string,
  } = {}): Promise<{
    success: boolean,
    error?: PeachError,
  }> {
    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.force)) {
      query.force = options.force
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query
    // make the body from everything *but* 'force'
    delete options.force

    // ...now we can make the call
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/close`,
      query,
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
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Draw Id,
   * and some execution options, and closes the Draw. This will trigger
   * any closure-related logic at Peach.
   */
  async close(borrowerId: string, loanId: string, drawId: string, options: {
    closeRequestedByBorrower?: boolean,
    caseId?: string,
  } = {}): Promise<{
    success: boolean,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/close`,
      undefined,
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
}
