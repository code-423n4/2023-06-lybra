const { expect } = require("chai")
const { ethers } = require("hardhat")


describe("lybra protocol", function () {
    beforeEach(async function () {
        this.accounts = await ethers.getSigners()
        this.owner = this.accounts[0].address
        this.user2 = this.accounts[1].address

        // use this chainId
        this.chainIdSrc = 1
        this.chainIdDst = 2
        this.chainId3 = 3

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
        const mockCurve = await ethers.getContractFactory("mockCurve")
        const mockEtherPriceOracle = await ethers.getContractFactory("mockEtherPriceOracle")
        const mockLBRPriceOracle = await ethers.getContractFactory("mockLBRPriceOracle")
        
        this.oracle = await oracle.deploy()
        this.stETHMock = await stETH.deploy()
        this.mockCurve = await mockCurve.deploy()
        this.GovernanceTimelock = await GovernanceTimelock.deploy(1,[this.owner],[this.owner],this.owner);
        this.mockEtherPriceOracle = await mockEtherPriceOracle.deploy()
        this.mockLBRPriceOracle = await mockLBRPriceOracle.deploy()

        this.esLBRBoost = await esLBRBoost.deploy()
        this.configurator = await configurator.deploy(this.GovernanceTimelock.address, this.mockCurve.address)
        this.esLBR = await esLBR.deploy(this.configurator.address)

        // create a LayerZero Endpoint mock for testing
        const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock")
        this.layerZeroEndpointMockSrc = await LZEndpointMock.deploy(this.chainIdSrc)
        this.LBR = await LBR.deploy(this.configurator.address, 8, this.layerZeroEndpointMockSrc.address)


        this.EUSDMock = await EUSDMock.deploy(this.configurator.address)

        await this.configurator.initEUSD(this.EUSDMock.address)

        this.EUSDMiningIncentives = await EUSDMiningIncentives.deploy(this.configurator.address, this.esLBRBoost.address, this.mockEtherPriceOracle.address, this.mockLBRPriceOracle.address)

        this.stETHVault = await LybraStETHDepositVault.deploy(this.configurator.address, this.stETHMock.address, this.oracle.address)
        await this.configurator.setMintVault(this.stETHVault.address, true);
        await this.configurator.setMintVaultMaxSupply(this.stETHVault.address, ethers.utils.parseEther("10000000000"));
        await this.configurator.setBorrowApy(this.stETHVault.address, 200);
        await this.configurator.setEUSDMiningIncentives(this.EUSDMiningIncentives.address)
        await this.EUSDMiningIncentives.setToken(this.LBR.address, this.esLBR.address)
        console.log('eUSDMiningIncentives', await this.configurator.eUSDMiningIncentives())
        console.log('getBoost', await this.EUSDMiningIncentives.getBoost(this.owner))
        console.log('rewardPerToken', await this.EUSDMiningIncentives.rewardPerToken())
        // console.log('earned', await this.EUSDMiningIncentives.earned(this.owner))

        // this.WeUSDMainnet = await WeUSDMainnet.deploy(this.EUSDMock.address, this.configurator.address, 8, this.layerZeroEndpointMockSrc.address)

        // create two magicpool instances

    })

    it("test mint eusd to max collateralRatio", async function () {
        await this.stETHMock.approve(this.stETHVault.address, ethers.utils.parseEther("10000"));

        console.log('stETH allowance', await this.stETHMock.allowance(this.owner, this.stETHVault.address))
        await this.stETHVault.depositAssetToMint(ethers.utils.parseEther("100"), ethers.utils.parseEther("100000"));
        let bal = await this.EUSDMock.balanceOf(this.owner)
        expect(bal).to.equal(ethers.utils.parseEther("100000"));
        await expect(this.stETHVault.mint(this.owner, 1)).to.be.reverted;
        await this.stETHVault.depositAssetToMint(ethers.utils.parseEther("100"), 0);
        await expect(this.stETHVault.mint(this.owner, 1)).to.not.be.reverted;
        await expect(this.stETHVault.depositAssetToMint(ethers.utils.parseEther("1"), ethers.utils.parseEther("101000"))).to.be.reverted;
        await expect(this.stETHVault.depositAssetToMint(ethers.utils.parseEther("1"), ethers.utils.parseEther("100000"))).to.not.be.reverted;
        // await expect(this.stETHVault.mint(this.owner, 100)).to.not.be.reverted;
    })

    it("test repay", async function () {
        await this.stETHMock.approve(this.stETHVault.address, ethers.utils.parseEther("10000"));
        await this.stETHVault.depositAssetToMint(ethers.utils.parseEther("100"), ethers.utils.parseEther("10000"));
        let bal = await this.EUSDMock.balanceOf(this.owner)
        expect(bal).to.equal(ethers.utils.parseEther("10000"));
        await this.stETHVault.mint(this.owner, ethers.utils.parseEther("10000"))
        // await expect(this.EUSDMock.balanceOf(this.owner)).to.equal(ethers.utils.parseEther("20000"));
        await this.stETHVault.burn(this.owner, ethers.utils.parseEther("10000"))
        let bal2 = await this.EUSDMock.balanceOf(this.owner)
        expect(bal2).to.equal(ethers.utils.parseEther("10000"));
        await this.stETHVault.burn(this.owner, ethers.utils.parseEther("30000"))
        await this.stETHVault.withdraw(this.owner, ethers.utils.parseEther("100"))
    })

    it("test withdraw", async function () {
        await this.stETHMock.approve(this.stETHVault.address, ethers.utils.parseEther("10000"));
        await this.stETHVault.depositAssetToMint(ethers.utils.parseEther("100"), ethers.utils.parseEther("100000"));
        await expect(this.stETHVault.withdraw(this.owner, ethers.utils.parseEther("100"))).to.be.reverted;
        await this.stETHVault.burn(this.owner, ethers.utils.parseEther("50000"))
        await expect(this.stETHVault.withdraw(this.owner, ethers.utils.parseEther("50"))).to.not.be.reverted;
        await expect(this.stETHVault.withdraw(this.owner, ethers.utils.parseEther("1"))).to.be.reverted;
        await this.stETHVault.burn(this.owner, ethers.utils.parseEther("10000"))
        await expect(this.stETHVault.withdraw(this.owner, ethers.utils.parseEther("1"))).to.not.be.reverted;
        await expect(this.stETHVault.withdraw(this.owner, ethers.utils.parseEther("49"))).to.be.reverted;
        await this.stETHVault.burn(this.owner, ethers.utils.parseEther("50000"))
        await expect(this.stETHVault.withdraw(this.owner, ethers.utils.parseEther("50"))).to.be.reverted;
        await expect(this.stETHVault.withdraw(this.owner, ethers.utils.parseEther("49"))).to.not.be.reverted;
    })

    it("test excessIncomeDistribution", async function () {
        await this.stETHMock.approve(this.stETHVault.address, ethers.utils.parseEther("10000"));
        await this.stETHVault.depositAssetToMint(ethers.utils.parseEther("1000"), ethers.utils.parseEther("1000000"));
        console.log(await this.stETHMock.balanceOf(this.stETHVault.address))
        await this.EUSDMock.transfer(this.stETHMock.address, ethers.utils.parseEther("900000"))

        const initialTimestamp = (await ethers.provider.getBlock()).timestamp;
        const delay = 365 * 24 * 60 * 60;
        await ethers.provider.send("evm_setNextBlockTimestamp", [initialTimestamp + delay]);
        await ethers.provider.send("evm_mine");

        await this.stETHVault.setLidoRebaseTime(initialTimestamp + delay - 3600 * 23 - 3600)

        console.log(await this.stETHMock.balanceOf(this.stETHVault.address))
        console.log('eusd balance', await this.EUSDMock.balanceOf(this.owner))
        await this.stETHVault.excessIncomeDistribution(ethers.utils.parseEther("10"))
        console.log('owner eusd balance', await this.EUSDMock.balanceOf(this.owner))
        console.log('owner eusd share', await this.EUSDMock.sharesOf(this.owner))
        console.log('config eusd balance', await this.EUSDMock.balanceOf(this.configurator.address))
        await this.stETHVault.excessIncomeDistribution(ethers.utils.parseEther("10"))
        console.log('owner eusd balance', await this.EUSDMock.balanceOf(this.owner))
        console.log('owner eusd share balance', await this.EUSDMock.sharesOf(this.owner))
        console.log('eusd share balance', await this.EUSDMock.getTotalShares())
        console.log('config eusd balance', await this.EUSDMock.balanceOf(this.configurator.address))
        console.log('other eusd balance', await this.EUSDMock.balanceOf(this.stETHMock.address))
        await this.stETHVault.excessIncomeDistribution(ethers.utils.parseEther("30"))
        console.log('owner eusd balance', await this.EUSDMock.balanceOf(this.owner))
        console.log('owner eusd share balance', await this.EUSDMock.sharesOf(this.owner))
        console.log('eusd share balance', await this.EUSDMock.getTotalShares())
        console.log('config eusd balance', await this.EUSDMock.balanceOf(this.configurator.address))
        console.log('other eusd balance', await this.EUSDMock.balanceOf(this.stETHMock.address))
      });

      it("test redeem", async function () {
        await this.stETHMock.approve(this.stETHVault.address, ethers.utils.parseEther("10000"));
        await this.stETHVault.depositAssetToMint(ethers.utils.parseEther("1000"), ethers.utils.parseEther("1000000"));
        console.log(await this.stETHMock.balanceOf(this.stETHVault.address))
        await this.EUSDMock.transfer(this.user2, ethers.utils.parseEther("500000"))
        await expect(this.stETHVault.rigidRedemption(this.owner, ethers.utils.parseEther("100000"))).to.be.reverted
        
        await this.configurator.becomeRedemptionProvider(true)
        console.log('borrowed', await this.stETHVault.getBorrowedOf(this.owner))
        console.log('deposited', await this.stETHVault.depositedAsset(this.owner))
        await expect(this.stETHVault.connect(this.accounts[1]).rigidRedemption(this.owner, ethers.utils.parseEther("100000"))).to.not.be.reverted
        console.log('borrowed', await this.stETHVault.getBorrowedOf(this.owner))
        console.log('deposited', await this.stETHVault.depositedAsset(this.owner))
        console.log('payout ether', await this.stETHMock.balanceOf(this.user2))

      });
})
