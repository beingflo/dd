export const parseBookmarks = (
  content: any
): Array<{ url: string; description: string }> => {
  if (content.children) {
    let merge = [];
    content.children.forEach((element) => {
      merge = [...merge, ...parseBookmarks(element)];
    });
    return merge;
  }

  if (content.type === "text/x-moz-place") {
    return [{ url: content.uri, description: content.title }];
  }

  return [];
};
