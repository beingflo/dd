import { Component, Show } from "solid-js";
import { useStore } from "./store";

export type Snippet = {
  id: string;
  description: string;
  content: string;
  lastAccessedAt: string;
};

export type SnippetProps = Snippet & {
  selected?: boolean;
  onEdit?: (snippet: Snippet) => void;
};

const Snippet: Component<SnippetProps> = (props: SnippetProps) => {
  const [, { deleteSnippet }] = useStore();

  return (
    <div class="w-full grid grid-cols-12 group gap-2">
      <div class="flex flex-row gap-2 text-sm font-light col-span-12 md:col-span-4">
        <div
          class={`${props.selected ? "!underline" : ""} truncate`}
          title={props.description}
        >
          {props.description}
        </div>
        <div class="hidden group-hover:flex text-sm font-light flex-row gap-2">
          <div
            onClick={() => deleteSnippet(props.id)}
            class="hover:cursor-pointer"
          >
            del
          </div>
          <div
            onClick={() =>
              props.onEdit({
                id: props.id,
                content: props.content,
                description: props.description,
                lastAccessedAt: props.lastAccessedAt,
              })
            }
            class="hover:cursor-pointer"
          >
            edit
          </div>
        </div>
      </div>
      <div
        class="hidden md:block text-sm font-light text-left col-span-12 md:col-span-8 truncate"
        title={props.content}
      >
        {props.content}
      </div>
    </div>
  );
};

export default Snippet;
