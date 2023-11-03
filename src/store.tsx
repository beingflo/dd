import { createContext, createEffect, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

export const getNewId = () => crypto.randomUUID();

export const storeName = "store";

const StoreContext = createContext({});

const localState = localStorage.getItem(storeName);

export const [state, setState] = createStore(
  localState ? JSON.parse(localState) : {}
);

export function StoreProvider(props) {
  createEffect(() => localStorage.setItem(storeName, JSON.stringify(state)));

  const store = [
    state,
    {
      toggleHelp() {
        setState({ help: !state.help });
      },
      setS3Config(config: Object) {
        setState({ s3: config });
      },
      accessSnippet(id: string) {
        setState(
          produce((state: any) => {
            state.snippets.forEach((snippet) => {
              if (snippet.id === id) {
                snippet.lastAccessedAt = Date.now();
              }
            });
          })
        );
      },
      newSnippet(description: string, content: string) {
        setState({
          snippets: [
            ...(state.snippets ?? []),
            {
              id: getNewId(),
              description,
              content,
              createdAt: Date.now(),
              lastAccessedAt: null,
              deletedAt: null,
            },
          ],
        });
      },
      updateSnippet(id: string, description: string, content: string) {
        setState(
          produce((state: any) => {
            state.snippets.forEach((snippet) => {
              if (snippet.id === id) {
                snippet.description = description;
                snippet.content = content;
                snippet.lastAccessedAt = Date.now();
              }
            });
          })
        );
      },
      deleteSnippet(id: string) {
        setState(
          produce((state: any) => {
            state.snippets.forEach((snippet) => {
              if (snippet.id === id) {
                snippet.deletedAt = Date.now();
              }
            });
          })
        );
      },
    },
  ];

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext) as any;
}
