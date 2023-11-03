import { Component } from "solid-js";
import Logo from "../src/copy.svg";

const Help: Component = () => {
  const Instruction = (props) => {
    return (
      <div class="flex flex-row justify-between mb-4">
        <p class="font-bold">{props.left}</p>
        <p class="italic">{props.right}</p>
      </div>
    );
  };

  return (
    <div class="max-w-2xl mt-4 md:mt-12 mx-auto px-4">
      <div class="flex flex-row gap-4 items-center">
        <Logo class="w-12 h-12" />
        <h1 class="text-2xl font-bold tracking-tight">dd</h1>
      </div>
      <p class="mt-4">A tiny, opinionated snippet manager.</p>
      <p class="mt-4 mb-10">
        You're already in the application, press <b>h</b> to toggle the help
        screen!
      </p>
      <Instruction left="h" right="Toggle help screen" />
      <Instruction left="c" right="Toggle configuration screen" />
      <Instruction
        left="s"
        right="Synchronize state with remote if configured"
      />
      <Instruction left="cmd + k" right="Focus search input" />
      <h2 class="text-xl font-semibold mt-12">S3 synchronization and backup</h2>
      <p class="my-4">
        In the configuration of this app, you can add an endpoint and
        credentials for an S3 provider. If this is provided, the application
        will synchronize the local state with the S3 bucket when pressing{" "}
        <b>s</b>.
      </p>
      <h2 class="text-xl font-semibold mt-12">Firefox url bar search</h2>
      <p class="my-4">
        With Firefox, there is a handy way to search for and directly copy a
        snippet to the clipboard with keyword search: Right click in the input
        field at the top of the page, select 'Add a keyword for this search'.
        Next, edit the search bookmark and modify the URL field to{" "}
        <span class="font-mono">https://dd.rest.quest/?q=%s</span>. Now you can
        enter your keyword followed by your query in the browsers url bar and
        the application will open, already filtered to your query.
      </p>
    </div>
  );
};

export default Help;
