# HTTP-Guru

Build typed, fast and unified http apis for your frontend apps.

```bash
npm i http-guru
```

### Modules overview

Packaged includes only one api building entry **HTTPRequestBuilder**.

```ts
import {HTTPRequestBuilder} from 'http-guru';
```

Other imported entities are types. They are more useful than you can think from the first sight :3

Docs for each type is not represented in Readme, because it just a copy paste of js-docs, provided for each entity in the code. Import it to your code and jump to the definition, but type hinting and naming shoud make you fill easy to understand, what type is written for.

```ts
enum HTTPMethod;

interface HTTPHeadersMap;

type HTTPDefaultHeaders;

type HTTPHeaders<T extends Object = AnyObject>;

interface HTTPResponce<T>;

type HTTPRequestResult<T>;

interface HTTPRequestInit;

interface HTTPRequestBuildSettings<T extends Object = AnyObject>;

type ApiHandle<Q, S>;

type HTTPRequest<Q, S, M extends EnumKeys<typeof HTTPMethod>;

HTTPContentType;

// Supportive types, but may be useful as a Mocks (defaults) for generic types.
interface AnyObject;
type EnumKeys<T extends Record<string, any>>
```

### Usage

Before, defining apis handlers on frontend was procedural and mostly was wrapped in other function, which just again and again assembled fetch request on each call without providing any types. Now, apis can be build with just one api builder, which is built around an api host and headers, which you don't need to specify again and again.

Default headers are static, and passed with each request. Build is generic, which provides an ability to specify headers, which are available to specify within this api in one point of the app.

```ts

// Just an example of the app specific http headers
interface ApiSpecificHeaders {
    "Authtype": "password" | "token";
}

// Api builder itself
const apiBuilder = new HTTPRequestBuilder<HTTPHeaders<ApiSpecificHeaders>>(
    'https://my-hostexample/api', {
        'Authtype': 'password',
        'Content-Type': 'application/json',
    },
);
```

### Builder's methods:

#### Raw request
*This method just makes a raw request, it does not defines anything and builds ready to use api handle, it's an improved version fetch*

```ts
public async request<Q extends any, S extends any, H extends AnyObject = T>(endpoint: string, method: HTTPMethod, body?: Q, headers?: HTTPHeaders<H>, init: HTTPRequestInit = {}): HTTPRequestResult<S>
```

**Example**

```ts
interface ModelResponce {
    message: string,
}

interface ModelRequest {
    type: string,
    count: number,
}

apiBuilder.request<ModelRequest, ModelResponce>('/buy', HTTPMethod.POST, {
    count: 123,
    type: 'example',
})
```

**Generics**

`S, responce type` - responce body type, which leads to `Response.json(): Promise<S>`
`Q, request data type` - request content type, which leads to `api(data: Q)`
`H, request headers` - additional headers to be included to the request, it's data, required to be inclided to the Responce

**Args**

`endpoint` - host handle endpoint
`method` - http request method
`body` - content
`headers` - additional headers to be included to the request
`init` - limited {@link RequestInit}

Returns (request result, err)


#### Strict api handler

*This method builds api handle, which you wound use most. It creates static, strictly defined api handler*

```ts
build<S extends any, Q extends any | undefined = undefined, H extends AnyObject = T>(settings: HTTPRequestBuildSettings<H>): ApiHandle<Q, S>
```

**Example**

```ts
interface ModelResponce {
    message: string,
}

interface ModelAuth {
    password: string,
    email: string,
}

interface Service {
    /**
     * Get some info.
     */
    getInfo: ApiHandle<undefined, ModelResponce>

    /**
     * Authenticate
     */
    auth: ApiHandle<ModelAuth, ModelResponce>
}

const apiBuilder = new HTTPRequestBuilder<HTTPHeaders<ApiSpecificHeaders>>(
    'https://my-hostexample/api', {
        'Authtype': 'password',
        'Content-Type': 'application/json',
    },
);

export const service: Service = {
        
    getInfo: apiBuilder.build<ModelResponce, undefined>({
        method: HTTPMethod.GET,
        urlEndpoint: '/info',
    }),

    auth: apiBuilder.build<ModelResponce, ModelAuth>({
        method: HTTPMethod.POST,
        urlEndpoint: '/info',
        requestSpecificHeaders: {'Authtype': 'password'},
        requestInit: {
            credentials: 'include',
        }
    }),
};

```

Now your service apis are cleary defined and typed, request content and responce types are defined, which means that `body.json()` will be resolved as a, for example, `ModelResponce` by default. Default headers for this api is also specified from the time builder itself is created. Service or a group of handlers changed something? Now you don't need to deep-dive into the procedural code, just replace from one to two words, and that's it. You can create builders to specify groups of handlers, and not just one host.

#### Define request

*This method defined request, but not fully builds it, so, event it's typed, it provides a range of values, that can be managed manually, like header and method*

```ts
defineRequest<Q extends any, S extends any, M extends EnumKeys<typeof HTTPMethod> = HTTPMethod, H extends AnyObject|undefined = HTTPHeaders>(endpoint: string, init?: HTTPRequestInit): HTTPRequest<Q, S, M, H>
```

**Example**

```ts
apiBuilder.defineRequest<undefined, ModelResponce, "GET" | "POST">('/example');
```

### Requests

Results of the request are implemented in golang-like style of `res, err`, so each request is handled like this:

```ts
const [res, err] = await apiCall(...data);
if (res == null) {
    ...handle err;
};
```
