import type { Peach, PeachOptions, PeachError } from './'
import type { ContactAddress } from './contact'

export interface Loan {
  object?: string;
  type?: string;
  id?: string;
  externalId?: string;
  displayId?: string;
  loanTypeId: string;
  assetDisplayName?: string;
  assetType?: string;
  companyId?: string;
  chargedOffReason?: string;
  declineReason?: DeclineReason;
  timestamps?: LoanTimestamps;
  endDate?: string;
  mainBorrowerId?: string;
  metaData?: any;
  nickname?: string;
  servicedBy: string;
  status: string;
  newDrawsAllowed: boolean;
  isClosed?: boolean;
  additionalPeople?: {
    personId?: string;
    loanRelationType?: string;
  }[];
  aprEffectiveAtActivation?: number;
  aprNominalAtActivation?: number;
  ratesValidation?: RatesValidation;
  amountsValidation?: AmountsValidation;
  current?: LoanCurrent;
  atOrigination?: LoanOrigination;
}

export interface DeclineReason {
  mainExternalReasonCode?: string;
  mainText?: string;
  mainScriptForRep?: string;
  subReasons: DeclineSubReason[];
}

export interface DeclineSubReason {
  externalReasonCode?: string;
  reasonText?: string;
  scriptForRep?: string;
}

export interface LoanTimestamps {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  startedAt?: string;
  originatedAt?: string;
  activatedAt?: string;
  frozenAt?: string;
  lastAmortizedAt?: string;
  acceleratedAt?: string;
  chargedOffAt?: string;
  paidOffAt?: string;
  closedAt?: string;
}

export interface RatesValidation {
  interestRateAtOrigExceedsMax?: boolean;
  interestRateAtOrigBelowMin?: boolean;
  aprEffectiveAtOrigExceedsMax?: boolean;
  aprNominalAtOrigExceedsMax?: boolean;
  aprEffectiveAtActExceedsMax?: boolean;
  aprNominalAtActExceedsMax?: boolean;
}

export interface AmountsValidation {
  principalMatch?: boolean;
  interestMatch?: boolean;
  feesMatch?: boolean;
  totalAdvancesMatch?: boolean;
  recurringAmountsMatch?: boolean;
}

export interface LoanCurrent {
  periodicPayment?: number;
  autopayEnabled?: boolean;
  creditLimitAmount?: number;
}

export interface LoanOrigination {
  amountFinanced?: number;
  duration?: number;
  enforcedEndDate?: string;
  bufferToPushOutSchedule?: number;
  originationLicense?: string;
  originatingCreditorName?: string;
  interestRates?: InterestRate[];
  promoRates?: PromoRate[];
  aprNominal?: number;
  aprEffective?: number;
  expectedPayments?: ExpectedPayment[];
  advanceSchedule?: AdvanceSchedule[];
  periodicPaymentAmount?: number;
  paymentFrequency?: string;
  specificDays?: (string | number)[];
  creditLimitAmount?: number;
  fees?: LoanFees;
  personAddress?: ContactAddress;
  personAddressId?: string;
  downPaymentAmount?: number;
  totalInterestAmount?: number;
  totalDiscountAmount?: number;
  totalInterestCapAmount?: number;
  discountProgramIds?: number[];
  validAddress?: boolean;
  newDrawsAllowed?: boolean;
  investors?: Investor[];
  itemsOrServicesFinanced?: string;
  mdr?: MerchantDiscRate[];
  merchantId?: string;
  isValidMerchantId?: boolean;
  skipCreditReporting?: boolean;
  card?: Card;
  promoPrograms?: PromoProgram[];
}

export interface PromoRate {
  days?: number;
  rate?: number;
}

export interface InterestRate extends PromoRate {
  interestType?: string;
}

export interface ExpectedPayment {
  date?: string;
  paymentType?: string;
  amount?: number;
  principalAmount?: number;
  interestAmount?: number;
  interestBeforeDiscountAmount?: number;
  unroundedPrincipalAmount?: string;
  unroundedInterestAmount?: string;
  unroundedInterestBeforeDiscountAmount?: string;
  dynamicFeeDetails?: DynamicFeeDetails;
}

