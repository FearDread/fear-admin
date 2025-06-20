import { configureStore } from '@reduxjs/toolkit';
import { manager } from '../manager';
import { factory } from '../factory';
import baseReducer from './baseReducer';

export default sliceStore = () => {
  const reducerManager = manager({ base: baseReducer });

  const store = configureStore({
    reducer: manager.reduce,
  });

  store.factory = factory;
  store.manager = manager;



  return store;
}