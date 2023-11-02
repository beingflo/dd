import { describe, expect, test } from "vitest";
import { mergeState } from "./s3-utils";

const local = [
  {
    id: "88cbcbba-d1d4-4985-aec0-d4e18796e6d7",
    url: "https://www.whatsmydns.net/",
    description: "dns propagation check",
    createdAt: 1697987537679,
    lastAccessedAt: 1698139826294,
    numAccessed: 14,
    deletedAt: null,
    lastAccessed: 1697988730977,
  },
  {
    id: "8f293c96-6c16-44c1-a875-da92a345abe5",
    url: "lksdjlksjf",
    description: "",
    createdAt: 1697988608689,
    lastAccessedAt: null,
    numAccessed: 0,
    deletedAt: 1697988608690,
  },
  {
    id: "ab9fe9ff-990c-45bc-b98e-19f9ea90b9e8",
    url: "sdklfjslkfj",
    description: "slkfjslkdfj",
    createdAt: 1697988625764,
    lastAccessedAt: null,
    numAccessed: 0,
    deletedAt: null,
  },
  {
    id: "86ad427e-a081-445c-82c9-a0a9bb6a7857",
    url: "flksjdflksfj",
    description: "lksdjflkjsdf",
    createdAt: 1697997405395,
    lastAccessedAt: null,
    numAccessed: 0,
    deletedAt: 1698139826294,
  },
];

const remote = [
  {
    id: "88cbcbba-d1d4-4985-aec0-d4e18796e6d7",
    url: "https://www.whatsmydns.net/",
    description: "dns propagation check",
    createdAt: 1697987537679,
    lastAccessedAt: 1698139826294,
    numAccessed: 14,
    deletedAt: null,
    lastAccessed: 1697988730977,
  },
  {
    id: "8f293c96-6c16-44c1-a875-da92a345abe5",
    url: "lksdjlksjf",
    description: "",
    createdAt: 1697988608689,
    lastAccessedAt: null,
    numAccessed: 0,
    deletedAt: 1697988608690,
  },
  {
    id: "ab9fe9ff-990c-45bc-b98e-19f9ea90b9e8",
    url: "sdklfjslkfj",
    description: "slkfjslkdfj",
    createdAt: 1697988625764,
    lastAccessedAt: null,
    numAccessed: 0,
    deletedAt: null,
  },
  {
    id: "86ad427e-a081-445c-82c9-a0a9bb6a7857",
    url: "flksjdflksfj",
    description: "lksdjflkjsdf",
    createdAt: 1697997405395,
    lastAccessedAt: null,
    numAccessed: 0,
    deletedAt: 1698139826294,
  },
];

