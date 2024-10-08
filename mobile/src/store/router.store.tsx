import { createContext, useContext, useRef, useState } from 'react';
import { createStore } from '../core/redux-context';
import { toPairs } from 'lodash';

interface State {
  path: string;

  history: {
    path: string;
  }[];
  current: {
    // route?: CurrentRouter,
    name: string;
    query: { [key: string]: string };
    params: { [key: string]: string };
  };
}

const state: State = {
  path: '',
  history: [],
  current: {
    name: '',
    // route: {} as CurrentRouter,
    query: {} as { [key: string]: string },
    params: {} as { [key: string]: string },
  },
};

export const { useRouterStore, RouterStoreProvider, routerStore } = createStore(
  {
    name: 'router',
    state,
    actions: {
      navigate(path: string, query?: { [key: string]: any }) {
        const pairs = toPairs(query);
        const queryString = pairs.length
          ? `?${pairs
              .map(pair => pair.map(encodeURIComponent).join('='))
              .join('&')}`
          : '';
        const newPath = `${path}${queryString}`;

        if (state.path === newPath) return state;
        state.path = newPath;
        state.history.push({ path: newPath });
      },
      back() {
        const currentRoute = state.history.pop();
        const previousRoute = state.history[state.history.length - 1];
        previousRoute && (state.path = previousRoute.path);
      },
    },
  },
);
export const RoutingConsumerContext = createContext({
  current: {
    name: '',
    query: {} as { [key: string]: string | undefined },
    params: {} as { [key: string]: string | undefined },
    route: {} as Router,
  },
});

interface Router {
  readonly path: string;
  readonly name?: string;
  readonly element: JSX.Element;
}

interface CurrentRouter {
  readonly path: string;
  readonly routePath: string;
  readonly name?: string;
  readonly element: JSX.Element;
}

interface RoutingConsumerProps {
  routes: Router[];
}
export const RouterStoreConsumer = ({
  routes: rawRouters,
}: RoutingConsumerProps) => {
  const router = useRouterStore();
  const routeRef = useRef({
    name: '',
    route: {} as CurrentRouter,
    query: {} as { [key: string]: string },
    params: {} as { [key: string]: string },
  });

  const routes = rawRouters.map(route => ({
    ...route,
    ...routePathToRegex(route.path),
  }));

  const rawPath = router.select(state => state.path);
  // console.log(
  //   '================================RouterStoreConsume+++++++++++++++++++++++++++++++++++++++++',
  // );
  // console.log(rawPath);

  const pathArray = rawPath.split('/');
  const [lastPath, queryString] = pathArray.slice(-1).toString().split('?');
  const path = [...pathArray.slice(0, -1), lastPath].join('/');

  const getRoute = () => {
    // console.log('----------------path');
    // console.log(state.path);
    for (const route of routes) {
      // console.log(route)
      // console.log(route.pathRegex.test(state.path))
      if (route.pathRegex.test(path)) {
        // console.log('+++++++++++++++++++++++++++route match++++++');
        // console.log(route);
        const match = path.match(route.pathRegex);
        const params = Object.fromEntries(
          route.paramNames.map((name, i) => [name, match?.[i + 1]]) ?? [],
        ) as any;
        const query = Object.fromEntries(
          path
            .split('/')
            .slice(-1)
            .toString()
            .split('?')[1]
            ?.split('&')
            .map(param => param.split('=')) ?? [],
        ) as any;

        const name = route.name ?? '';
        routeRef.current.name = name;
        routeRef.current.query = query;
        routeRef.current.params = params;
        routeRef.current.route = {
          ...route,
          routePath: route.path,
          path,
        };

        routerStore.state.current = {
          name,
          query,
          params,
        };
        // routerStore.dispatch((state) => {
        //   state.current = {
        //     name,
        //     query,
        //     params,
        //   }
        // })
        console.log(routerStore.state.current);
        return route.element;
      }
    }
    return <></>;
  };
  return (
    <RoutingConsumerContext.Provider value={routeRef}>
      {getRoute()}
    </RoutingConsumerContext.Provider>
  );
};

function routePathToRegex(path: string) {
  const paramNames = [] as string[];
  const regexString = path
    .split('/')
    .map((p, i, a) => {
      const newP = i === a.length - 1 ? p.split('?')[0] : p;
      if (/^:[\w-_]+$/g.test(newP)) {
        paramNames.push(newP.slice(1));
        return `([\\w-_]+)`;
      }
      if (newP.slice(-1) === '*') return `${newP.slice(0, -1)}[/\\w-_]*`;

      const paramReges = /^[\w-_]+?(([\w-_]+)=([\w-_]+))*$/g;
      if (i === a.length - 1 && paramReges.test(newP)) return newP;
      return newP;
    })
    .join('/');

  const pathRegex = new RegExp(`^${regexString}$`);

  return {
    pathRegex,
    paramNames,
  };
}

export const useRouter = () => {
  const { current } = useContext(RoutingConsumerContext);
  const routerStore = useRouterStore();
  return {
    getPath: () => routerStore.select(state => state.path),
    getHistory: () => routerStore.select(state => state.history),
    ...routerStore.actions,
    select: routerStore.select,
    current,
  };
};
