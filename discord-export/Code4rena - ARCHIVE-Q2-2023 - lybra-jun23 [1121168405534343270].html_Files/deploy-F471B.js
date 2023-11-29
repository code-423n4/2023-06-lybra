// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// etherOracle 0xF53Ac365e7ED2c6460D4FD878EDA61a6BD755B96
// lbrOracle 0xFD52686ae35B259b7C2dC96777Bf98E5Ebf0E747
// stETHMock 0xfC5459c0bEA6C559B9F88dD6d5ca3Ec92E2a2357
// GovernanceTimelock 0xc50e18ecbdf6752bB0730EcC5c1ED0DaB4874dd4
// esLBRBoost 0x7b76103832A5B5236Ce577C6E3D3835c4f829972
// USDC 0xCb708d279Be83333e2410aD4f6f19fc76Eb27F58
// mockCurvePool 0xBAB467eAdf97A6B8502a8f6a6ba6C1260F157760
// configurator 0xaB3202Bff6361d926191Af648A32D5811EA3D991
// LBR 0xCa933be5e76a3b5C962a763501ff6215f8Cd56aF
// esLBR 0x71bE199D02c480Ba56075f2F4E81d7E62309D2ad
// EUSDMock 0x1e874ED1c0a3e3f543990A99CE15ee09652a74B8
// EUSDMiningIncentives 0x60E9F4EE4c910d7Fce1B5E727b393d055567Cbf5
// ProtocolRewardsPool 0xc44B70DD878067bfBc961191C79EA7F9c5aa679a
// stETHVault 0x04dF0B64b59f3f445d483DBaA2289b35992E726F
// PeUSDMainnet 0x5Af2DF7639df6558907c20368969e851d266F9bC
// WstETH address 0xCfEf753aae79306Df7dAa39121a90cC8D4Bf88EC
// LybraWstETHVault address 0x166777f06c7518182d974cA159ddaC78Ba874ABE
const {ethers} = require("hardhat");

async function main() {
  this.accounts = await ethers.getSigners()
        this.owner = this.accounts[0].address

        const goerliEndPoint = '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23'
        const goerliChainId = 10121

        const oracle = await ethers.getContractFactory("mockChainlink")
        const stETH = await ethers.getContractFactory("stETHMock")
        const EUSDMock = await ethers.getContractFactory("EUSD")
        const configurator = await ethers.getContractFactory("Configurator")
        const LybraStETHDepositVault = await ethers.getContractFactory("LybraStETHDepositVault")
        const GovernanceTimelock = await ethers.getContractFactory("GovernanceTimelock")
        const EUSDMiningIncentives = await ethers.getContractFactory("EUSDMiningIncentives")
        const esLBRBoost = await ethers.getContractFactory("esLBRBoost")
        const LBR = await ethers.getContractFactory("LBR")
        const esLBR = await ethers.getContractFactory("esLBR")
        const PeUSDMainnet = await ethers.getContractFactory("PeUSDMainnet")
        const ProtocolRewardsPool = await ethers.getContractFactory("ProtocolRewardsPool")
        const mockCurvePool = await ethers.getContractFactory("mockCurvePool")
        const mockUSDC = await ethers.getContractFactory("mockUSDC")
        const lbrOracleMock = await ethers.getContractFactory("lbrOracleMock")
        
        this.oracle = await oracle.deploy()
        console.log('etherOracle', this.oracle.address)
        this.lbrOracleMock = await lbrOracleMock.deploy()
        console.log('lbrOracle', this.lbrOracleMock.address)
        this.stETHMock = await stETH.deploy()
        console.log('stETHMock', this.stETHMock.address)
        this.GovernanceTimelock = await GovernanceTimelock.deploy(1,[this.owner],[this.owner],this.owner);
        console.log('GovernanceTimelock', this.GovernanceTimelock.address)

        this.esLBRBoost = await esLBRBoost.deploy()
        console.log('esLBRBoost', this.esLBRBoost.address)
        this.usdc = await mockUSDC.deploy()
        console.log('USDC', this.usdc.address)
        this.mockCurvePool = await mockCurvePool.deploy()
        console.log('mockCurvePool', this.mockCurvePool.address)
        this.configurator = await configurator.deploy(this.GovernanceTimelock.address, this.mockCurvePool.address)
        console.log('configurator', this.configurator.address)

        this.LBR = await LBR.deploy(this.configurator.address, 8, goerliEndPoint)
        console.log('LBR', this.LBR.address)
        this.esLBR = await esLBR.deploy(this.configurator.address)
        console.log('esLBR', this.esLBR.address)

        this.EUSDMock = await EUSDMock.deploy(this.configurator.address)
        console.log('EUSDMock', this.EUSDMock.address)
        await this.configurator.initEUSD(this.EUSDMock.address)

        this.EUSDMiningIncentives = await EUSDMiningIncentives.deploy(this.configurator.address, this.esLBRBoost.address, this.oracle.address, this.lbrOracleMock.address)
        console.log('EUSDMiningIncentives', this.EUSDMiningIncentives.address)
        this.ProtocolRewardsPool = await ProtocolRewardsPool.deploy(this.configurator.address)
        console.log('ProtocolRewardsPool', this.ProtocolRewardsPool.address)
        this.stETHVault = await LybraStETHDepositVault.deploy(this.configurator.address, this.stETHMock.address, this.oracle.address)
        console.log('stETHVault', this.stETHVault.address)
        this.PeUSDMainnet = await PeUSDMainnet.deploy(this.configurator.address, 8, goerliEndPoint)
        console.log('PeUSDMainnet', this.PeUSDMainnet.address)
        await this.mockCurvePool.setToken(this.EUSDMock.address, this.usdc.address)
        await this.configurator.setMintVault(this.stETHVault.address, true);
        await this.configurator.setPremiumTradingEnabled(true);
        await this.configurator.setMintVaultMaxSupply(this.stETHVault.address, ethers.utils.parseEther("10000000000"));
        await this.configurator.setBorrowApy(this.stETHVault.address, 200);
        await this.configurator.setEUSDMiningIncentives(this.EUSDMiningIncentives.address)

        await this.EUSDMiningIncentives.setToken(this.LBR.address, this.esLBR.address)
        await this.ProtocolRewardsPool.setTokenAddress(this.esLBR.address, this.LBR.address, this.esLBRBoost.address);
        
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
