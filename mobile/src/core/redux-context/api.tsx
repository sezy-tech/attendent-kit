import { capitalize, isArray, isObject } from 'lodash';

export type CreateApiReturnType<E extends ApiEndpoints, S, N extends string> = {
  [K in `use${Capitalize<N>}Api`]: () => ReturnApi<E, S>;
} & { [K in `${N}Api`]: ReturnApi<E, S> };

interface ApiRequestProps {
  path?: string;
  auth?: boolean;
  // permissions?:
}

type ApiMethodOptions<I, O> = {
  // params?: I
  // body?: I
  // success?: (r: O) => void
  // error?: (e: any) => void
};

type GetMethodRequest = <I = unknown, O = unknown>(
  requestProps: ApiRequestProps,
  apiMethodResponse?: ApiMethodOptions<I, O>,
) => (requestData: I) => HttpResponse<O>;
type PostMethodRequest = <I = unknown, O = unknown>(
  requestProps: ApiRequestProps,
  apiMethodResponse?: ApiMethodOptions<any, O>,
) => (requestData: I) => HttpResponse<O>;

interface ApiRequest {
  get: GetMethodRequest;
  post: PostMethodRequest;
  put: PostMethodRequest;
  patch: PostMethodRequest;
  delete: PostMethodRequest;
}

interface ApiEndpointsProps {
  request: ApiRequest;
}

// type ApiEndpoint = (...args: any[]) => ReturnType<ApiRequest[keyof ApiRequest]>
export type ApiEndpoints = {
  [key: string]: (...args: any[]) => ReturnType<ApiRequest[keyof ApiRequest]>;
};
// type ApiEndpointsWrapper<E> = (endpointProps: ApiEndpointsProps) => E
// type Services = { [key: string]: <A extends unknown[]>(...args: A) => ReturnType<ApiRequest[keyof ApiRequest]> }

export type ApiServices = { [key: string]: (...args: any[]) => void };

interface ApiAuth {
  type?: 'Bearer';
  authenticate: () => string | undefined;
  // authenticateFail: (httpResponse: HttpResponse<unknown>) => void,
  authorize?: () => boolean;
}

type ApiResponseStatusHandlers = {
  [key: number]: (httpResponse: HttpResponse<unknown>) => void;
};

// type UnknowFunctionParam<T>

interface ReturnApi<E extends ApiEndpoints, S> {
  endpoints: {
    [key in keyof E]: (
      ...args: [
        ...Parameters<E[key]>,
        ...(Parameters<ReturnType<E[key]>>[0] extends infer R
          ? unknown | undefined extends R
            ? []
            : [requestData: R]
          : []),
      ]
    ) => ReturnType<ReturnType<E[key]>>;
  };

  services: S;
}

export interface CreateApiProps<E extends ApiEndpoints, S, N> {
  name: N;
  baseUrl: string;
  endpoints: (endpointProps: ApiEndpointsProps) => E;
  services: S & ThisType<ReturnApi<E, S>>;
  auth?: ApiAuth;
  responseStatusHandlers?: ApiResponseStatusHandlers;
}

export function createApi<
  E extends ApiEndpoints,
  S extends ApiServices,
  N extends string,