export interface DynamicFeeDetails {
  dynamicFeeTypeId?: string;
}

export interface AdvanceSchedule {
  id?: string;
  externalId?: string;
  status?: string;
  amount?: number;
  originalAmount?: number;
  advanceDate?: string;
  advanceDetails?: AdvanceDetails;
  metadata?: any;
  timestamps?: LoanTimestamps;
}

export interface LoanSchedule {
  date?: string;
  periodId?: string;
  paymentType?: string;
  status?: string;
  amount?: number;
  originalAmount?: number;
  principalAmount?: number;
  interestAmount?: number;
  interestBeforeDiscountAmount?: number;
  unroundedPrincipalAmount?: string;
  unroundedInterestAmount?: string;
  unroundedInterestBeforeDiscountAmount?: string;
  isDeferred?: boolean;
  dynamicFeeDetails?: {
    loanFeeId?: string;
    dynamicFeeTypeId?: string;
    apiName?: string;
    displayName?: string;
  }
}

export interface AdvanceDetails {
  description?: string;
  pointOfSaleType?: string;
  categoryId?: string;
  merchantId?: string;
  merchantName?: string;
  metadata?: any;
}

export interface LoanFees {
  originationFeeAmount?: number;
  serviceFeeAmount?: number;
  serviceFeeCapAmount?: number;
  totalOtherFeesAmount?: number;
}

export interface Investor {
  investorId?: string;
  share?: number;
  effectiveDate?: string;
  dateEffective?: string;
}

export interface MerchantDiscRate {
  mdrRate?: number;
  mdrAmount?: number;
  isAmortized?: boolean;
  amortizationPeriod?: number;
}

export interface Card {
  issuerId?: string;
  token?: string;
  type?: string;
  cardDetails?: CardDetails;
}

export interface CardDetails {
  status?: string;
  usageType?: string;
  fulfillmentStatus?: string;
  cardNumberLastFour?: string;
  expirationYear?: number;
  expirationMonth?: number;
  network?: string;
  firstName?: string;
  lastName?: string;
  address?: ContactAddress;
  pan?: number;
  cvvNumber?: number;
  nickname?: string;
}

export interface PromoProgram {
  promoTypeId?: string;
  id?: string;
  externalId?: string;
  status?: string;
  promoStartDate?: string;
  promoEndDate?: string;
  promoDurationDays?: number;
  promoGracePeriodDays?: number;
  sacDisqualifyOverdueDays?: number;
  metaData?: any;
}

export interface LoanList {
  count?: bigint;
  nextUrl?: string;
  previousUrl?: string;
  data: Loan[];
}

import { isEmpty } from './'

export class LoanApi {
  client: Peach;

