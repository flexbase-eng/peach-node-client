import fetch from 'node-fetch'
import FormData = require('formdata')
import path from 'path'
import camelCaseKeys from 'camelcase-keys'

import { BorrowerApi } from './borrower'
import { IdentityApi } from './identity'
import { ContactApi } from './contact'
import { LoanApi } from './loan'
import { DrawApi } from './draw'
import { PurchaseApi } from './purchase'
import { PurchaseDisputeApi } from './purchase-dispute'
import { PaymentInstrumentApi } from './payment-instrument'
import { TransactionApi } from './transaction'

const ClientVersion = require('../package.json').version
const PROTOCOL = 'https'
const PEACH_HOST = 'sandboxapi.peach.finance/api'

/*
 * These are the acceptable options to the creation of the Client:
 *
 *   {
 *     host: "sandboxapi.peach.finance/api",
 *     apiKey: "abcdefg123456xyz",
 *   }
 *
 * and the construction of the Client will use this data for all
 * calls made to Peach.
 */
export interface PeachOptions {
  host?: string;
  apiKey?: string;
}

/*
 * These are the standard error objects from Peach - and will be returned
 * from Peach for any bad condition. We will allow these - as well as just
 * strings in the errors being returned from the calls.
 */
export interface PeachError {
  type: string;
  message?: string;
  error?: string;
  status?: number;
  peachStatus?: number;
}

/*
 * When Peach returns fuzzy search results, they also return metadata
 * about the way the search was done, and that includes identifying all
 * the hits, and why they hit, as well as how well they hit. This is
 * useful data for the folks looking to understand the "How?" of the
 * searching engine at Peach.
 */
export interface PeachSearch {
  hits: PeachSearchHit[];
  inputErrors: any;
  maxScore?: number;
  total: PeachSearchTotal;
}

/*
 * When Peach returns fuzzy search results, they also return metadata
 * about the individual hits that it found. This is the data for each
 * of the individual hits in the search results.
 */
export interface PeachSearchHit {
  highlight: any;
  id: string;
  score: number;
}

/*
 * When Peach returns fuzzy search results, they also return metadata
 * about the conditions on how the search was done. Part of that is a
 * set of values indicating the relation and the value of the search
 * hit. This is that data.
 */
export interface PeachSearchTotal {
  relation: string;
  value: number;
}

/*
 * This is the main constructor of the Peach Client, and will be called
 * with something like:
 *
 *   import { Peach } from "peach-node-client"
 *   const client = new Peach({ apiKey: '54321dcba77884' })
 */
export class Peach {
  host: string
  apiKey: string
  borrower: BorrowerApi
  identity: IdentityApi
  contact: ContactApi
  loan: LoanApi
  draw: DrawApi
  purchase: PurchaseApi
  purchaseDispute: PurchaseDisputeApi
  paymentInstrument: PaymentInstrumentApi
  transaction: TransactionApi

  constructor (options?: PeachOptions) {
    this.host = options?.host || PEACH_HOST
    this.apiKey = options?.apiKey!
    // now construct all the specific domain objects
    this.borrower = new BorrowerApi(this, options)
    this.identity = new IdentityApi(this, options)
    this.contact = new ContactApi(this, options)
    this.loan = new LoanApi(this, options)
    this.draw = new DrawApi(this, options)
    this.purchase = new PurchaseApi(this, options)
    this.purchaseDispute = new PurchaseDisputeApi(this, options)
    this.paymentInstrument = new PaymentInstrumentApi(this, options)
    this.transaction = new TransactionApi(this, options)
  }

