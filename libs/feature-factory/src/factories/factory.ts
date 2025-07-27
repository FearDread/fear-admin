// index.ts
import {
  createSlice,
  createEntityAdapter,
  combineReducers,
  SliceCaseReducers,
  EntityAdapter,
  Slice,
  ActionReducerMapBuilder,
  AnyAction,
  AsyncThunk
} from '@reduxjs/toolkit';
import ThunkFactory from './thunk';
import { StateFactory } from './state';  // assume you have this

// A map of async thunks
export interface ServiceMap {
  [key: string]: AsyncThunk<any, any, any>;
}

// Manager interface for dynamic reducers
export interface Manager<S> {
  reduce(state: S | undefined, action: AnyAction): S;
  add(key: string, reducer: (state: any, action: AnyAction) => any): void;
  remove(key: string): void;
  getReducerMap(): Record<string, (state: any, action: AnyAction) => any>;
}

// Factory return type
export interface FactoryReturn<S> {
  entity: string;
  reducers: SliceCaseReducers<S>;
  thunk: typeof ThunkFactory;
  state: typeof StateFactory;
  adapter: EntityAdapter<any>;
  manager(initialReducers?: Record<string, (state: any, action: AnyAction) => any>): Manager<any>;
  inject<T, D>(source: T, dest: D): T & D;
  create(options?: { service?: ServiceMap; initialState?: S }): {
    slice: Slice<ReturnType<typeof StateFactory>>;
    asyncActions: ServiceMap;
  };
}

export function FeatureFactory<S = any>(
  entity: string,
  reducers: SliceCaseReducers<S> = {} as SliceCaseReducers<S>,
  endpoints: ServiceMap | null = null
): FactoryReturn<S> {
  const factory = {
    entity,
    reducers,
    thunk: ThunkFactory,
    state: StateFactory,
    adapter: createEntityAdapter<any>()
  };

  // Manager for adding/removing reducers dynamically
  factory.manager = (initialReducers: Record<string, any> = {}) => {
    const reducersMap: Record<string, any> = { ...initialReducers };
    let combined = combineReducers(reducersMap);

    return {
      reduce: (state: any, action: AnyAction) => combined(state, action),
      add: (key: string, reducer: any) => {
        if (!key || reducersMap[key]) return;
        reducersMap[key] = reducer;
        combined = combineReducers(reducersMap);
      },
      remove: (key: string) => {
        if (!key || !reducersMap[key]) return;
        delete reducersMap[key];
        combined = combineReducers(reducersMap);
      },
      getReducerMap: () => reducersMap
    };
  };

  // Generic injector
  factory.inject = <T, D>(source: T, dest: D): T & D => {
    for (const prop in source) {
      if (Object.prototype.hasOwnProperty.call(source, prop)) {
        // @ts-ignore
        dest[prop] = source[prop];
      }
    }
    return dest as T & D;
  };

  // Create slice + async thunks
  factory.create = (options = {} as { service?: ServiceMap; initialState?: S }) => {
    const { service, initialState } = options;
    const sliceName = factory.entity;

    // Standard async actions
    const standard: ServiceMap = {
      fetch: factory.thunk.create(sliceName, 'all'),
      fetchOne: factory.thunk.create(sliceName, 'one'),
      search: factory.thunk.create(sliceName, 'search')
    };

    const slice = createSlice({
      name: sliceName,
      initialState: StateFactory(sliceName, initialState),
      reducers: factory.reducers,
      extraReducers: (builder: ActionReducerMapBuilder<any>) => {
        // Handle standard thunks
        for (const act in standard) {
          if (standard.hasOwnProperty(act)) {
            builder
              .addCase(standard[act].pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(standard[act].fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
                if (act === 'fetchOne') {
                  state[sliceName] = action.payload[0];
                } else {
                  state[sliceName] = action.payload[0];
                }
              })
              .addCase(standard[act].rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error;
              });
          }
        }

        // Handle custom service thunks
        if (service) {
          for (const key in service) {
            if (service.hasOwnProperty(key) && !standard.hasOwnProperty(key)) {
              builder
                .addCase(service[key].pending, (state) => {
                  state.loading = true;
                  state.error = null;
                })
                .addCase(service[key].fulfilled, (state, action) => {
                  state.loading = false;
                  state.success = true;
                  state.data = action.payload;
                  console.log('action fulfilled :', state.data);
                })
                .addCase(service[key].rejected, (state, action) => {
                  state.loading = false;
                  state.success = false;
                  state.error = action.payload;
                });
            }
          }
        }
      }
    });

    // Merge standard + custom actions
    const asyncActions = factory.inject<ServiceMap, ServiceMap>(
      standard,
      service ? service : {}
    );

    return { slice, asyncActions };
  };

  return factory as FactoryReturn<S>;
}

export default FeatureFactory;
