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

  return {
    writeCode,
    writeFiles,
  };
};
