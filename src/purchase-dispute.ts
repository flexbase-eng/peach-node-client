import type { Peach, PeachOptions, PeachError } from './'

export interface PurchaseDispute {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  externalId?: string;
  companyId?: string;
  timestamps?: {
    submittedAt?: string;
    expiredAt?: string;
    wonAt?: string;
    lostAt?: string;
  },
  caseId?: string;
  status?: string;
  disputedAmount?: number;
  metadata?: any;
  repostedPurchaseId?: string;
}

export interface PurchaseDisputeList {
  count?: bigint;
  nextUrl?: string;
  previousUrl?: string;
  data: PurchaseDispute[];
}

export class PurchaseDisputeApi {
  client: Peach;

  constructor(client: Peach, _options?: PeachOptions) {
    this.client = client
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, the Peach Draw Id,
   * and the Peach Purchase Id and returns the Purchase Disputes for that
   * Purchase for that Draw for that Loan for that Borrower.
   */
  async get(
    borrowerId: string,
    loanId: string,
    drawId: string,
    purchaseId: string,
  ): Promise<{
    success: boolean,
    disputes?: PurchaseDisputeList,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/purchases/${purchaseId}/disputes`,
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return { success: true, disputes: { count: BigInt(0), data: [] } }
    }
    // ...now catch the other errors...
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
    return { success, disputes: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and the Peach Draw Id,
   * and returns all the Purchase Disputes for that Draw for that Loan for
   * that Borrower.
   */
  async getForDraw(
    borrowerId: string,
    loanId: string,
    drawId: string,
  ): Promise<{
    success: boolean,
    disputes?: PurchaseDisputeList,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/disputes`,
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return { success: true, disputes: { count: BigInt(0), data: [] } }
    }
    // ...now catch the other errors...
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
    return { success, disputes: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and returns all the
   * Purchase Disputes for that Loan for that Borrower.
   */
  async getForLoan(
    borrowerId: string,
    loanId: string,
  ): Promise<{
    success: boolean,
    disputes?: PurchaseDisputeList,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/disputes`,
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return { success: true, disputes: { count: BigInt(0), data: [] } }
    }
    // ...now catch the other errors...
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
    return { success, disputes: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, the Peach Draw Id,
   * the Peach Purchase Id and the Peach Purchase Dispute Id and returns
   * that Dispute for that Purchase, for that Draw, for that Loan, for
   * that Borrower.
   */
  async byId(
    borrowerId: string,
    loanId: string,
    drawId: string,
    purchaseId: string,
    purchaseDisputeId: string,
  ): Promise<{
    success: boolean,
    dispute?: PurchaseDispute,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/purchases/${purchaseId}/disputes/${purchaseDisputeId}`,
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
    return { success, dispute: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, Peach Draw Id, Peach
   * Purchase Id, and Peach Purchase Dispute Id  along with the updateable
   * fields for the Purchase, and a few options for the execution of the
   * call, and returns the result.
   */
  async update(
    borrowerId: string,
    loanId: string,
    drawId: string,
    purchaseId: string,
    purchaseDisputeId: string,
    data: {
      externalId?: string | null,
      caseId?: string,
      status?: string,
      disputedAmount?: number,
      metadata?: any,
      reportedPurchaseId?: string,
    },
    options: {
      sync?: boolean,
    } = {},
  ): Promise<{
    success: boolean,
    dispute?: PurchaseDispute,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'PUT',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/purchases/${purchaseId}/disputes/${purchaseDisputeId}`,
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
    return { success, dispute: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, Peach Draw Id, Peach
   * Purchase Id, and the fields for the creation of a Purchase Dispute
   * and assign it to the Purchase, on the Draw, for the Loan, for the
   * Borrower.
   */
  async create(
    borrowerId: string,
    loanId: string,
    drawId: string,
    purchaseId: string,
    data: {
      externalId?: string | null,
      caseId?: string,
      status?: string,
      disputedAmount?: number,
      metadata?: any,
      reportedPurchaseId?: string,
    }, options: {
      createDisputeCase?: boolean,
    } = {},
  ): Promise<{
    success: boolean,
    dispute?: PurchaseDispute,
    error?: PeachError
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/draws/${drawId}/purchases/${purchaseId}/disputes`,
      undefined,
      { ...data, ...options },
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
    return { success, dispute: resp.payload?.data }
  }

}
