// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ResearchCollaborationPlatform {
    // Researcher Struct
    struct Researcher {
        string name;
        bool isRegistered;
        uint256 contributionCount;
    }

    struct ResearchTopic {
        string topic;
        address initiator;
        uint256 contributorsCount;
        bool isOpen;
        mapping(address => bool) contributors;
    }

    mapping(address => Researcher) public researchers;
    ResearchTopic[] public researchTopics;

    // Event for topic creation
    event TopicCreated(uint256 indexed topicIndex, string topic, address indexed initiator);

    // Event for joining a topic
    event TopicJoined(uint256 indexed topicIndex, address indexed contributor);

    // Event for closing a topic
    event TopicClosed(uint256 indexed topicIndex);

    // Modifier to check if the sender is a registered researcher
    modifier onlyRegisteredResearcher() {
        require(researchers[msg.sender].isRegistered, "You must be a registered researcher");
        _;
    }

    // Create a new account for a researcher
    function createAccount(string memory _name) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(!researchers[msg.sender].isRegistered, "Researcher already registered");

        researchers[msg.sender] = Researcher(_name, true, 0);
    }

    // Create a new research topic
    function createTopic(string memory _topic) external onlyRegisteredResearcher {
        require(bytes(_topic).length > 0, "Topic cannot be empty");

        researchTopics.push();
        ResearchTopic storage newTopic = researchTopics[researchTopics.length - 1];
        newTopic.topic = _topic;
        newTopic.initiator = msg.sender;
        newTopic.isOpen = true;

        emit TopicCreated(researchTopics.length - 1, _topic, msg.sender);
    }

    // Join a research topic as a contributor
    function joinTopic(uint256 _topicIndex) external onlyRegisteredResearcher {
        require(_topicIndex < researchTopics.length, "Invalid topic index");
        require(researchTopics[_topicIndex].isOpen, "Research topic is not open");

        ResearchTopic storage topic = researchTopics[_topicIndex];
        require(!topic.contributors[msg.sender], "You are already a contributor");

        topic.contributors[msg.sender] = true;
        topic.contributorsCount++;
        researchers[msg.sender].contributionCount++;

        emit TopicJoined(_topicIndex, msg.sender);
    }

    // Close a research topic
    function closeTopic(uint256 _topicIndex) external {
        require(_topicIndex < researchTopics.length, "Invalid topic index");
        require(msg.sender == researchTopics[_topicIndex].initiator, "Only the initiator can close the topic");

        researchTopics[_topicIndex].isOpen = false;

        emit TopicClosed(_topicIndex);
    }
}
