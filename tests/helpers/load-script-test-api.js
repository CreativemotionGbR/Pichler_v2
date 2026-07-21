import { readFile } from "node:fs/promises";
import vm from "node:vm";

export async function loadScriptTestApi() {
  const scriptUrl = new URL("../../script.js", import.meta.url);
  const source = (await readFile(scriptUrl, "utf8"))
    .replace(
      /^import\s+\{\s*evaluateChange\s*\}\s+from\s+"\.\/js\/rules-engine\.js";\s*/,
      ""
    )
    .replaceAll("import.meta.url", JSON.stringify(scriptUrl.href));
  const closingMarker = "})();";
  const closingIndex = source.lastIndexOf(closingMarker);

  if (closingIndex < 0) {
    throw new Error("Der Abschluss der script.js-IIFE wurde nicht gefunden.");
  }

  const testExport = `
globalThis.__scriptTestApi = {
  classifyEmailFields,
  extractAffectedSystems,
};
`;
  const instrumentedSource =
    source.slice(0, closingIndex) + testExport + source.slice(closingIndex);

  const createElement = () => ({
    addEventListener() {},
    classList: {
      add() {},
      contains() { return false; },
      remove() {},
      toggle() {},
    },
    dataset: {},
    focus() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    reset() {},
    style: {},
    value: "",
  });
  const elements = new Map();
  const document = {
    addEventListener() {},
    body: createElement(),
    createElement,
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, createElement());
      return elements.get(id);
    },
    querySelector() { return createElement(); },
    querySelectorAll() { return []; },
  };
  const localStorage = {
    getItem() { return null; },
    removeItem() {},
    setItem() {},
  };
  const context = {
    Blob,
    URL,
    clearTimeout,
    confirm() { return true; },
    console,
    document,
    localStorage,
    setTimeout,
  };
  context.window = context;

  vm.createContext(context);
  vm.runInContext(instrumentedSource, context, { filename: scriptUrl.pathname });
  return context.__scriptTestApi;
}