  /*
   * Function to fire off a GET, PUT, POST, (method) to the uri, preceeded
   * by the host, with the optional query params, and optional body, and
   * puts the 'apiKey' into the headers for the call, and fires off the call
   * to the Peach host and returns the response.
   */
  async fire(
    method: string,
    uri: string,
    query?: { [index: string] : number | string | string[] | boolean },
    body?: object | object[] | FormData,
  ): Promise<{ response: any, payload?: any }> {
    // build up the complete url from the provided 'uri' and the 'host'
    let url = new URL(PROTOCOL+'://'+path.join(this.host, uri))
    if (query) {
      Object.keys(query).forEach(k => {
        if (something(query[k])) {
          url.searchParams.append(k, query[k].toString())
        }
      })
    }
    const isForm = isFormData(body)
    // make the appropriate headers
    let headers = {
      'X_API_KEY': this.apiKey,
      Accept: 'application/json',
      'X-Peach-Client-Ver': ClientVersion,
    } as any
    if (!isForm) {
      headers = { ...headers, 'Content-Type': 'application/json' }
    }
    // allow a few retries on the authentication token expiration
    let response
    for (let cnt = 0; cnt < 3; cnt++) {
      // now we can make the call... see if it's a JSON body or a FormData one...
      try {
        response = await fetch(url, {
          method: method,
          body: isForm ? (body as any) : (body ? JSON.stringify(body) : undefined),
          headers,
        })
        const payload = declutter(camelCaseKeys((await response?.json()), { deep: true }))
        // const payload = camelCaseKeys((await response?.json()), { deep: true })
        // console.log('PAYLOAD',payload)
        return { response, payload }
      } catch (err) {
        return { response }
      }
    }
    // this will mean we retried, and still failed
    return { response }
  }
}

/*
 * Simple function used to weed out undefined and null query params before
 * trying to place them on the call.
 */
function something(arg: any) {
  return arg || arg === false || arg === 0 || arg === ''
}

/*
 * Function to examine the argument and see if it's 'empty' - and this will
 * work for undefined values, and nulls, as well as strings, arrays, and
 * objects. If it's a regular data type - then it's "not empty" - but this
 * will help know if there's something in the data to look at.
 */
export function isEmpty(arg: any): boolean {
  if (arg === undefined || arg === null) {
    return true
  } else if (typeof arg === 'string' || Array.isArray(arg)) {
    return arg.length == 0
  } else if (typeof arg === 'object') {
    return Object.keys(arg).length == 0
  }
  return false
}

/*
 * Simple predicate function to return 'true' if the argument is a FormData
 * object - as that is one of the possible values of the 'body' in the fire()
 * function. We have to handle that differently on the call than when it's
 * a more traditional JSON object body.
 */
function isFormData(arg: any): boolean {
  let ans = false
  if (arg && typeof arg === 'object') {
    ans = (typeof arg._boundary === 'string' &&
           arg._boundary.length > 20 &&
           Array.isArray(arg._streams))
  }
  return ans
}

/*
 * Convenience function to create a PeachError based on a simple message
 * from the Client code. This is an easy way to make PeachError instances
 * from the simple error messages we have in this code.
 */
export function mkError(message: string): PeachError {
  return {
    type: 'client',
    message,
  }
}

/*
 * Peach has several standard fields in their responses - status, and the
 * paging URLs, and if they are unnecessary, like `null` URLs, it makes
 * sense to clear them out and "declutter" the response data for the caller.
 * that's what this function is doing.
 */
export function declutter(arg: any): any {
  // see if we have anything to do at all...
  if (isEmpty(arg) || typeof arg !== 'object') {
    return arg
  }
  let ret = { ...arg }
  // Peach can send back several empty fields on all responses... clean it
  if (isEmpty(ret.nextUrl)) {
    delete ret.nextUrl
  }
  if (isEmpty(ret.previousUrl)) {
    delete ret.previousUrl
  }
  if (ret.status === 200) {
    delete ret.status
  }
  return ret
}

/*
 * Function that returns an Array based on the argument. If the arg is an Array,
 * then returns the argument, if it's a different type, an Array is returned
 * within the value of the argument.
 */
export function toArray(arg: any): any[] {
  if (Array.isArray(arg)) {
    return arg
  } else if (isEmpty(arg)) {
    return []
  }
  return [arg]
}
