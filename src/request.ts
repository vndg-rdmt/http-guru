/*
 * (request.ts) HTTP request builders and utilities
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


import { HTTPRequestResult, HTTPHeaders, AnyObject, HTTPRequestBuildSettings, HTTPMethod, EnumKeys, ApiHandle, HTTPRequest, HTTPRequestInit } from "./request.type";

/**
 * ### HTTP requests builder
 * Created intance is used as a fabric for building
 * and typing requests with predefined values.
 */
export class HTTPRequestBuilder<T extends Object = AnyObject> {
    /**
     * ### HTTP requests builder
     * @param host remote http-api address. (For example http://your-api.example:1234 or http://your-api.example:1234/api/)
     * @param headers default headers, which shoud be included in each request.
     */
    public constructor(
        protected readonly host: string,
        protected headers: HTTPHeaders<T> = {},
    ) {};

    /**
     * Creates a deepcopy of {@link headers};
     */
    protected cloneHeaders(): typeof this.headers {
        return JSON.parse(JSON.stringify(this.headers));
    }

    /**
     * ### Make raw request
     * ---
     * #### Typing
     * - [S, responce type]     - responce body type, which leads to `Response.json(): Promise<S>`
     * - [Q, request data type] - request content type, which leads to `api(data: Q)`
     * - [H, request headers]   - additional headers to be included to the request,
     * it's data, required to be inclided to the Responce
     * ---
     * @param endpoint host handle endpoint
     * @param method   http request method
     * @param body     content
     * @param headers  additional headers to be included to the request
     * @param init     limited {@link RequestInit}
     * @returns        request result, err
     */
    public async request<Q extends any, H extends AnyObject, S extends any>(endpoint: string, method: HTTPMethod, body?: Q, headers?: HTTPHeaders<H>, init: HTTPRequestInit = {}): HTTPRequestResult<S> {
        const reqInit = Object.defineProperties<RequestInit>(
            {}, Object.getOwnPropertyDescriptors(init),
        );
        reqInit.method  = method;
        reqInit.body    = body ? JSON.stringify(body) : undefined;
        reqInit.headers = headers as HeadersInit;

        try       {return [await fetch(this.host + endpoint, reqInit), null]}
        catch (e) {return [new Response(), e as Error]}
    }

    /**
     * ### Define and types request
     * Mostly used for typing, less strict that {@link build} methods, which
     * statically build api handle with just input params from specified type.
     * ---
     * #### Typing
     * - [S, responce type]           - responce body type, which leads to `Response.json(): Promise<S>`
     * - [Q, request data type]       - request content type, which leads to `api(data: Q)`
     * - [M, allowed request methods] - allowed for this handle http methods from {@link HTTPMethods}.
     * - [H, request headers]         - additional headers to be included to the request,
     * it's data, required to be inclided to the Responce
     * ---
     * @param endpoint host handle endpoint
     * @param init     limited {@link RequestInit}
     * @returns        http request
     */
    public defineRequest<Q extends any, S extends any, M extends EnumKeys<typeof HTTPMethod> = HTTPMethod, H extends AnyObject|undefined = HTTPHeaders>(endpoint: string, init?: HTTPRequestInit): HTTPRequest<Q, S, M, H> {
        // Full api endpoint.
        const url = this.host + endpoint;
        const reqInit: HTTPRequestInit = init || {};

        // RequestInit fabric function, which is binded to the current context,
        // so created function will never face a loss of context problem.
        const fetchInit = ((body: Q, method: M, headers: H) => {
            // Creates new empty RequestInit object with
            // RequestInit from settings.
            const initBuffer = Object.defineProperties<RequestInit>(
                {}, Object.getOwnPropertyDescriptors(reqInit),
            );
            // Define request method.
            initBuffer.method = method;
            // Assigns request data.
            initBuffer.body = (body ? JSON.stringify(body) : undefined);
            // Merge default headers with request-specific.
            initBuffer.headers = Object.defineProperties(
                this.cloneHeaders() as HeadersInit,
                Object.getOwnPropertyDescriptors(headers || {}),
            );

            return initBuffer;
        }).bind(this);

        return async function (data: Q, method: M, headers: H): HTTPRequestResult<S> {
            try       {return [await fetch(url, fetchInit(data, method, headers)), null]}
            catch (e) {return [new Response(), e as Error]}
        };
    }

    /**
     * ### Build api http request
     * Methods builds new api request handler, which if fully defined and typed,
     * so requests will only require body content or do not, if api handler does
     * not require any request data.
     * ---
     * #### Typing
     * - [S, responce type] - responce body type, which leads to `Response.json(): Promise<S>`.
     * - [Q, request data type] - request content type, which leads to `api(data: Q)`,
     * - [H, request headers]   - additional headers to be included to the request,
     * it's data, required to be inclided to the Responce
     * ---
     * @param settings api static settings ({@link HTTPRequestBuildSettings}), to be built in the api request
     * @returns 
     */
    public build<S extends any, Q extends Object | undefined = undefined, H extends AnyObject = T>(settings: HTTPRequestBuildSettings<H>): ApiHandle<Q, S> {
        // Full api endpoint.
        const url = this.host + settings.urlEndpoint;
        const reqInit: HTTPRequestInit = settings.requestInit || {};
        // RequestInit fabric function, which is binded to the current context,
        // so created function will never face a loss of context problem.
        const fetchInit = ((body: Q) => {
            // Creates new empty RequestInit object with
            // RequestInit from settings.
            const initBuffer = Object.defineProperties<RequestInit>(
                {}, Object.getOwnPropertyDescriptors(reqInit),
            );
            // Define request method.
            initBuffer.method  = settings.method;
            // Assigns request data.
            initBuffer.body = (body !== undefined ? JSON.stringify(body) : undefined);      
            // Merge default headers with request-specific.
            initBuffer.headers = Object.defineProperties(
                this.cloneHeaders() as HeadersInit,
                Object.getOwnPropertyDescriptors(settings.requestSpecificHeaders),
            );

            return initBuffer;
        }).bind(this);

        return async function (data: Q): HTTPRequestResult<S> {
            try       {return [await fetch(url, fetchInit(data)), null]}
            catch (e) {return [new Response(), e as Error]}
        };
    }
}
