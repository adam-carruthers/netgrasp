import {
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import fullGraph from "./slices/fullGraphSlice";
import view from "./slices/viewSlice";
import highlighted from "./slices/highlightedSlice";
import ongoingEdit from "./slices/ongoingEditSlice";
import subsetViews from "./slices/subsetViewsSlice";
import paths from "./slices/pathsSlice";
import selectedPath from "./slices/selectedPathSlice";
import pathView from "./slices/pathViewSlice";
import pinGroups from "./slices/pinGroupsSlice";
import nodeGroups from "./slices/nodeGroupsSlice";
import textboxes from "./slices/textboxesSlice";

const rootReducer = combineReducers({
  fullGraph,
  view,
  highlighted,
  ongoingEdit,
  subsetViews,
  paths,
  selectedPath,
  pathView,
  pinGroups,
  nodeGroups,
  textboxes,
});

const persistConfig = {
  key: "rootPersist",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

export default store;
