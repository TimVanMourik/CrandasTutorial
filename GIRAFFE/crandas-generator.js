module.exports = () => {
  const LANGUAGE = "Crandas";
  const newline = "\n";

  const CLASS_MAP = {
    ["Table"]: (node) => tableCode(node),
  };

  function tableCode(node) {
    const handle = node.parameters.find(
      (parameter) => parameter.name === "Name or handle"
    );

    return `${node.name} = cd.get_table("${handle?.value || ""}")`;
  }

  function writePreamble() {
    return `import crandas as cd\n`;
  }

  function itemToCode(node, links) {
    const generator = CLASS_MAP[node.class];
    if (!generator) {
      return "";
    }

    return generator(node, links);
  }

  function writeNodes(nodes, links) {
    return nodes.map((node) => itemToCode(node, links)).join(newline);
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
