module.exports = () => {
  function nodeToVdlCommand(item) {
    return item;
  }

  function nodesToTransaction(nodes, links) {
    return nodes
      .map((node) => nodeToVdlCommand(node))
      .filter((o) => Object.keys(o).length > 0);
  }

  async function writeCode(nodes, links) {
    return JSON.stringify(nodesToTransaction(nodes, links), null, 2);
  }

  async function writeFiles(nodes, links) {
    const transactionFilename = "GIRAFFE/code/transaction.json";
    return {
      [transactionFilename]: await writeCode(nodes),
    };
  }

  return {
    writeCode,
    writeFiles,
  };
};
