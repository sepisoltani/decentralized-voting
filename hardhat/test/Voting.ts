import { expect } from 'chai'
import hre from 'hardhat'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { Voting } from '../typechain-types'

describe('Voting Contract', function () {
  let voting: Voting
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress

  beforeEach(async function () {
    ;[owner, addr1, addr2] = await hre.ethers.getSigners()

    voting = await hre.ethers.deployContract('Voting')
  })

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await voting.owner()).to.equal(owner.address)
    })
  })

  describe('Transactions', function () {
    it('Should add a new candidate', async function () {
      await voting.addCandidate('Alice')
      const candidate = await voting.candidates(1)
      expect(candidate.name).to.equal('Alice')
    })

    it('Should allow users to vote', async function () {
      await voting.addCandidate('Alice')

      await voting.connect(addr1).vote(1)
      const candidate = await voting.candidates(1)
      expect(candidate.voteCount).to.equal(1)

      expect(await voting.voters(addr1.address)).to.be.true
    })

    it('Should prevent double voting', async function () {
      await voting.addCandidate('Alice')

      await voting.connect(addr1).vote(1)

      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith('You have already voted.')
    })

    it('Should prevent voting for a non-existent candidate', async function () {
      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith('Invalid candidate ID.')
    })
  })
})
