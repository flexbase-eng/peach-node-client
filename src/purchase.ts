import type { Peach, PeachOptions, PeachError } from './'
import type { DeclineReason } from './loan'

export interface Purchase {
  object?: string;
  id?: string;
  externalId?: string;
  displayId?: string;
  type?: string;
  status: string;
  amount?: number;
  originalAmount?: number;
  purchaseDate?: string;
  purchaseDetails?: PurchaseDetails;
  declineReason?: DeclineReason;
  eligibleDisputeAmount?: number;
  metaData?: any;
  timestamps?: {
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface PurchaseDetails {
  description?: string;
  pointOfSaleType?: string;
  categoryId?: string;
  merchantId?: string;
  merchantName?: string;
  metadata?: any;
  isValidMerchantId?: boolean;
  externalCardId?: string;
  originalCurrencyAmount?: number;
  originalCurrencyCode?: string;
  conversionRate?: number;
}

export interface PurchaseList {
  count?: bigint;
  nextUrl?: string;
  previousUrl?: string;
  data: Purchase[];
}

export class PurchaseApi {
  client: Peach;

  constructor(client: Peach, _options?: PeachOptions) {
    this.client = client
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Draw Id,
   * and some optional search (filtering) parameters for the Purchases
   * for that Draw for that Loan for that Borrower.
   */
  async get(
    borrowerId: string,
    loanId: string,
    drawId: string,
    search: {
      types?: string[],
      statuses?: string[],
      limit?: number,
      startingAfter?: string,
      endingBefore?: string,
    } = {},
  ): Promise<{
    success: boolean,
    purchases?: PurchaseList,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/purchases`,
      { ...search }
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return { success: true, purchases: { count: BigInt(0), data: [] } }
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
    return { success, purchases: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, the Peach Draw Id,
   * and the Peach Purchase Id and returns that Purchase for that Draw,
   * for that Loan, for that Borrower.
   */
  async byId(
    borrowerId: string,
    loanId: string,
    drawId: string,
    purchaseId: string,
  ): Promise<{
    success: boolean,
    purchase?: Purchase,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/purchases/${purchaseId}`,
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
    return { success, purchase: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Draw Id,
   * along with the updateable fields for the Purchase, and a few options
   * for the execution of the call, and returns the result.
   */
  async update(
    borrowerId: string,
    loanId: string,
    drawId: string,
    purchaseId: string,
    data: {
      status?: string,
      amount?: number,
      externalId?: string | null,
      purchaseDetails?: PurchaseDetails,
      declineReason?: DeclineReason,
    },
    options: {
      sync?: boolean,
    } = {},
  ): Promise<{
    success: boolean,
    purchase?: Purchase,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'PUT',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/purchases/${purchaseId}`,
      options,
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
    return { success, purchase: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and Peach Draw Id,
   * and the fields for the creation of a Purchase and assign it to the
   * Draw, for the Loan, for the Borrower.
   */
  async create(
    borrowerId: string,
    loanId: string,
    drawId: string,
    data: {
      externalId?: string,
      type?: string,
      status?: string,
      amount: number,
      purchaseDate?: string,
      purchaseDetails?: PurchaseDetails,
      originalPurchaseId?: string,
      declineReason?: DeclineReason,
      metaData?: any,
    }, options: {
      force?: boolean,
      sync?: boolean,
    } = {},
  ): Promise<{
    success: boolean,
    purchase?: Purchase,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/purchases`,
      options,
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
    return { success, purchase: resp.payload?.data }
  }
}
