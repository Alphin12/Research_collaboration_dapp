const { artifacts } = require('truffle-artifactor');

module.exports = function(deployer) {
  deployer.deploy(artifacts.require("Research_contract"));
};
