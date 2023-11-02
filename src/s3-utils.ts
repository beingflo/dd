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

  let remoteLinks = { links: [] };
  try {
    const linksResponse = await aws.fetch(
      `${state?.s3?.endpoint}${StateFile}`,
      {
        method: "GET",
      }
    );
    remoteLinks = await linksResponse.json();
  } catch {}

  const [merged, droppedLocal, droppedRemote] = mergeState(
    state.links,
    remoteLinks.links
  );

  setState({
    links: [...merged],
  });

  await aws.fetch(`${state?.s3?.endpoint}${StateFile}`, {
    method: "PUT",
    body: JSON.stringify({
      links: merged,
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

  // Add links that are only remote
  remote?.forEach((link) => {
    if (!local?.find((l) => l.id === link.id)) {
      merged.push(link);
    }
  });

  // Add links that are only local
  local?.forEach((link) => {
    if (!remote?.find((l) => l.id === link.id)) {
      merged.push(link);
    }
  });

  // From links that appear in both, take the one that has been modified last
  local?.forEach((localLink) => {
    const remoteLink = remote?.find((l) => l.id === localLink.id);
    if (remoteLink) {
      if (localLink?.lastAccessedAt < remoteLink.lastAccessedAt) {
        merged.push(remoteLink);
        console.info(`Dropping old local: ${JSON.stringify(localLink)}`);
        droppedLocal += 1;
      } else if (localLink.lastAccessedAt > remoteLink.lastAccessedAt) {
        merged.push(localLink);
        console.info(`Dropping old remote: ${JSON.stringify(remoteLink)}`);
        droppedRemote += 1;
      } else {
        merged.push(localLink);
      }
    }
  });

  return [merged, droppedLocal, droppedRemote];
};