describe("s3 utils", () => {
  test("merges new links (remote -> local)", () => {
    const remote = [
      {
        id: "98cbcbaa-d1d4-4985-aec0-d4e18796e6d7",
        url: "https://www.whatsmydns.net/",
        description: "dns propagation check",
        createdAt: 1697987537679,
        lastAccessedAt: 1698139826294,
        numAccessed: 14,
        deletedAt: null,
        lastAccessed: 1697988730977,
      },
      {
        id: "8f293c16-6c18-44c1-a875-da92a345abe5",
        url: "lksdjlksjf",
        description: "",
        createdAt: 1697988608689,
        lastAccessedAt: null,
        numAccessed: 0,
        deletedAt: 1697988608690,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(6);
  });

  test("merges new links (local -> remote)", () => {
    const local = [
      {
        id: "98cbcbaa-d1d4-4985-aec0-d4e18796e6d7",
        url: "https://www.whatsmydns.net/",
        description: "dns propagation check",
        createdAt: 1697987537679,
        lastAccessedAt: 1698139826294,
        numAccessed: 14,
        deletedAt: null,
        lastAccessed: 1697988730977,
      },
      {
        id: "8f293c16-6c18-44c1-a875-da92a345abe5",
        url: "lksdjlksjf",
        description: "",
        createdAt: 1697988608689,
        lastAccessedAt: null,
        numAccessed: 0,
        deletedAt: 1697988608690,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(6);
  });

  test("merges edited links (remote -> local)", () => {
    const remote = [
      {
        id: "88cbcbba-d1d4-4985-aec0-d4e18796e6d7",
        url: "https://www.whatsmydns.net/",
        description: "dns propagation check tool",
        createdAt: 1697987537679,
        lastAccessedAt: 1698139826394,
        numAccessed: 15,
        deletedAt: null,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(4);
    expect(
      merged.find((l) => l.id === "88cbcbba-d1d4-4985-aec0-d4e18796e6d7")
        .description
    ).toEqual("dns propagation check tool");
  });

  test("merges edited links (local -> remote)", () => {
    const local = [
      {
        id: "88cbcbba-d1d4-4985-aec0-d4e18796e6d7",
        url: "https://www.whatsmydns.net/",
        description: "dns propagation check tool",
        createdAt: 1697987537679,
        lastAccessedAt: 1698139826394,
        numAccessed: 15,
        deletedAt: null,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(4);
    expect(
      merged.find((l) => l.id === "88cbcbba-d1d4-4985-aec0-d4e18796e6d7")
        .description
    ).toEqual("dns propagation check tool");
  });

  test("merges accessed links (remote -> local)", () => {
    const remote = [
      {
        id: "88cbcbba-d1d4-4985-aec0-d4e18796e6d7",
        url: "https://www.whatsmydns.net/",
        description: "dns propagation check",
        createdAt: 1697987537679,
        lastAccessedAt: 1698149826294,
        numAccessed: 15,
        deletedAt: null,
        lastAccessed: 1697988730977,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(4);
    expect(
      merged.find((l) => l.id === "88cbcbba-d1d4-4985-aec0-d4e18796e6d7")
        .numAccessed
    ).toEqual(15);
  });

  test("merges accessed links (local -> remote)", () => {
    const local = [
      {
        id: "88cbcbba-d1d4-4985-aec0-d4e18796e6d7",
        url: "https://www.whatsmydns.net/",
        description: "dns propagation check",
        createdAt: 1697987537679,
        lastAccessedAt: 1698149826294,
        numAccessed: 15,
        deletedAt: null,
        lastAccessed: 1697988730977,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(4);
    expect(
      merged.find((l) => l.id === "88cbcbba-d1d4-4985-aec0-d4e18796e6d7")
        .numAccessed
    ).toEqual(15);
  });

  test("merges deleted links (remote -> local)", () => {
    const remote = [
      {
        id: "88cbcbba-d1d4-4985-aec0-d4e18796e6d7",
        url: "https://www.whatsmydns.net/",
        description: "dns propagation check",
        createdAt: 1697987537679,
        lastAccessedAt: 1698159826294,
        numAccessed: 14,
        deletedAt: 1698159826294,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(4);
    expect(
      merged.find((l) => l.id === "88cbcbba-d1d4-4985-aec0-d4e18796e6d7")
        .deletedAt
    ).toEqual(1698159826294);
  });

  test("merges deleted links (local -> remote)", () => {
    const local = [
      {
        id: "88cbcbba-d1d4-4985-aec0-d4e18796e6d7",
        url: "https://www.whatsmydns.net/",
        description: "dns propagation check",
        createdAt: 1697987537679,
        lastAccessedAt: 1698159826294,
        numAccessed: 14,
        deletedAt: 1698159826294,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(4);
    expect(
      merged.find((l) => l.id === "88cbcbba-d1d4-4985-aec0-d4e18796e6d7")
        .deletedAt
    ).toEqual(1698159826294);
  });

  test("merges edited and deleted link (remote -> local)", () => {
    const remote = [
      {
        id: "86ad427e-a081-445c-82c9-a0a9bb6a7857",
        url: "flksjdflksfj",
        description: "test test",
        createdAt: 1697997405395,
        lastAccessedAt: 1698239826294,
        numAccessed: 0,
        deletedAt: 1698139826294,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(4);
    expect(
      merged.find((l) => l.id === "86ad427e-a081-445c-82c9-a0a9bb6a7857")
        .description
    ).toEqual("test test");
  });

  test("merges edited and deleted link (local -> remote)", () => {
    const local = [
      {
        id: "86ad427e-a081-445c-82c9-a0a9bb6a7857",
        url: "flksjdflksfj",
        description: "test test",
        createdAt: 1697997405395,
        lastAccessedAt: 1698239826294,
        numAccessed: 0,
        deletedAt: 1698139826294,
      },
    ];

    const [merged] = mergeState(local, remote);

    expect(merged.length).toEqual(4);
    expect(
      merged.find((l) => l.id === "86ad427e-a081-445c-82c9-a0a9bb6a7857")
        .description
    ).toEqual("test test");
  });
});
