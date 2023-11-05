import { Component, createSignal, For, onCleanup, Show } from "solid-js";
import { tinykeys } from "tinykeys";
import Help from "./Help";
import Configuration from "./Configuration";
import { useStore } from "./store";
import { validateEvent } from "./utils";
import Snippet from "./Snippet";
import NewSnippet from "./NewSnippet";

const App: Component = () => {
  const [state, { toggleHelp, accessSnippet, syncState }] = useStore();
  const [showConfig, setShowConfig] = createSignal(false);
  const [newSnippetMode, setNewSnippetMode] = createSignal(false);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [editSnippet, setEditSnippet] = createSignal(null);
  const [selectedSnippetIdx, setSelectedSnippedIdx] = createSignal(0);

  let searchInputRef;
  let newSnippetInputRef;

  const urlParams = new URLSearchParams(window.location.search);
  const searchUrlParam = urlParams.get("q");

  const snippets = () => {
    const visibleSnippets =
      state.snippets?.filter((snippet) => !snippet.deletedAt) ?? [];
    const terms = searchTerm()?.split(" ");
    const filteredSnippets = visibleSnippets?.filter((snippet) =>
      terms.every(
        (term) =>
          snippet.description?.toLowerCase()?.includes(term?.toLowerCase()) ||
          snippet.content?.toLowerCase()?.includes(term?.toLowerCase())
      )
    );
    filteredSnippets?.sort(
      (a, b) =>
        (b.lastAccessedAt ?? b.createdAt) - (a.lastAccessedAt ?? a.createdAt)
    );
    return filteredSnippets;
  };

  const onNew = () => {
    setNewSnippetMode(true);
    newSnippetInputRef?.focus();
  };

  const copySnippet = () => {
    if (newSnippetMode() || editSnippet()) {
      return;
    }

    const snippet = snippets()[selectedSnippetIdx()];
    accessSnippet(snippet?.id);

    if (!snippet) {
      return;
    }

    navigator.clipboard.writeText(snippet.content);
    setSearchTerm("");
    setSelectedSnippedIdx(0);
  };

  if (searchUrlParam) {
    setSearchTerm(searchUrlParam);
    if (snippets().length === 1) {
      copySnippet();
    }
  }

  const cleanup = tinykeys(window, {
    n: validateEvent(onNew),
    Escape: () => {
      setNewSnippetMode(false);
      setEditSnippet(null);
      searchInputRef.blur();
    },
    Enter: () => copySnippet(),
    h: validateEvent(toggleHelp),
    s: validateEvent(syncState),
    c: validateEvent(() => setShowConfig(!showConfig())),
    "$mod+k": validateEvent(() => {
      searchInputRef.focus();
    }),
    ArrowUp: (event) => {
      setSelectedSnippedIdx((oldIdx) => Math.max(oldIdx - 1, 0));
      event.preventDefault();
    },
    ArrowDown: (event) => {
      setSelectedSnippedIdx((oldIdx) =>
        Math.min(oldIdx + 1, snippets().length - 1)
      );
      event.preventDefault();
    },
  });

  onCleanup(cleanup);

  return (
    <Show when={state.help} fallback={<Help />}>
      <Show when={!showConfig()} fallback={<Configuration />}>
        <div class="flex flex-col w-full p-2 md:p-4">
          <div class="w-full max-w-8xl mx-auto">
            <form onSubmit={(event) => event.preventDefault()}>
              <input
                type="text"
                ref={searchInputRef}
                class="focus:outline-none w-full text-md placeholder:font-thin block mb-12 border-0 focus:ring-0"
                placeholder="Copy something..."
                autofocus
                value={searchTerm()}
                onInput={(event) => {
                  setSearchTerm(event?.currentTarget?.value);
                  setSelectedSnippedIdx(0);
                }}
              />
            </form>
            <div class="flex flex-col gap-4">
              <Show when={newSnippetMode()}>
                <NewSnippet
                  ref={newSnippetInputRef}
                  onEditEnd={() => setNewSnippetMode(false)}
                />
              </Show>
              <For each={snippets()}>
                {(snippet, idx) => (
                  <Show
                    when={snippet.id === editSnippet()?.id}
                    fallback={
                      <Snippet
                        id={snippet.id}
                        description={snippet.description}
                        content={snippet.content}
                        lastAccessedAt={snippet.lastAccessedAt}
                        selected={idx() === selectedSnippetIdx()}
                        onEdit={(snippet) => {
                          setEditSnippet(snippet);
                        }}
                      />
                    }
                  >
                    <NewSnippet
                      ref={newSnippetInputRef}
                      editSnippet={editSnippet()}
                      onEditEnd={() => {
                        setEditSnippet(null);
                      }}
                    />
                  </Show>
                )}
              </For>
            </div>
          </div>
        </div>
        <Show when={state?.showToast}>
          <div class="fixed bottom-0 right-0 grid gap-x-2 grid-cols-2 bg-white p-2 font-light text-sm">
            <p class="text-right">new</p>
            <p>
              {state?.new[0]} local, {state?.new[1]} remote
            </p>
            <p class="text-right">old</p>
            <p>
              {state?.dropped[0]} local, {state?.dropped[1]} remote
            </p>
          </div>
        </Show>
      </Show>
    </Show>
  );
};

export default App;
