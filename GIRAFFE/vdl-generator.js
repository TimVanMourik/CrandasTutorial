module.exports = () => {
  const CLASS_MAP = {
    ["Table"]: (node) => tableJSON(node),
    ["Merge"]: (node) => joinJSON(node),
  };
  // Class list
  // Table
  // Join
  // Column reference
  // Mean
  // Comparator
  // Filter

  //what about the steps?
  var querie_script_step = 0

  function tableJSON(node) {
    const handle = node.parameters.find(
      (parameter) => parameter.name === "Name or handle");
    return {
      "get": handle.value,
      "mode": "regular",
      "keep": false,
      "script_step": querie_script_step++
    };
  }


  function joinJSON(node) {
    const right_on = node.parameters.find(
      (parameter) => parameter.name === "right_on");
    const left_on = node.parameters.find(
      (parameter) => parameter.name === "left_on");
    const how = node.parameters.find(
      (parameter) => parameter.name === "how");
    const on = node.parameters.find(
      (parameter) => parameter.name === "on");

    return {
      "compute": {
        "command": "join",
        "objects": [
          {
            "type": "reference to script step",
            "script_step": 1
          },
          {
            "type": "reference to script step",
            "script_step": 0
          }
        ],
        "jcols1": [
          left_on.value
        ],
        "cols1": [
          0,
          1,
          2,
          3,
          4
        ],
        "colnames1": [
          "Year",
          "ProductNumber",
          "ProductName",
          "EAN_Number",
          "QuantitySold"
        ],
        "jcols2": [
          right_on.value
        ],
        "cols2": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10
        ],
        "colnames2": [
          "SPP_DESCRIPTION",
          "ENERGY_VALUE_IN_KJ",
          "ENERGY_VALUE_IN_KCAL",
          "SODIUM_IN_MG",
          "SATURATED_FATTY_ACIDS_IN_G",
          "TOTAL_PROTEIN_IN_G",
          "MONO_AND_DISACCHARIDES_IN_G",
          "DIETARY_FIBER_IN_G",
          "STANDARD_PORTION_SIZE",
          "NUMBER_OF_PORTIONS_PER_PACKAGE"
        ],
        "how": how.value
      },
      "mode": "regular",
      "keep": false,
      "script_step": 2
    }
  }

  function nodeToVdlCommand(node, links) {
    const generator = CLASS_MAP[node.class];
    if (!generator) {
      return "";
    }

    return generator(node, links);
  }


  function nodesToTransaction(nodes, links) {
    return nodes
      .map((node) => nodeToVdlCommand(node))
      .filter((o) => Object.keys(o).length > 0)
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
