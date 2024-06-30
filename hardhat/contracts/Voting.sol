// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Voting {
  address public owner;
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  mapping(address => bool) public voters;
  mapping(uint => Candidate) public candidates;
  uint public candidatesCount;

  event votedEvent(uint indexed candidateId);

  constructor() {
    owner = msg.sender;
  }

  function addCandidate(string memory _name) public {
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
  }

  function vote(uint _candidateId) public {
    require(!voters[msg.sender], 'You have already voted.');
    require(_candidateId > 0 && _candidateId <= candidatesCount, 'Invalid candidate ID.');

    voters[msg.sender] = true;
    candidates[_candidateId].voteCount++;

    emit votedEvent(_candidateId);
  }
}