  constructor(client: Peach, _options?: PeachOptions) {
    this.client = client
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and return the Loans for this Borrower
   * that match the provided optional criteria - or all of them if no filtering
   * options are provided.
   */
  async get(borrowerId: string, options: {
    limit?: number,
    startingAfter?: string,
    endingBefore?: string,
    status?: string,
  } = {}): Promise<{
    success: boolean,
    loans?: LoanList,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans`,
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
    return { success, loans: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and the Peach Loan Id, and return
   * the proper Loan for this Borrower.
   */
  async byId(borrowerId: string, loanId: string): Promise<{
    success: boolean,
    loan?: Loan,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}`,
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
    return { success, loan: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and the editable
   * fields for a Loan, and return the proper updated Loan for
   * this Borrower.
   *
   * The option 'readAfterWrite' allows for the verification step of doing
   * a read from Peach _after_ the update is successfully done, just to
   * make sure that the values are what you expected.
   */
  async update(borrowerId: string, loanId: string, data: {
    metadata?: any,
    nickname?: string,
    status?: string,
    atOrigination?: Partial<LoanOrigination>,
  }, options: {
    readAfterWrite?: boolean,
    validate?: boolean,
    force?: boolean,
  } = {}): Promise<{
    success: boolean,
    loan?: Loan,
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
      `people/${borrowerId}/loans/${loanId}`,
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
      return (await this.byId(borrowerId, loanId))
    }
    // ...no need, we return exactly what we have.
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, loan: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), and the attributes of a new Loan,
   * and create that Loan, and assign it to the indicated Borrower.
   *
   * The option 'readAfterWrite' allows for the verification step of doing
   * a read from Peach _after_ the creation is successfully done, just to
   * make sure that the values are what you expected.
   */
  async create(borrowerId: string, data: {
    type?: string,
    loanTypeId: string,
    externalId?: string,
    declineReason?: DeclineReason,
    timestamps?: LoanTimestamps,
    metaData?: any,
    nickname?: string,
    servicedBy: string,
    status: string,
    isClosed?: boolean,
    additionalPeople?: {
      personId?: string,
      loanRelationType?: string,
    }[],
    newDrawsAllowed: boolean,
    atOrigination?: LoanOrigination,
  }, options: {
    readAfterWrite?: boolean,
    validate?: boolean,
  } = {}): Promise<{
    success: boolean,
    loan?: Loan,
    error?: PeachError,
  }> {
    // build up the query params, based on the options
    let query = {} as any
    if (!isEmpty(options.validate)) {
      query.validate = options.validate
    }
    // ...drop it all if it's empty
    query = isEmpty(query) ? undefined : query

    // ...now we can make the call
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans`,
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
    return { success, loan: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and some execution
   * options, and cancels the Loan. This will trigger any cancelation-related
   * logic at Peach.
   */
  async cancel(borrowerId: string, loanId: string, options: {
    force?: boolean,
    cancellationReason?: string,
    sendCancellationNotice?: boolean,
    caseId?: string,
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
    const { force, ...data } = options || {}

    // ...now we can make the call
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/cancel`,
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
    return { success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and some execution
   * options, and closes the Loan. This will trigger any closure-related
   * logic at Peach.
   */
  async close(borrowerId: string, loanId: string, options: {
    closeReason?: string,
    closeRequestedByBorrower?: boolean,
    sendNotice?: boolean,
    caseId?: string,
  } = {}): Promise<{
    success: boolean,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/close`,
      undefined,
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
   * or an external id (ext-XXXX), the Peach Loan Id, and will return the
   * Loan's payment periods.
   */
  async periods(borrowerId: string, loanId: string): Promise<{
    success: boolean,
    periods?: {
      object: string,
      periodId: string,
      startDate?: string,
      endDate?: string,
      statementDate?: string,
      dueDate?: string,
    }[],
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/periods`,
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
    return { success, periods: resp.payload }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and some execution
   * options, and activates the Loan. This will trigger any activation-related
   * logic at Peach.
   */
  async activate(borrowerId: string, loanId: string, options: {
    amortizationAtActivation?: string,
    sendNotice?: boolean,
  } = {}): Promise<{
    success: boolean,
    schedule?: LoanSchedule,
    ratesValidation?: RatesValidation,
    amountsValidation?: AmountsValidation,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/activate`,
      undefined,
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
    return { ...resp.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and some execution
   * options, and reimburses the Borrower for some amount owed to them by
   * the Lender.
   */
  async reimburse(borrowerId: string, loanId: string, options: {
    isExternal?: boolean,
    externalTransactionId?: string,
    reimbursementAmount?: number,
    paymentInstrumentType?: string,
    paymentInstrumentId?: string,
    transactionStatus?: string,
    contactId?: string,
    caseId?: string,
  } = {}): Promise<{
    success: boolean,
    reimbursement?: any,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/reimburse`,
      undefined,
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
    return { success, reimbursement: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and an optional
   * effectiveDate, and returns the current credit limit for that Loan.
   */
  async creditLimit(borrowerId: string, loanId: string, options: {
    effectiveDate?: string,
  } = {}): Promise<{
    success: boolean,
    creditLimitAmount?: number,
    sendNotice?: boolean,
    adverseReactionReason?: string,
    caseId?: string,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `people/${borrowerId}/loans/${loanId}/credit-limit`,
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
    return { ...resp.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and *at least*
   * the creditLimitAmount, and updates the credit limit on that Loan,
   * and returns the new credit limit for that Loan.
   */
  async updateCreditLimit(borrowerId: string, loanId: string, options: {
    creditLimitAmount: number,
    sendNotice?: boolean,
    adverseReactionReason?: string,
    caseId?: string,
  }): Promise<{
    success: boolean,
    loan?: Loan,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/credit-limit`,
      undefined,
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
    return { success, loan: resp.payload?.data }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and freezes the Loan
   * by setting the status to 'frozen', with the current date. The Loan
   * will stay in this state until the unfreeze() call is made on it.
   */
  async freeze(borrowerId: string, loanId: string, options: {
    sendNotice?: boolean,
    caseId?: string,
  } = {}): Promise<{
    success: boolean,
    loan?: Loan,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/freeze`,
      undefined,
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
   * or an external id (ext-XXXX), the Peach Loan Id, and unfreezes the
   * Loan by setting the status to 'active'.
   */
  async unfreeze(borrowerId: string, loanId: string, options: {
    previewMode?: boolean,
    retroactivelyAccrueInterest?: boolean,
    shiftDueDates?: boolean,
    sendNotice?: boolean,
    caseId?: string,
  } = {}): Promise<{
    success: boolean,
    paymentFrequency?: string,
    specificDays?: (string | number)[],
    schedule?: LoanSchedule[],
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/unfreeze`,
      undefined,
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
    return { ...resp?.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and accelerates the
   * Loan by setting the status to 'accelerated', and triggers any
   * acceleration-related logic and accounting treatment.
   */
  async accelerate(borrowerId: string, loanId: string, options: {
    effectiveDate?: string,
    sendNotice?: boolean,
    caseId?: string,
  } = {}): Promise<{
    success: boolean,
    acceleratedAmount?: number,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/accelerate`,
      undefined,
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
    return { ...resp?.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and 'reverse'
   * accelerates the Loan by setting the status to 'active', and triggers any
   * acceleration-related logic and accounting treatment.
   */
  async reverseAccelerate(borrowerId: string, loanId: string, options: {
    caseId?: string,
  }): Promise<{
    success: boolean,
    reversedAcceleratedAmount?: number,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/reverse-accelerate`,
      undefined,
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
    return { ...resp?.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and charge-off the
   * Loan by setting the status to 'charged-off', and triggers any
   * charge-off-related logic and accounting treatment.
   */
  async chargeOff(borrowerId: string, loanId: string, options: {
    effectiveDate?: string,
    chargedOffReason: string,
    sendNotice?: boolean,
    caseId?: string,
  }): Promise<{
    success: boolean,
    chargeOffAmount?: number,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/charge-off`,
      undefined,
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
    return { ...resp?.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and 'reverses' a
   * charge-off of the Loan by setting the status to 'active', and triggers
   * any charge-off-related logic and accounting treatment.
   */
  async reverseChargeOff(borrowerId: string, loanId: string, options: {
    caseId?: string,
  }): Promise<{
    success: boolean,
    reversedChargeOffAmount?: number,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/reverse-charge-off`,
      undefined,
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
    return { ...resp?.payload?.data, success }
  }

  /*
   * Function to take a Borrower Id, be that the Peach id (BO-XXXX-XXXX),
   * or an external id (ext-XXXX), the Peach Loan Id, and refresh the Loan
   * to make sure that obligations, expected payments, and interest accrual
   * is brought into sync.
   */
  async refresh(borrowerId: string, loanId: string): Promise<{
    success: boolean,
    reversedChargeOffAmount?: number,
    error?: PeachError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `people/${borrowerId}/loans/${loanId}/refresh`,
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
}
