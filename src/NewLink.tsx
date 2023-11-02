import { Component, createSignal } from "solid-js";
import { useStore } from "./store";
import { Link } from "./Link";

export type NewLinkProps = {
  onEditEnd: () => void;
  editLink?: Link;
  ref: any;
};

const NewLink: Component<NewLinkProps> = (props) => {
  const [, { newLink, updateLink }] = useStore();
  const [newLinkUrl, setNewLinkUrl] = createSignal(null);
  const [newLinkDescription, setNewLinkDescription] = createSignal(null);

  const onEditEnd = (event) => {
    event?.preventDefault();

    if (props.editLink) {
      updateLink(
        props.editLink?.id,
        newLinkUrl() ?? props.editLink?.url,
        newLinkDescription() ?? props.editLink?.description
      );
    } else {
      newLink(newLinkUrl(), newLinkDescription());
    }
    props.onEditEnd();
  };

  return (
    <div class="w-full grid grid-cols-12 gap-2 group">
      <div class="flex flex-row gap-2 text-sm font-light col-span-6 underline-offset-4">
        <form onSubmit={onEditEnd} class="w-full">
          <input
            autofocus
            class="w-full border border-dashed border-gray-400 focus:outline-none"
            placeholder="url"
            ref={props.ref}
            value={props.editLink?.url ?? ""}
            onInput={(event) => setNewLinkUrl(event?.currentTarget.value)}
          />
        </form>
      </div>
      <div class="text-sm font-light text-left col-span-6 md:col-span-4">
        <form onSubmit={onEditEnd} class="w-full">
          <input
            class="w-full border border-dashed border-gray-400 focus:outline-none"
            placeholder="description"
            value={props.editLink?.description ?? ""}
            onInput={(event) =>
              setNewLinkDescription(event?.currentTarget.value)
            }
          />
        </form>
      </div>
    </div>
  );
};

export default NewLink;
