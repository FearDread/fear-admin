declare module '@/lib/api-factory' {
  export interface BaseQueryConfig {
    baseUrl: string;
    timeout?: number;
    credentials?: RequestCredentials;
    prepareHeaders?: (headers: Headers, api: { getState: () => unknown }) => Headers;
  }

  export interface FactoryOptions {
    tagTypes?: string[];
    baseQuery?: Partial<BaseQueryConfig>;
    includeStandardEndpoints?: boolean;
  }

  export interface ApiFactoryInstance {
    sliceName: string;
    entityTagType: string;
    baseApi: unknown;
    inject: (endpointName: string, config: unknown) => unknown;
    injectMany: (endpoints: Record<string, unknown>) => unknown;
    create: () => any; // the RTK Query api slice (with hooks attached)
    createStandard: () => any;
    createBulk: () => any;
    createCustom: (name: string, config: unknown) => any;
    getTagTypes: () => string[];
    getBaseUrl: () => string;
    getReducerPath: () => string;
    withAuth: (token: string) => ApiFactoryInstance;
    withBaseUrl: (url: string) => ApiFactoryInstance;
  }

  export interface ApiFactoryFn {
    (sliceName: string, options?: FactoryOptions): ApiFactoryInstance;
    createComplete: (sliceName: string, options?: FactoryOptions) => any;
    createCustom: (
      sliceName: string,
      endpoints: Record<string, unknown>,
      options?: FactoryOptions,
    ) => any;
    getStandardEndpoints: () => Record<string, unknown>;
    getHttpMethods: () => Record<string, string>;
  }

  export const ApiFactory: ApiFactoryFn;
  export const FeatureFactory: unknown;
  export const StateFactory: unknown;
  export const ThunkFactory: unknown;
  export const CacheFactory: unknown;
  export const CrudFactory: unknown;
  export const API: unknown;
}
