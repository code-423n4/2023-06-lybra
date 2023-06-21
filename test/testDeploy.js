// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat")

async function main() {
  this.accounts = await ethers.getSigners()
        this.owner = this.accounts[0].address

        const goerliEndPoint = '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23'
        const goerliChainId = 10121
        const arbiGoerliChainId = 10143

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
        const DividendPool = await ethers.getContractFactory("DividendPool")
        const mockCurve = await ethers.getContractFactory("mockCurve")
        const mockEtherPriceOracle = await ethers.getContractFactory("mockEtherPriceOracle")
        const mockLBRPriceOracle = await ethers.getContractFactory("mockLBRPriceOracle")
        
        this.oracle = await oracle.deploy()
        console.log('oracle', this.oracle.address)
        this.stETHMock = await stETH.deploy()
        console.log('stETHMock', this.stETHMock.address)
        this.mockCurve = await mockCurve.deploy()
        this.mockEtherPriceOracle = await mockEtherPriceOracle.deploy()
        this.mockLBRPriceOracle = await mockLBRPriceOracle.deploy()
        this.GovernanceTimelock = await GovernanceTimelock.deploy(1, [this.owner], [this.owner], this.owner);
        console.log('GovernanceTimelock', this.GovernanceTimelock.address)

        this.esLBRBoost = await esLBRBoost.deploy()
        console.log('esLBRBoost', this.esLBRBoost.address)
        this.configurator = await configurator.deploy(this.GovernanceTimelock.address, this.mockCurve.address)
        console.log('configurator', this.configurator.address)

        this.LBR = await LBR.deploy(this.configurator.address, 8, goerliEndPoint)
        console.log('LBR', this.LBR.address)
        this.esLBR = await esLBR.deploy(this.configurator.address)
        console.log('esLBR', this.esLBR.address)

        this.EUSDMock = await EUSDMock.deploy(this.configurator.address)
        console.log('EUSDMock', this.EUSDMock.address)
        await this.configurator.initEUSD(this.EUSDMock.address)



        this.EUSDMiningIncentives = await EUSDMiningIncentives.deploy(this.configurator.address, this.esLBRBoost.address, this.mockEtherPriceOracle.address, this.mockLBRPriceOracle.address)
        console.log('EUSDMiningIncentives', this.EUSDMiningIncentives.address)
        this.DividendPool = await DividendPool.deploy(this.configurator.address)
        console.log('DividendPool', this.DividendPool.address)
        this.stETHVault = await LybraStETHDepositVault.deploy(this.configurator.address, this.stETHMock.address, this.oracle.address)
        console.log('stETHVault', this.stETHVault.address)
        this.PeUSDMainnet = await PeUSDMainnet.deploy(this.configurator.address, 8, goerliEndPoint)
        console.log('PeUSDMainnet', this.PeUSDMainnet.address)
        await this.configurator.setMintVault(this.stETHVault.address, true);
        await this.configurator.setMintVaultMaxSupply(this.stETHVault.address, ethers.utils.parseEther("10000000000"));
        await this.configurator.setBorrowApy(this.stETHVault.address, 200);
        await this.configurator.setEUSDMiningIncentives(this.EUSDMiningIncentives.address)
        await this.EUSDMiningIncentives.setToken(this.LBR.address, this.esLBR.address)
        await this.DividendPool.setTokenAddress(this.esLBR.address, this.LBR.address, this.esLBRBoost.address);
        
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
