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

  function joinCode(node, links, nodeMap) {
    const inputs = node.parameters.filter(
      (param) => param.input && param.name === ""
    );

    const table1 = inputs[0] && nodeMap[inputs[0]];
    const table2 = inputs[1] && nodeMap[inputs[1]];

    const params = node.parameters.filter(
      (parameter) =>
        parameter.name === "" && !parameter.input && !parameter.output
    );
    const namedParams = params
      .map((param) => `${param.name}=${param.value}`)
      .join(", ");

    return `${node.name} = cd.join(${table1}, ${table2}, ${namedParams})`;
  }

  function writePreamble() {
    return `import crandas as cd\n`;
  }

  function itemToCode(node, links, nodeMap) {
    const generator = CLASS_MAP[node.class];
    if (!generator) {
      return "";
    }

    return generator(node, links, nodeMap);
  }

  function writeNodes(nodes, links) {
    const nodeMap = nodes.reduce((acc, node) => {
      (node.ports || []).foreach((port) => {
        acc[port.inputPort] = node.name;
        acc[port.outputPort] = node.name;
      });
    }, {});
    return nodes.map((node) => itemToCode(node, links, nodeMap)).join(newline);
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
