import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ResearchCollaborationPlatform from './contracts/ResearchCollaborationPlatform.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // Connect to MetaMask
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = ResearchCollaborationPlatform.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            ResearchCollaborationPlatform.abi,
            deployedNetwork && deployedNetwork.address,
          );
          setContract(contractInstance);
        } else {
          console.error('Please install MetaMask to use this application');
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    }

    init();
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleCreateTopic = async () => {
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.createResearchTopic(topic).send({ from: accounts[0] });
      setTopic('');
    } catch (error) {
      console.error('Error creating research topic:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Research Collaboration Platform</h1>
      {accounts.length === 0 ? (
        <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
          Connect to MetaMask
        </button>
      ) : (
        <>
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Research topic"
              value={topic}
              onChange={handleTopicChange}
            />
            <button onClick={handleCreateTopic} disabled={loading}>
              {loading ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
