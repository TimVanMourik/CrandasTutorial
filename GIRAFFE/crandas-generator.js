module.exports = () => {
  const LANGUAGE = "Crandas";
  const newline = "\n";

  function writePreamble() {
    return `import crandas as cd`;
  }

  async function writeCode(nodes, links) {
    const preamble = writePreamble();
    return [preamble].join(newline);
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
