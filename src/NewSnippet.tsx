import { Component, createSignal } from "solid-js";
import { useStore } from "./store";
import { Snippet } from "./Snippet";

export type NewSnippetProps = {
  onEditEnd: () => void;
  editSnippet?: Snippet;
  ref: any;
};

const NewSnippet: Component<NewSnippetProps> = (props) => {
  const [, { newSnippet, updateSnippet }] = useStore();
  const [newSnippetDescription, setNewSnippetDescription] = createSignal(null);
  const [newSnippetContent, setNewSnippetContent] = createSignal(null);

  const onEditEnd = (event) => {
    event?.preventDefault();

    if (props.editSnippet) {
      updateSnippet(
        props.editSnippet?.id,
        newSnippetDescription() ?? props.editSnippet?.description,
        newSnippetContent() ?? props.editSnippet?.content
      );
    } else {
      newSnippet(newSnippetDescription(), newSnippetContent());
    }
    props.onEditEnd();
  };

  return (
    <div class="w-full grid grid-cols-12 gap-2 group">
      <div class="flex flex-row gap-2 text-sm font-light col-span-12 md:col-span-4 underline-offset-4">
        <form onSubmit={onEditEnd} class="w-full">
          <input
            autofocus
            class="w-full border border-dashed border-gray-400 focus:outline-none"
            placeholder="description"
            ref={props.ref}
            value={props.editSnippet?.description ?? ""}
            onInput={(event) =>
              setNewSnippetDescription(event?.currentTarget.value)
            }
          />
        </form>
      </div>
      <div class="text-sm font-light text-left col-span-12 md:col-span-8">
        <form onSubmit={onEditEnd} class="w-full">
          <textarea
            class="w-full h-24 border border-dashed border-gray-400 focus:outline-none"
            placeholder="content"
            value={props.editSnippet?.content ?? ""}
            onInput={(event) =>
              setNewSnippetContent(event?.currentTarget.value)
            }
          />
        </form>
      </div>
    </div>
  );
};

export default NewSnippet;
