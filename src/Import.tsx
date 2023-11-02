import { Component, createSignal, For, onMount, Show } from "solid-js";
import { useStore } from "./store";
import { parseBookmarks } from "./import-utils";
import Link from "./Link";

export type ImportProps = {
  closeImport: () => void;
};

const Import: Component<ImportProps> = (props: ImportProps) => {
  const [, { newLink }] = useStore();
  const [content, setContent] = createSignal("");
  let ref;

  onMount(() => {
    ref.addEventListener("change", () => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setContent(JSON.parse(evt.target.result as string));
      };
      reader.readAsText(ref.files[0]);
    });
  });

  const addBulkLinks = () => {
    const links = parseBookmarks(content());
    links.forEach((link) => newLink(link.url, link.description));
    props.closeImport();
  };

  return (
    <div class="flex flex-col w-full p-2 md:p-4 gap-2">
      <div class="w-full max-w-8xl mx-auto mb-4">
        <label
          class="px-4 rounded-sm bg-white border border-black py-2 uppercase text-black hover:bg-gray-100 hover:shadow-none focus:outline-none hover:cursor-pointer"
          for="file"
        >
          Select json file
        </label>
        <input ref={ref} type="file" id="file" class="hidden" />
        <Show when={content()}>
          <button
            onClick={addBulkLinks}
            class="px-4 rounded-sm bg-white uppercase text-black focus:outline-none"
          >
            Import bookmarks
          </button>
        </Show>
      </div>
      <For each={parseBookmarks(content())}>
        {(link) => (
          <Link
            id={null}
            url={link.url}
            description={link.description}
            lastAccessedAt={null}
            numAccessed={null}
          />
        )}
      </For>
    </div>
  );
};

export default Import;