>(createApiProps: CreateApiProps<E, S, N>): CreateApiReturnType<E, S, N> {
  const { name, baseUrl, endpoints, services, auth, responseStatusHandlers } =
    createApiProps;
  const getMethod =
    (
      requestProps: ApiRequestProps,
      apiMethodResponse?: ApiMethodOptions<any, any>,
    ) =>
    (requestData: any) =>
      httpRequest(
        'get',
        requestData,
        createApiProps,
        requestProps,
        apiMethodResponse,
      );
  const postMethod =
    (
      requestProps: ApiRequestProps,
      apiMethodResponse?: ApiMethodOptions<any, any>,
    ) =>
    (requestData: any) =>
      httpRequest(
        'post',
        requestData,
        createApiProps,
        requestProps,
        apiMethodResponse,
      );
  const putMethod =
    (
      requestProps: ApiRequestProps,
      apiMethodResponse?: ApiMethodOptions<any, any>,
    ) =>
    (requestData: any) =>
      httpRequest(
        'update',
        requestData,
        createApiProps,
        requestProps,
        apiMethodResponse,
      );
  const patchMethod =
    (
      requestProps: ApiRequestProps,
      apiMethodResponse?: ApiMethodOptions<any, any>,
    ) =>
    (requestData: any) =>
      httpRequest(
        'patch',
        requestData,
        createApiProps,
        requestProps,
        apiMethodResponse,
      );
  const deleteMethod =
    (
      requestProps: ApiRequestProps,
      apiMethodResponse?: ApiMethodOptions<any, any>,
    ) =>
    (requestData: any) =>
      httpRequest(
        'delete',
        requestData,
        createApiProps,
        requestProps,
        apiMethodResponse,
      );
  const endpointRequest = endpoints({
    request: {
      get: getMethod as any,
      post: postMethod as any,
      put: putMethod as any,
      patch: patchMethod as any,
      delete: deleteMethod as any,
    },
  });

  const newEndpoints = Object.fromEntries(
    Object.entries(endpointRequest).map(([k, v]) => [
      k,
      (requestData: any, ...args: Parameters<typeof v>) =>
        (v(...args) as any)(requestData),
    ]),
  ) as any;
  // ))) as { [key in keyof ReturnType<typeof endpoints>]: ReturnType<ReturnType<typeof endpoints>[key]> }
  // ))) as { [key in keyof ReturnType<typeof endpoints>]: ReturnType<typeof endpoints>[key] }

  const newServices = Object.fromEntries(
    Object.entries(services).map(([k, v]) => [
      k,
      (...args: any[]) => v.bind(apiStore)(...args),
    ]),
  ) as any;
  // )) as { [key in keyof S]: (payload: Parameters<S[key]>[1]) => (endpoints: T) => void
  //   }

  const apiStore = {
    endpoints: newEndpoints,
    services: newServices,
  };
  const useApi = () => {
    return apiStore;
  };

  const apiName = capitalize(name);
  return {
    [`use${apiName}Api`]: useApi,
    [`${name}Api`]: apiStore,
  } as any;
}

interface HttpResponse<O> {
  status: number;
  data?: any;
  error?: string;
}

async function httpRequest<I, O>(
  method: string,
  requestData: I,
  { baseUrl, auth, responseStatusHandlers }: CreateApiProps<any, any, any>,
  { path = '', auth: hasAuth = true }: ApiRequestProps,
  apiMethodOptions: ApiMethodOptions<any, any> = {},
) {
  const params = method.toUpperCase() === 'GET' ? requestData : undefined;
  const body = method.toUpperCase() !== 'GET' ? requestData : undefined;

  const paramsString = params
    ? (() => {
        if (isObject(params))
          return `?${Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')}`;
        if (isArray(params)) {
          //To do
        }

        return `/${params}`;
      })()
    : undefined;

  const newUrl = params
    ? `${baseUrl}${path}${paramsString}`
    : `${baseUrl}${path}`;
  // console.log('========++++++++++++++++++++httpRequest')
  // console.log(newUrl)
  // console.log(method)
  // console.log(params)
  // console.log(body)

  const httpResponse: HttpResponse<O> = {
    status: 0,
    data: undefined,
    error: undefined,
  };

  const headers: HeadersInit_ = {
    'Content-Type': 'application/json',
  };

  hasAuth &&
    (headers['Authorization'] = `Bearer ${auth?.authenticate() ?? ''}`);
  try {
    const response = await fetch(newUrl, {
      method,
      headers,
      body: body && JSON.stringify(body),
    });

    httpResponse.status = response.status;
    if (response.ok) {
      const data = await response.json();
      httpResponse.data = data;
      // console.log('Success:', data);
    } else {
      // console.error('Network response was not ok');
      httpResponse.error = 'Network response was not ok';
    }
  } catch (error) {
    httpResponse.error = String(error);
    // console.error('There was a problem with the fetch operation:', error);
  }

  httpResponse.status &&
    responseStatusHandlers?.[+httpResponse.status]?.(httpResponse);
  console.log(`${newUrl}___${httpResponse.status}`);
  return httpResponse;
}
