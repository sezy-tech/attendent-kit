import { get as _get, capitalize, isObject } from 'lodash';
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import storage from '../storage';

export type StoreSelectorType<T> = <V>(s: (state: T) => V) => V;
interface ReturnStore<T, A, G, M> {
  // data: { state: T }
  readonly state: T;
  dispatch: StoreDispatch<T>;
  transite: (newStatus: M) => void;
  getters: G;
  actions: A;
}

type CreateStoreReturnType<T, A, G, M, N extends string> = {
  [K in `use${Capitalize<N>}Store`]: () => ContextValues<T, A, G, M> & {
    select: StoreSelectorType<T>;
  };
} & {
  [K in `${Capitalize<N>}StoreProvider`]: ({
    children,
  }: StoreProviderProps) => React.JSX.Element;
} & { [K in `${N}Store`]: ReturnStore<T, A, G, M> };

type Subscriber<T> = (state: T) => void;
// type StoreDispatch<T> = (fn: (state: T) => T) => void
type StoreDispatch<T> = (fn: (state: T) => void) => void;
// export type StoreActions = { [key: string]: (this: ReturnStore<T, A, G, M>, ...args: any[]) => void }
// export type StoreGetters = { [key: string]: (this: ReturnStore<T, A, G, M>, ...args: any[]) => any }
export type StoreActions = { readonly [key: string]: (...args: any[]) => void };
export type StoreGetters = { readonly [key: string]: (...args: any[]) => any };

type Transition<T, A, G, M extends string> = (
  store: ReturnStore<T, A, G, M>,
) => void;
type Transitions<T, A, G, M extends string> = {
  [O in M | 'ANY']?: {
    [N in Exclude<M | 'ANY', O>]?: Transition<T, A, G, M>;
  };
};

export interface StateMachine<T, A, G, M extends string> {
  currentState: M;
  startTransition?: Transition<T, A, G, M>;
  transitions: Transitions<T, A, G, M>;
}

type Test<A extends StoreActions> = {
  [key in keyof A]?: (...args: Parameters<A[key]>) => void;
};
interface CreateStoreProps<
  T,
  A extends StoreActions,
  G extends StoreGetters,
  M extends string,
  N extends string,
> {
  name: N;
  state: T;
  onMounted?: (state: T, dispatch: StoreDispatch<T>) => void;
  onStorageLoaded?: (state: T, dispatch: StoreDispatch<T>) => void;
  stateMachine?: StateMachine<T, A, G, M>;
  getters?: G & ThisType<ReturnStore<T, A, G, M>>;
  actions: A & ThisType<ReturnStore<T, A, G, M>>;
  efftects?: Test<A>;
  persist?: boolean;
  // storage?:
}

interface StoreProviderProps {
  children: React.ReactNode;
}

interface Selector<T> {
  s: (state: T) => any;
  v: any;
}

interface ContextValues<T, A, G, M> {
  data: {
    state: T;
  };
  dispatch: StoreDispatch<T>;
  getters: G;
  actions: A;
  // getters: ReturnGetters<G>
  // actions: ReturnActions<A>
  subscribe: (subscriber: Subscriber<T>) => void;
  unSubscribe: (subscriber: Subscriber<T>) => void;
}
// this: ReturnStore<T, A, G, M>,
export function createStore<
  T,
  A extends StoreActions,
  G extends StoreGetters,
  M extends string,
  N extends string,
