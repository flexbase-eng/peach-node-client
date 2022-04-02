import type { Peach, PeachOptions, PeachError } from './'

export interface Transaction {
  object?: string;
  id?: string;
  externalId?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isExternal?: boolean;
  isVirtual?: boolean;
  status?: string;
  timestamps?: TransactionTimestamps;
  transactionType?: string;
  paymentDetails?: PaymentDetails;
  actualAmount?: number;
  scheduledAmount?: number;
  paidPrincipalAmount?: number;
  paidInterestAmount?: number;
  paidFeesAmount?: number;
  paidOverAmount?: number;
  currency?: string;
  serviceCreditDetails?: ServiceCreditDetails;
  chargebackDetails?: ChargebackDetails;
  processingFeeAmount?: number;
  processingFeeType?: string;
  processorTransactionId?: string;
  processorReversalId?: string;
  processorReconciliationId?: string;
  avsResult?: string;
  failureReason?: string;
  failureDescriptionShort?: string;
  failureDescriptionLong?: string;
  processorFailureReason?: string;
  processorFailureDetails?: string;
  achReturnCode?: string;
  reversedByTransactionId?: string;
  reversedByTransactionExternalId?: string;
  parentTransactionId?: string;
  autopayPlanId?: string;
  autopayPaymentIds?: number[];
  createdBy: {
    id?: string;
    name?: string;
  },
  cancelReason?: string;
  enablePrepayments?: boolean;
}

export interface TransactionTimestamps {
  effectiveDate?: string;
  originalEffectiveDate?: string;
  scheduledDate?: string;
  displayDate?: string;
  initiatedAt?: string;
  pendingAt?: string;
  succeededAt?: string;
  failedAt?: string;
  canceledAt?: string;
  inDisputeAt?: string;
  chargebackAt?: string;
  appliedAt?: string;
}

export interface PaymentDetails {
  type?: string;
  reason?: string;
  fromInstrumentId?: string;
  fromInstrument?: PaymentInstrument;
  toInstrumentId?: string;
  toInstrument?: PaymentInstrument;
}

export interface PaymentInstrument {
  instrumentType?: string;
  accountNumberLastFour?: string;
}

export interface ServiceCreditDetails {
  type?: string;
  sponsor?: string;
  reason?: string;
}

export interface ChargebackDetails {
  amount?: number;
  description?: string;
  externalCaseNumber?: string;
  reasonCode?: string;
  status?: string;
  category?: string;
  originalTransactionId?: string;
}

export interface TransactionList {
  count?: bigint;
  nextUrl?: string;
  previousUrl?: string;
  data: Transaction[];
}

import { isEmpty } from './'

export class TransactionApi {
  client: Peach;

  constructor(client: Peach, _options?: PeachOptions) {
    this.client = client
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and some optional
   * search (filtering) parameters for the Transactions for that Loan
   * for that Borrower.
   */
  async get(borrowerId: string, loanId: string, search: {
    status?: string,
    paymentInstrumentId?: string;
    isExternal?: boolean;
    isVirtual?: boolean;
    toEffectiveDate?: string;
    fromEffectiveDate?: string;
    limit?: number,
    startingAfter?: string,
    endingBefore?: string,
  } = {}): Promise<{
    success: boolean,
    transactions?: TransactionList,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/transactions`,
      { ...search }
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
    return { success, transactions: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Transaction
   * Id and returns that Transaction for that Loan, for that Borrower.
   */
  async byId(borrowerId: string, loanId: string, transactionId: string): Promise<{
    success: boolean,
    transaction?: Transaction,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/transactions/${transactionId}`,
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
    return { success, transaction: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Transaction Id,
   * along with the updateable fields for the Transaction, and a few options
   * for the execution of the call, and returns the result.
   */
  async update(borrowerId: string, loanId: string, transactionId: string, data: {
      externalId?: string | null;
      isExternal?: boolean;
      isVirtual?: boolean;
      status?: string;
      timestamps?: TransactionTimestamps;
      actualAmount?: number;
      scheduledAmount?: number;
      paidPrincipalAmount?: number;
      paidInterestAmount?: number;
      paidFeesAmount?: number;
      paidOverAmount?: number;
      chargebackDetails?: ChargebackDetails;
      processingFeeAmount?: number;
      processingFeeType?: string;
      processorTransactionId?: string;
      processorReversalId?: string;
      processorReconciliationId?: string;
      avsResult?: string;
      failureReason?: string;
      processorFailureReason?: string;
      processorFailureDetails?: string;
      achReturnCode?: string;
      reversedByTransactionId?: string;
      reversedByTransactionExternalId?: string;
      parentTransactionId?: string;
      autopayPlanId?: string;
      autopayPaymentIds?: number[];
      cancelReason?: string;
      enablePrepayments?: boolean;
    },
    options: {
      sync?: boolean,
    } = {},
  ): Promise<{
    success: boolean,
    transaction?: Transaction,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'PUT',
      `people/${borrowerId}/loans/${loanId}/transactions/${transactionId}`,
      options,
      { ...data },
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
    return { success, transaction: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and the fields for the
   * creation of a Transaction and assign it to the Loan, for the Borrower.
   */
  async create(borrowerId: string, loanId: string, data: {
      type: string;
      drawId?: string;
      isExternal?: boolean;
      externalId?: string | null;
      status?: string;
      failureReason?: string;
      paymentInstrumentId: string;
      amount: number;
      scheduledDate?: string;
      enablePrepayments?: boolean;
      caseId?: string;
    }, options: {
      sync?: boolean,
    } = {},
  ): Promise<{
    success: boolean,
    transaction?: Transaction,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/transactions`,
      options,
      { ...data },
    )
    if (resp?.response?.status >= 400) {
      return {
        success: false,
        error: {
          type: 'peach',
          error: resp?.payload?.error || resp?.payload?.message,
          status: resp?.response?.status,
          peachStatus: resp?.payload?.status,
        },
      }
    }
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, transaction: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Transaction Id,
   * and will attempt to cancel this Transaction, allowing for the optional
   * enum of the cancelReason, which defaults to 'canceledByUser'.
   */
  async cancel(borrowerId: string, loanId: string, transactionId: string, options: {
    cancelReason?: string;
  } = {}): Promise<{
    success: boolean,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/transactions/${transactionId}/cancel`,
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
    return { success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Transaction Id,
   * and will attempt to reverse this Transaction, allowing for the optional
   * execution parameter and caseId.
   */
  async reverse(borrowerId: string, loanId: string, transactionId: string, options: {
    sync?: boolean;
    caseId?: string;
  } = {}): Promise<{
    success: boolean,
    transaction?: Transaction,
    error?: PeachError
  }> {
    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.sync)) {
      query.sync = options.sync
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query
    // make the body from everything *but* 'sync'
    const { sync, ...data } = options || {}

    // ...now we can make the call
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/transactions/${transactionId}/reverse`,
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
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, transaction: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Transaction Id,
   * and will attempt to backdate this Transaction to the provided
   * 'effectiveDate', allowing for the optional execution parameter and caseId.
   */
  async backdate(borrowerId: string, loanId: string, transactionId: string, options: {
    sync?: boolean;
    effectiveDate?: string;
    caseId?: string;
  } = {}): Promise<{
    success: boolean,
    transaction?: Transaction,
    error?: PeachError
  }> {
    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.sync)) {
      query.sync = options.sync
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query
    // make the body from everything *but* 'sync'
    const { sync, ...data } = options || {}

    // ...now we can make the call
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/transactions/${transactionId}/backdate`,
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
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, transaction: resp.payload?.data }
  }
}
