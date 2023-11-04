import { AwsClient } from "aws4fetch";
import { setState } from "./store";

const StateFile = "state.json";

export const s3Sync = async (state: any) => {
  if (!state?.s3) {
    console.info("No credentials for syncing");
    return;
  }

  const aws = new AwsClient({
    accessKeyId: state?.s3?.apiKey,
    secretAccessKey: state?.s3?.apiSecretKey,
    service: "s3",
    region: state?.s3?.region,
  });

  console.info("Sync state");

  let remoteSnippets = { snippets: [] };
  try {
    const snippetsResponse = await aws.fetch(
      `${state?.s3?.endpoint}${StateFile}`,
      {
        method: "GET",
      }
    );
    remoteSnippets = await snippetsResponse.json();
  } catch {}

  const [merged, droppedLocal, droppedRemote] = mergeState(
    state.snippets,
    remoteSnippets.snippets
  );

  setState({
    snippets: [...merged],
  });

  await aws.fetch(`${state?.s3?.endpoint}${StateFile}`, {
    method: "PUT",
    body: JSON.stringify({
      snippets: merged,
    }),
  });

  return [droppedLocal, droppedRemote];
};

export const mergeState = (
  local = [],
  remote = []
): [Array<any>, number, number] => {
  const merged = [];
  let droppedLocal = 0;
  let droppedRemote = 0;

  // Add snippets that are only remote
  remote?.forEach((snippet) => {
    if (!local?.find((s) => s.id === snippet.id)) {
      merged.push(snippet);
    }
  });

  // Add snippets that are only local
  local?.forEach((snippet) => {
    if (!remote?.find((s) => s.id === snippet.id)) {
      merged.push(snippet);
    }
  });

  // From snippets that appear in both, take the one that has been modified last
  local?.forEach((localSnippet) => {
    const remoteSnippet = remote?.find((l) => l.id === localSnippet.id);
    if (remoteSnippet) {
      if (localSnippet?.lastAccessedAt < remoteSnippet.lastAccessedAt) {
        merged.push(remoteSnippet);
        console.info(`Dropping old local: ${JSON.stringify(localSnippet)}`);
        droppedLocal += 1;
      } else if (localSnippet.lastAccessedAt > remoteSnippet.lastAccessedAt) {
        merged.push(localSnippet);
        console.info(`Dropping old remote: ${JSON.stringify(remoteSnippet)}`);
        droppedRemote += 1;
      } else {
        merged.push(localSnippet);
      }
    }
  });

  return [merged, droppedLocal, droppedRemote];
};
