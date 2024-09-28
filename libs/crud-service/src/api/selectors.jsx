import { createSelector } from "reselect";

const selectCrud = (state) => state.crud;

export const currentItem = createSelector([selectCrud],(crud) => crud.current);
export const listItems = createSelector([selectCrud],(crud) => crud.list);
export const itemById = (itemId) => createSelector(selectListItems, 
  (list) => list.result.items.find((item) => item._id === itemId));

export const createdItem = createSelector([selectCrud],(crud) => crud.create);
export const updatedItem = createSelector([selectCrud],(crud) => crud.update);
export const readItem = createSelector([selectCrud], (crud) => crud.read);
export const deletedItem = createSelector([selectCrud],(crud) => crud.delete);
export const searchItems = createSelector([selectCrud],(crud) => crud.search);