import {
  createSlice,
  createEntityAdapter,
  combineReducers,
  EntityAdapter,
  AsyncThunk,
  Reducer,
  AnyAction,
  SliceCaseReducers,
  PayloadAction,
} from '@reduxjs/toolkit';
import ThunkFactory from './thunk';

// Define the shape of your feature state
export interface FeatureState<T> {
  loading: boolean;
  success: boolean;
  error: unknown | null;
  data: T[];
  [key: string]: any;
}

// A helper type for mapping service thunks
export type ServiceMap = Record<string, AsyncThunk<any, any, any>>;

// Manager API for dynamic reducer injection
export interface ReducerManager {
  reduce: (state: any, action: AnyAction) => any;
  add: (key: string, reducer: Reducer<any, AnyAction>) => void;
  remove: (key: string) => void;
  getReducerMap: () => Record<string, Reducer<any, AnyAction>>;
}

// Assume you have a StateFactory function somewhere:
function StateFactory<T>(name: string): FeatureState<T> {
  return {
    loading: false,
    success: false,
    error: null,
    data: [],
    [name]: null,
  };
}

// The main factory, now generic in T
export function FeatureFactory<T>(
  entity: string,
  reducers: SliceCaseReducers<FeatureState<T>> = {},      // → typed slices
  endpoints: ServiceMap | null = null                     // → typed services
) {
  const factory = {
    entity,
    reducers,
    manager: ReducerManager ,
    thunk: ThunkFactory,
    state: StateFactory as (name: string) => FeatureState<T>,
    adapter: createEntityAdapter<T>() as EntityAdapter<T>, // → typed adapter
  };

  factory.manager = (initialReducers: Record<string, Reducer<any, AnyAction>> = {}) => {
    const reducersMap = { ...initialReducers };
    let combined = combineReducers(reducersMap);

    const manager: ReducerManager = {
      reduce: (state, action) => combined(state, action),
      add: (key, reducer) => {
        if (!key || reducersMap[key]) return;
        reducersMap[key] = reducer;
        combined = combineReducers(reducersMap);
      },
      remove: (key) => {
        if (!key || !reducersMap[key]) return;
        delete reducersMap[key];
        combined = combineReducers(reducersMap);
      },
      getReducerMap: () => reducersMap,
    };

    return manager;
  };

  factory.inject = <S extends object, D extends object>(source: S, dest: D): D & S => {
    Object.keys(source).forEach((k) => {
      // @ts-ignore
      dest[k] = source[k];
    });
    return dest as D & S;
  };

  factory.create = (options: { service?: ServiceMap; initialState?: FeatureState<T> } = {}) => {
    const { service, initialState } = options;
    const sliceName = factory.entity;

    const standard: ServiceMap = {
      fetch: factory.thunk.create(sliceName, 'all'),
      fetchOne: factory.thunk.create(sliceName, 'one'),
      search: factory.thunk.create(sliceName, 'search'),
    };

    const slice = createSlice({
      name: sliceName,
      initialState: initialState ?? StateFactory<T>(sliceName),
      reducers: factory.reducers,
      extraReducers: (builder) => {
        // handle standard thunks
        Object.entries(standard).forEach(([act, thunk]) => {
          builder
            .addCase(thunk.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(thunk.fulfilled, (state, action: PayloadAction<T[]>) => {
              state.loading = false;
              state.success = true;
              state.data = action.payload;
              state[sliceName] = action.payload[0];
            })
            .addCase(thunk.rejected, (state, action) => {
              state.loading = false;
              state.success = false;
              state.error = action.error;
            });
        });

        // handle extra service thunks
        if (service) {
          Object.entries(service).forEach(([key, thunk]) => {
            if (!standard[key]) {
              builder
                .addCase(thunk.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                })
                .addCase(thunk.fulfilled, (state, action: PayloadAction<any>) => {
                  state.loading = false;
                  state.success = true;
                  state.data = action.payload;
                  console.log('action fulfilled :', state.data);
                })
                .addCase(thunk.rejected, (state, action) => {
                  state.loading = false;
                  state.success = false;
                  state.error = action.payload;
                });
            }
          });
        }
      },
    });

    const asyncActions = factory.inject(standard, service ?? {});
    return { slice, asyncActions };
  };

  return factory;
}

export default FeatureFactory;
