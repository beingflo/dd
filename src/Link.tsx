import { Component, Show } from "solid-js";
import { useStore } from "./store";

export type Link = {
  id: string;
  url: string;
  description: string;
  lastAccessedAt: string;
  numAccessed: number;
};

export type LinkProps = Link & {
  selected?: boolean;
  onEdit?: (link: Link) => void;
  showControls?: boolean;
};

const Link: Component<LinkProps> = (props: LinkProps) => {
  const [, { deleteLink }] = useStore();

  return (
    <div class="w-full grid grid-cols-12 group gap-2">
      <div class="flex flex-row gap-2 text-sm font-light col-span-12 md:col-span-6">
        <a
          href={props.url}
          class={`${props.selected ? "!underline" : ""} truncate`}
          title={props.url}
        >
          {props.url}
        </a>
        <Show when={props.showControls}>
          <div class="hidden group-hover:flex text-sm font-light flex-row gap-2">
            <div
              onClick={() => deleteLink(props.id)}
              class="hover:cursor-pointer"
            >
              del
            </div>
            <div
              onClick={() =>
                props.onEdit({
                  id: props.id,
                  url: props.url,
                  description: props.description,
                  numAccessed: props.numAccessed,
                  lastAccessedAt: props.lastAccessedAt,
                })
              }
              class="hover:cursor-pointer"
            >
              edit
            </div>
          </div>
        </Show>
      </div>
      <div
        class="hidden md:block text-sm font-light text-left col-span-4 truncate"
        title={props.description}
      >
        {props.description}
      </div>
      <p
        class="hidden md:block text-sm font-light text-right col-span-1"
        title={
          props.lastAccessedAt &&
          new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(props.lastAccessedAt))
        }
      >
        {props.lastAccessedAt
          ? new Intl.DateTimeFormat("en-US", {
              day: "2-digit",
              month: "long",
            }).format(new Date(props.lastAccessedAt))
          : "never"}
      </p>
      <p class="hidden md:block text-sm font-light text-right col-span-1">
        {props.numAccessed}
      </p>
    </div>
  );
};

export default Link;
