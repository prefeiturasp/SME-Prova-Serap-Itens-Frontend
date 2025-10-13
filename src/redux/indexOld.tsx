import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from './modules/reducers';
import { applyMiddleware, legacy_createStore as createStore } from 'redux';
//import { composeWithDevTools } from '@redux-devtools/extension';

const middlewares = [thunk];

export type AppStateOld = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(
  {
    key: 'SERAP-ITEM-PERSIST',
    storage: sessionStorage,
    whitelist: ['auth', 'filtroPrincipal', 'areaConhecimento', 'disciplina', 'matriz', 'item'],
  },
  rootReducer,
  
);

const storeOld = createStore(persistedReducer, applyMiddleware(...middlewares));

const persistorOld = persistStore(storeOld);

export { storeOld, persistorOld };