>({
  name,
  state: initialState,
  onMounted,
  onStorageLoaded,
  stateMachine,
  getters,
  actions,
  efftects,
  persist = true,
}: CreateStoreProps<T, A, G, M, N>): CreateStoreReturnType<T, A, G, M, N> {
  const storeName = `${capitalize(name)}Store`;
  const storageName = `${name}Store`;

  const data = {
    state: initialState,
  };
  Object.defineProperty(data, 'state', {
    writable: false,
  });

  // const subscribersRef = useRef([] as Subscriber[])
  const subscribersRef = { current: [] as Subscriber<T>[] };

  // console.log('++++++++++++++++++++++===========================')
  // const dispatch: StoreDispatch<T> = (fn: (state: T) => T) => {
  const dispatch: StoreDispatch<T> = (fn: (state: T) => void) => {
    // console.log('=======dispatch==========')
    // console.log(subscribersRef.current)
    fn(data.state);
    // const newState = fn(data.state)
    // data.state = newState
    subscribersRef.current.forEach(subscriber => subscriber(data.state));
    persist &&
      storage.save({
        key: storageName,
        data: data.state,
        // expires: 1000 * 60
      });
  };

  const contextValue: ContextValues<T, A, G, M> = {
    data,
    dispatch,
    getters: {} as G,
    actions: {} as A,
    subscribe: (subscriber: Subscriber<T>) => {},
    unSubscribe: (subscriber: Subscriber<T>) => {},
  };

  const newGetters = Object.fromEntries(
    Object.entries(getters ?? ({} as any)).map(
      ([k, v]) =>
        // [k, (...args: Parameters<typeof v>) => v.bind(store)(...args) as any]
        [k, (...args: any[]) => (v as any).bind(store)(...args) as any],
      // )) as { [key in keyof G]: (...args: Parameters<G[key]>) => (...args) => T }
    ),
  ) as any;

  // const newActions = Object.fromEntries(Object.entries(actions).map(
  //   ([k, v]) =>
  //     [k, (...args: Parameters<typeof v>) => dispatch(() => v(...args) as any)]
  // )) as { [key in keyof S]: (...args: Parameters<S[key]>) => (...args) => void }
  const newActions = Object.fromEntries(
    Object.entries(actions).map(([k, v]) => [
      k,
      (...args: Parameters<typeof v>) => {
        dispatch(() => v.bind(store)(...args));
        (efftects?.[k] as any)?.(...args);
      },
    ]),
  ) as any;

  //@typescript-eslint/no-empty-function
  const Context = createContext(contextValue);

  const Provider = ({ children }: StoreProviderProps) => {
    const data = {
      state: initialState,
    };

    // const [state, dispatch] = useReducer(reducers, { count: 0, path: '/login' });
    // const [state, dispatch] = useReducer((state: T, action: (state: T) => T) => action(state), initialState)

    const subscribe = (subscriber: Subscriber<T>) => {
      subscribersRef.current.push(subscriber);
      // console.log('=======subscribe==========')
      // console.log(subscribersRef.current)
    };
    const unSubscribe = (subscriber: Subscriber<T>) => {
      // console.log('=======un-subscribe==========')
      const subscribers = subscribersRef.current;
      subscribers.splice(subscribers.indexOf(subscriber), 1);
      // console.log(subscribersRef.current)
    };

    useEffect(() => {
      onMounted?.(initialState, dispatch);
      // !persist && onMounted?.(initialState, dispatch)
    }, []);

    const contextValue = {
      data,
      dispatch,
      getters: newGetters as any,
      actions: newActions as any,
      subscribe,
      unSubscribe,
      // getters: newGetters as { [key in keyof G]: (payload: Parameters<G[key]>[1]) => ReturnType<G[key]> },
      // actions: newActions as { [key in keyof R]: (payload: Parameters<R[key]>[1]) => void },
    };

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
  };

  function useStore<T>(context: React.Context<T>) {
    const [rerender, setRerender] = useState(false);
    const store = useContext(context);
    const selectorList = useMemo(() => [] as Selector<T>[], []);
    const anyStore = store as any;

    useLayoutEffect(() => {
      const subscriber = (newState: T) => {
        // console.log('+++++++++++++++++++++++++++subscriber')
        // console.log(selectorList)
        for (const selector of selectorList) {
          const { s, v } = selector;
          const newValue = s(newState);
          if (newValue !== v) {
            selector.v = newValue;
            return setRerender(state => !state);
          }
        }
      };
      anyStore.subscribe(subscriber);
      return () => anyStore.unSubscribe(subscriber);
    }, []);

    const select = (s: <V>(state: T) => V) => {
      useMemo(() => {
        selectorList.push({
          s,
          v: s(data.state as any),
        });
      }, []);
      // console.log('===========================Select')
      // console.log(data.state)
      return s(data.state as any);
    };

    return {
      ...store,
      select,
    };
  }

  const stateMachineData = {
    current: (stateMachine?.currentState ?? '') as M,
  };

  const store = {
    // data: data,
    state: data.state,
    dispatch,
    getters: newGetters as any,
    actions: newActions,
    transite: function (newStatus: M) {
      if (!stateMachine?.transitions) return;
      const previousStatus = stateMachineData.current;
      stateMachineData.current = newStatus;

      const newTransition: [M, M][] = [
        [previousStatus, 'ANY' as M],
        ['ANY' as M, newStatus],
        [previousStatus, newStatus],
      ];
      newTransition.forEach(([ps, ns]) => {
        const nextState = stateMachine.transitions[ps]?.[ns]?.(this);
        // nextState !== undefined && this.transite(nextState)
      });
    },
  };

  if (persist) {
    async function loadStorage() {
      // console.log('=---------------loadStorage------------------');
      return await storage
        .load({
          key: storageName,
        })
        .then(newData => {
          console.log('+++++++++++++++++++++loadStorage+++++++++++++++++++');
          // console.log(storageName)
          // data.state = {
          //   ...data.state,
          //   ...newData
          // }
          const state = data.state as any;
          for (const key in newData) {
            // if (state.hasOwnProperty(key)) {
            state[key] = newData[key];
            // }
          }
        })
        .catch(err => {
          // console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
          // console.log(err.message);
          switch (err.name) {
            case 'NotFoundError':
              // TODO;
              break;
            case 'ExpiredError':
              // TODO
              break;
          }
        })
        .finally(() => {
          stateMachine?.startTransition?.(store);
          onStorageLoaded?.(initialState, dispatch);
        });
    }
    loadStorage();
  }

  return {
    [`use${storeName}`]: () => useStore(Context),
    [`${storeName}Provider`]: Provider,
    [storageName]: store,
  } as any;
}

interface StoreProviderProps2 {
  providers: (({ children }: StoreProviderProps) => React.JSX.Element)[];
  children: React.ReactNode;
}
export const StoreProvider = ({ providers, children }: StoreProviderProps2) =>
  providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);

// interface A {
//   b: {
//     c(this: { b: any, c: any }): any;
//   };
// }

// const a: A = {
//   b: {
//     c(payload) {
//       return this.;
//     }
//   }
// };

// interface ReturnValues<S> {
//   setter: S
// }

// type Setter<S> = (this: ReturnValues<S>, ...args: any[]) => void

// interface Props<S extends Setter<S>> {
//   setter: S
// }

// const aaaa = <S extends Setter<S>>(props: Props<S>): ReturnValues<S> => {

//   return {
//     setter: props.setter
//   }
// }

// const bbb = aaaa({
//   setter(payload: number) {
//     this.setter('sdf')
//   }
// })
