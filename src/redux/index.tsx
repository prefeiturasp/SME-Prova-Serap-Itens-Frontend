import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import rootReducerNovo from './modules/reducersNovo';
import { composeWithDevTools } from '@redux-devtools/extension';

const middlewares = [thunk];

export type AppState = ReturnType<typeof rootReducerNovo>;

const persistedReducer = persistReducer(
  {
    key: 'SERAP-ITEM-PERSIST',
    storage: sessionStorage,
    whitelist: ['auth', 'filtroPrincipal', 'areaConhecimento', 'disciplina', 'matriz', 'item', 'configuracaoItemNovo', 'elaboracaoItemNovo'],
  },
  rootReducerNovo,
  
);

const store = createStore(
  persistedReducer, 
  composeWithDevTools(applyMiddleware(...middlewares))
);

// 🔍 Disponibilizar store globalmente para debug no console
if (typeof window !== 'undefined') {
  (window as any).__REDUX_STORE__ = store;
}

const persistor = persistStore(store);

export { store, persistor };
