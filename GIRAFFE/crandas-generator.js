module.exports = () => {
  const LANGUAGE = "Crandas";
  const newline = "\n";

  const CLASS_MAP = {
    ["Table"]: (node) => tableCode(node),
    ["Join"]: (node) => joinCode(node, nodeMap),
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
      (parameter) => parameter.name === "Name or handle"
    );

    return `${node.name} = cd.get_table("${handle?.value || ""}")`;
  }

  function joinCode(node, nodeMap) {
    const table1 = "";
    const table2 = "";

    return `${node.name} = cd.join(${table1}, ${table2}, )`;
  }

  function writePreamble() {
    return `import crandas as cd\n`;
  }

  function itemToCode(node, nodeMap) {
    const generator = CLASS_MAP[node.class];
    if (!generator) {
      return "";
    }

    return generator(node, nodeMap);
  }

  function writeNodes(nodes, links) {
    const nodeMap = links.reduce((acc, link) => {});
    return nodes.map((node) => itemToCode(node, nodeMap)).join(newline);
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
