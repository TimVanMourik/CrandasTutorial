module.exports = () => {
  const LANGUAGE = "Crandas";
  const newline = "\n";

  const CLASS_MAP = {
    ["Table"]: () => tableCode(node),
  };
  // Class list
  // Table
  // Join
  // Column reference
  // Mean
  // Comparator
  // Filter

  function tableCode(node) {
    const handle = node.parameters.find(
      (parameter) => parameter.name === "handle"
    );

    return `${node.name} = cd.get_table("${handle}")`;
  }

  function writePreamble() {
    return `import crandas as cd`;
  }

  function itemToCode(node) {
    const generator = CLASS_MAP[node.class];
    if (!generator) {
      return "";
    }

    return generator(node);
  }

  function writeNodes(nodes, links) {
    return nodes.map((node) => itemToCode(node)).join(newline);
  }

  async function writeCode(nodes, links) {
    const preamble = writePreamble();
    const nodeCode = writeNodes(nodes, links);
    return [preamble, nodeCode].join(newline);
  }

  async function writeFiles(nodes, links) {
    const analysisFilename = "GIRAFFE/code/analysis.py";
    return {
      [analysisFilename]: await writeCode(nodes),
    };
  }

  return {
    writeCode,
    writeFiles,
  };
};
