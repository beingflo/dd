import { Component } from "solid-js";
import Logo from "../src/line.svg";

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
      <p class="mt-4">A tiny, opinionated link aggregation application.</p>
      <p class="mt-4 mb-10">
        You're already in the application, press <b>h</b> to toggle the help
        screen!
      </p>
      <Instruction left="h" right="Toggle help screen" />
      <Instruction left="n" right="Save a new link" />
      <Instruction left="enter" right="Visit selected link in tab" />
      <Instruction left="cmd + enter" right="Visit selected link in new tab" />
      <Instruction left="arrow up / down" right="Change selected link" />
      <Instruction left="c" right="Toggle configuration screen" />
      <Instruction left="i" right="Toggle import screen" />
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
        With Firefox, there is a handy way to search for and jump directly to
        links saved in go with keyword search: Right click in the input field at
        the top of the page, select 'Add a keyword for this search'. Next, edit
        the search bookmark and modify the URL field to{" "}
        <span class="font-mono">https://go.rest.quest/?q=%s</span>. Now you can
        enter your keyword followed by your query in the browsers url bar. In
        this mode, the application will jump directly to the top link if only
        one satisfies the query, otherwise you will reach the app and can decide
        which link to follow.
      </p>
      <h2 class="text-xl font-semibold mt-12">Firefox bookmark import</h2>
      <p class="mt-4 pb-10">
        This app implements a rudimentary bookmark import functionality. On
        Firefox, navigate to the bookmark manager and export your bookmarks to a
        JSON file. Then hit <b>i</b> in the normal view on go.rest.quest and
        select your file. You can now import all your bookmarks and edit /
        delete them from the main view as you desire.
      </p>
    </div>
  );
};

export default Help;
