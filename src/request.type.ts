/*
 * (request.types.ts) HTTP types
 * 
 * Copyright (c) 2023 Belousov Daniil
 * All rights reserved.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * Licensed under the 'GNU General Public License v3.0'
 * For more information, please refer to <https://www.gnu.org/licenses/gpl-3.0.html>
 */


import { HTTPContentType } from "./http-headers.type"


/**
 * All allowed defined HTTP methods
 */
export enum HTTPMethod {
    GET     = 'GET',
    POST    = 'POST',
    HEAD    = 'HEAD',
    PUT     = 'PUT',
    DELETE  = 'DELETE',
    CONNECT = 'CONNECT',
    OPTIONS = 'OPTIONS',
    TRACE   = 'TRACE',
    PATCH   = 'PATCH',
}

/**
 * Maps default HTTP headers
 * to their values.
 */
interface HTTPHeadersMap {
    "Content-Type": HTTPContentType,
}


/**
 * Undefiend mock shortcut for
 * custom http-headers (empty object).
 */
export interface AnyObject {
    [K: string]: any
}

/**
 * Enum values unwrapper shortcut.
 */
export type EnumKeys<T extends Record<string, any>> = keyof T;

/**
 * Unwrapping type for the {@link HTTPHeadersMap}
 * to define only default HTTP headers.
 */
export type HTTPDefaultHeaders = {
    [K in keyof HTTPHeadersMap]?: HTTPHeadersMap[K];
}

/**
 * ### Headers object
 * 
 * Represented as an object of default HTTP headers with
 * any, which are defined by user. For the default http headers,
 * type check allows to list all available header values, for the
 * 'user-defined', generic argument can be used. If you want to user
 * only default HTTP headers (strict), use {@link HTTPDefaultHeaders}.
 * 
 * Notice, that all keys are not required, meaning that if not all of
 * the headers you may expect are not listed in the object, it wount
 * be marked as an error, HTTPHeaders just type-hints you available
 * headers and checks their values or values type.
 * 
 * Example, how to trait HTTPHeader with your application-specific
 * ```ts
 * interface MyHeaders {
 *   'Sender': number,
 *   'Application-Auth': 'token' | 'password',
 * };
 * 
 * // Now type check and hinting includes `MyHeaders`
 * const requestHeaders: HTTPHeaders<MyHeaders> = {
 *   'Application-Auth': 'token',
 *   'Content-Type": "application/json",
 * };
 * ```
 */
export type HTTPHeaders<T extends Object = AnyObject> = HTTPDefaultHeaders & {[K in keyof T]?: T[K]}


/**
 * Reassigned generic responce for defining api
 * handlers with responce data types.
 */
export interface HTTPResponce<T> extends Response {
    json(): Promise<T>
}

/**
 * API-handler http request result with in
 * (res, err) return type.
 */
export type HTTPRequestResult<T> = Promise<[HTTPResponce<T>, Error|null]>


// export type HTTPRequestHandler = <T>(api: string, method: HTTPMethod, content?: any) => HTTPRequestResult<T>


export interface HTTPRequestInit {
    /** A string indicating how the request will interact with the browser's cache to set request's cache. */
    cache?: RequestCache;
    /** A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. */
    credentials?: RequestCredentials;
    /** A cryptographic hash of the resource to be fetched by request. Sets request's integrity. */
    integrity?: string;
    /** A boolean to set request's keepalive. */
    keepalive?: boolean;
    /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
    mode?: RequestMode;
    /** A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.*/
    redirect?: RequestRedirect;
    /** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
    referrer?: string;
    /** A referrer policy to set request's referrerPolicy. */
    referrerPolicy?: ReferrerPolicy;
    /** An AbortSignal to set request's signal. */
    signal?: AbortSignal | null;
    /** Can only be null. Used to disassociate request from any Window. */
    window?: null;
}

/**
 * ### HTTP requests fabric settings
 * 
 * Used for building HTTP requests, which provides an
 * ability to group requests or use default values
 * without need to provide this arguments again.
 * 
 * Generic arguments is used to trait HTTPHeaders with
 * your application-specific (custom) headers.
 */
export interface HTTPRequestBuildSettings<T extends Object = AnyObject> {
    /**
     * API endpoint, which is joined with the `host`.
     */
    urlEndpoint: string;
    /**
     * Request method from {@link HTTPMethod}
     */
    method: HTTPMethod;
    /**
     * Headers, which are included to every request,
     * which does not required to specify each time.
     */
    requestSpecificHeaders?: HTTPHeaders<T>;
    /**
     * Default fetch {@link RequestInit} with some erased
     * properties, which are separated for usability reasons.
     */
    requestInit?: HTTPRequestInit;
}

/**
 * Defined api handle with request
 * and responce data types.
 */
export type ApiHandle<Q, S> = (data: Q) => HTTPRequestResult<S>;

/**
 * Dynamic http request type, used for dynamic typing
 * of the api requests, which allows to also specify headers
 * and api method.
 */
export type HTTPRequest<Q, S, M extends EnumKeys<typeof HTTPMethod> = HTTPMethod, H extends AnyObject|undefined = HTTPHeaders> = (data: Q, method: M, headers: H) => HTTPRequestResult<S>;
