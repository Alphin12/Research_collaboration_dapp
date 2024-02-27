const { artifacts } = require('truffle-artifactor');
const ResearchCollaborationPlatform = artifacts.require("ResearchCollaborationPlatform");

module.exports = async function(callback) {
  try {
    const researchCollaborationPlatformInstance = await ResearchCollaborationPlatform.deployed();
    
    // Example: Create a research topic
    await researchCollaborationPlatformInstance.createResearchTopic("Example Topic");
    
    // Example: Get number of research topics
    const topicsCount = await researchCollaborationPlatformInstance.getResearchTopicsCount();
    console.log("Number of research topics:", topicsCount.toNumber());
    
    // Example: Get information about a specific research topic
    const topic = await researchCollaborationPlatformInstance.getResearchTopic(0);
    console.log("First research topic:", topic);

    // Add more interactions as needed...
  } catch (error) {
    console.error("Error:", error);
  }
  
  callback();
};
