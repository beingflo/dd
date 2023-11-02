import { Component, createSignal, For, onCleanup, Show } from "solid-js";
import { tinykeys } from "tinykeys";
import Help from "./Help";
import Configuration from "./Configuration";
import { useStore } from "./store";
import { validateEvent } from "./utils";
import Link from "./Link";
import NewLink from "./NewLink";
import { s3Sync } from "./s3-utils";
import Import from "./Import";

const App: Component = () => {
  const [state, { toggleHelp, accessLink }] = useStore();
  const [showConfig, setShowConfig] = createSignal(false);
  const [newLinkMode, setNewLinkMode] = createSignal(false);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [editLink, setEditLink] = createSignal(null);
  const [selectedLinkIdx, setSelectedLinkIdx] = createSignal(0);
  const [showImport, setShowImport] = createSignal(false);
  const [dropped, setDropped] = createSignal([0, 0]);
  const [showToast, setShowToast] = createSignal(false);
  const [syncing, setSyncing] = createSignal(false);

  let searchInputRef;
  let newLinkInputRef;

  const syncState = async () => {
    if (!syncing()) {
      const droppedLinks = await s3Sync(state);
      setDropped(droppedLinks ?? [0, 0]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setSyncing(true);
      setTimeout(() => setSyncing(false), 500);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const searchUrlParam = urlParams.get("q");

  const links = () => {
    const visibleLinks = state.links?.filter((link) => !link.deletedAt) ?? [];
    const terms = searchTerm()?.split(" ");
    const filteredLinks = visibleLinks?.filter((link) =>
      terms.every(
        (term) =>
          link.url?.toLowerCase()?.includes(term?.toLowerCase()) ||
          link.description?.toLowerCase()?.includes(term?.toLowerCase())
      )
    );
    filteredLinks?.sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
    return filteredLinks;
  };

  const onNew = () => {
    setNewLinkMode(true);
    newLinkInputRef?.focus();
  };

  const followLink = (newTab: boolean) => {
    if (newLinkMode() || editLink()) {
      return;
    }
    const link = links()[selectedLinkIdx()];
    accessLink(link?.id);
    setSelectedLinkIdx(0);

    if (!link) {
      return;
    }

    if (newTab) {
      window.open(link?.url);
      setSearchTerm("");
    } else {
      location.href = link?.url;
    }
  };

  if (searchUrlParam) {
    setSearchTerm(searchUrlParam);
    if (links().length === 1) {
      followLink(false);
    }
  }

  const cleanup = tinykeys(window, {
    n: validateEvent(onNew),
    Escape: () => {
      setNewLinkMode(false);
      setEditLink(null);
      searchInputRef.blur();
    },
    Enter: () => followLink(false),
    "$mod+Enter": () => followLink(true),
    h: validateEvent(toggleHelp),
    s: validateEvent(syncState),
    i: validateEvent(() => setShowImport((old) => !old)),
    c: validateEvent(() => setShowConfig(!showConfig())),
    "$mod+k": validateEvent(() => {
      searchInputRef.focus();
    }),
    ArrowUp: (event) => {
      setSelectedLinkIdx((oldIdx) => Math.max(oldIdx - 1, 0));
      event.preventDefault();
    },
    ArrowDown: (event) => {
      setSelectedLinkIdx((oldIdx) => Math.min(oldIdx + 1, links().length - 1));
      event.preventDefault();
    },
  });

  onCleanup(cleanup);

  return (
    <Show when={state.help} fallback={<Help />}>
      <Show
        when={!showImport()}
        fallback={<Import closeImport={() => setShowImport(false)} />}
      >
        <Show when={!showConfig()} fallback={<Configuration />}>
          <div class="flex flex-col w-full p-2 md:p-4">
            <div class="w-full max-w-8xl mx-auto">
              <form onSubmit={(event) => event.preventDefault()}>
                <input
                  type="text"
                  ref={searchInputRef}
                  class="focus:outline-none w-full text-md placeholder:font-thin block mb-12 border-0 focus:ring-0"
                  placeholder="Go somewhere..."
                  autofocus
                  value={searchTerm()}
                  onInput={(event) => {
                    setSearchTerm(event?.currentTarget?.value);
                    setSelectedLinkIdx(0);
                  }}
                />
              </form>
              <div class="flex flex-col gap-4">
                <Show when={newLinkMode()}>
                  <NewLink
                    ref={newLinkInputRef}
                    onEditEnd={() => setNewLinkMode(false)}
                  />
                </Show>
                <For each={links()}>
                  {(link, idx) => (
                    <Show
                      when={link.id === editLink()?.id}
                      fallback={
                        <Link
                          id={link.id}
                          url={link.url}
                          description={link.description}
                          lastAccessedAt={link.lastAccessedAt}
                          numAccessed={link.numAccessed}
                          selected={idx() === selectedLinkIdx()}
                          showControls={true}
                          onEdit={(link) => {
                            setEditLink(link);
                          }}
                        />
                      }
                    >
                      <NewLink
                        ref={newLinkInputRef}
                        editLink={editLink()}
                        onEditEnd={() => {
                          setEditLink(null);
                        }}
                      />
                    </Show>
                  )}
                </For>
              </div>
            </div>
          </div>
          <Show when={showToast()}>
            <div class="fixed bottom-0 right-0 bg-white p-2 font-light text-sm">
              Synced: Dropped {dropped()[0]} local, {dropped()[1]} remote
            </div>
          </Show>
        </Show>
      </Show>
    </Show>
  );
};

export default App;
