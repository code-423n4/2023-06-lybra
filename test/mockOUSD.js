const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("lybra protolcol", function () {
    beforeEach(async function () {
        this.accounts = await ethers.getSigners()
        this.owner = this.accounts[0].address

        // use this chainId
        this.chainIdSrc = 1
        this.chainIdDst = 2
        this.chainId3 = 3

        const oracle = await ethers.getContractFactory("mockChainlink")
        const stETH = await ethers.getContractFactory("stETHMock")
        const EUSDMock = await ethers.getContractFactory("EUSDMock")
        const GovernanceTimelock = await ethers.getContractFactory("GovernanceTimelock")
        const configurator = await ethers.getContractFactory("Configurator")
        const PeUSDMainnet = await ethers.getContractFactory("PeUSDMainnet")
        const PeUSDL2 = await ethers.getContractFactory("PeUSD")
        const esLBRBoost = await ethers.getContractFactory("esLBRBoost")
        const mockCurve = await ethers.getContractFactory("mockCurve")
        
        this.oracle = await oracle.deploy()
        this.stETHMock = await stETH.deploy()
        this.mockCurve = await mockCurve.deploy()
        this.GovernanceTimelock = await GovernanceTimelock.deploy(1,[this.owner],[this.owner],this.owner);

        this.esLBRBoost = await esLBRBoost.deploy()
        this.configurator = await configurator.deploy(this.GovernanceTimelock.address, this.mockCurve.address)

        // create a LayerZero Endpoint mock for testing
        const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock")
        this.layerZeroEndpointMockSrc = await LZEndpointMock.deploy(this.chainIdSrc)
        this.layerZeroEndpointMockDst = await LZEndpointMock.deploy(this.chainIdDst)
        this.layerZeroEndpointMock3 = await LZEndpointMock.deploy(this.chainId3)
        this.EUSDMock = await EUSDMock.deploy(this.configurator.address)

        await this.configurator.initEUSD(this.EUSDMock.address)
        console.log('getEUSDMaxLocked', await this.configurator.getEUSDMaxLocked())

        

        this.PeUSDMainnet = await PeUSDMainnet.deploy(this.configurator.address, 8, this.layerZeroEndpointMockSrc.address)

        // create two magicpool instances

        this.peusdarbi = await PeUSDL2.deploy(8, this.layerZeroEndpointMockDst.address)
        this.peusdzk = await PeUSDL2.deploy(8, this.layerZeroEndpointMock3.address)

        //setUseCustomAdapterParams
        // this.PeUSDMainnet.setUseCustomAdapterParams(true)
        // this.peusdarbi.setUseCustomAdapterParams(true)
        // this.peusdzk.setUseCustomAdapterParams(true)

        // //setMinDstGas 

        // this.PeUSDMainnet.setMinDstGas(this.chainIdDst, 0, 350000);
        // this.PeUSDMainnet.setMinDstGas(this.chainId3, 0, 350000);

        // this.peusdarbi.setMinDstGas(this.chainIdSrc, 0, 350000);
        // this.peusdarbi.setMinDstGas(this.chainId3, 0, 350000);

        // this.peusdzk.setMinDstGas(this.chainIdSrc, 0, 350000);
        // this.peusdzk.setMinDstGas(this.chainIdDst, 0, 350000);

        

        this.layerZeroEndpointMockSrc.setDestLzEndpoint(this.peusdarbi.address, this.layerZeroEndpointMockDst.address)
        this.layerZeroEndpointMockSrc.setDestLzEndpoint(this.peusdzk.address, this.layerZeroEndpointMock3.address)

        this.layerZeroEndpointMockDst.setDestLzEndpoint(this.PeUSDMainnet.address, this.layerZeroEndpointMockSrc.address)
        this.layerZeroEndpointMockDst.setDestLzEndpoint(this.peusdzk.address, this.layerZeroEndpointMock3.address)

        this.layerZeroEndpointMock3.setDestLzEndpoint(this.PeUSDMainnet.address, this.layerZeroEndpointMockSrc.address)
        this.layerZeroEndpointMock3.setDestLzEndpoint(this.peusdarbi.address, this.layerZeroEndpointMockDst.address)

        // set each contracts source address so it can send to each other
        await this.PeUSDMainnet.setTrustedRemote(
            this.chainIdDst,
            ethers.utils.solidityPack(["address", "address"], [this.peusdarbi.address, this.PeUSDMainnet.address])
        ) // for A, set B
        await this.PeUSDMainnet.setTrustedRemote(
            this.chainId3,
            ethers.utils.solidityPack(["address", "address"], [this.peusdzk.address, this.PeUSDMainnet.address])
        ) // for A, set C
        await this.peusdarbi.setTrustedRemote(
            this.chainIdSrc,
            ethers.utils.solidityPack(["address", "address"], [this.PeUSDMainnet.address, this.peusdarbi.address])
        ) // for B, set A
        await this.peusdarbi.setTrustedRemote(
            this.chainId3,
            ethers.utils.solidityPack(["address", "address"], [this.peusdzk.address, this.peusdarbi.address])
        ) // for B, set A

        await this.peusdzk.setTrustedRemote(
            this.chainIdSrc,
            ethers.utils.solidityPack(["address", "address"], [this.PeUSDMainnet.address, this.peusdzk.address])
        ) // for B, set A
        await this.peusdzk.setTrustedRemote(
            this.chainIdDst,
            ethers.utils.solidityPack(["address", "address"], [this.peusdarbi.address, this.peusdzk.address])
        ) // for B, set A
        // await this.peusdzk.setMinDstGas(
        //     this.chainIdSrc,
        //     1, 200000)

    })

    it("STEP 1", async function () {
        this.EUSDMock.approve(this.PeUSDMainnet.address, ethers.utils.parseEther("10000"));


        console.log('EUSDMock allowance', await this.EUSDMock.allowance(this.owner, this.PeUSDMainnet.address))
        await this.PeUSDMainnet.convertToPeUSD(this.owner, ethers.utils.parseEther("100"));
        console.log('EUSDMock balance in peusd', await this.EUSDMock.balanceOf(this.PeUSDMainnet.address))
        let peusdbalance = await this.PeUSDMainnet.balanceOf(this.owner)
        console.log('PeUSDMainnet balance', peusdbalance)
        let _callParams = [this.owner, ethers.constants.AddressZero,'0x']
        // let _callParams = [this.owner, ethers.constants.AddressZero, ethers.utils.solidityPack(["uint16", "uint256"], [1, 400000])]
        // sendFrom(address _from, uint16 _dstChainId, bytes32 _toAddress, uint _amount, LzCallParams calldata _callParams)
        await this.PeUSDMainnet.sendFrom(this.owner, 2, ethers.utils.hexZeroPad(this.owner, 32), peusdbalance, _callParams, { value: ethers.utils.parseEther("0.5") })
        // await this.magicpool.deposit(this.owner, ethers.utils.parseEther("100"), 2, ethers.utils.solidityPack(["uint16", "uint"], [1, 350000]), { value: ethers.utils.parseEther("0.035") })
        // console.log('mint to 2', await this.EUSDMock.balanceOf(this.owner))
        
        // await this.magicpool.transferToChain(this.chainIdDst, this.owner, ethers.utils.parseEther("100"),  ethers.utils.solidityPack(["uint16", "uint"], [1, 350000]), { value: ethers.utils.parseEther("0.5") })
        let chain2balance = await this.peusdarbi.balanceOf(this.owner)
        console.log('arbi balance', chain2balance)
        console.log('mint to arbi, peusdmainet balance = ', await this.PeUSDMainnet.balanceOf(this.owner))

        await this.peusdarbi.sendFrom(this.owner, this.chainId3, ethers.utils.hexZeroPad(this.owner, 32), chain2balance.div(2), _callParams, { value: ethers.utils.parseEther("0.5") })

        console.log('chain2 after transfer to 3', await this.peusdarbi.balanceOf(this.owner))
        console.log('chain3 after transfer from 2', await this.peusdzk.balanceOf(this.owner))
        console.log('PeUSDMainnet balance before transfer from 3', await this.PeUSDMainnet.balanceOf(this.owner))
        await this.peusdzk.sendFrom(this.owner, this.chainIdSrc, ethers.utils.hexZeroPad(this.owner, 32), chain2balance.div(4), _callParams, { value: ethers.utils.parseEther("0.5") })
        console.log('chain3 after transfer to 1', await this.peusdzk.balanceOf(this.owner))
        console.log('chain1 peusd after transfer from 3', await this.PeUSDMainnet.balanceOf(this.owner))

        // console.log('chain1 eusd before transfer from 3', await this.EUSDMock.balanceOf(this.owner))

        // let _callParams2 = [this.owner, ethers.constants.AddressZero, ethers.utils.solidityPack(["uint16", "uint"], [1, 3500000])]
        // await this.peusdzk.sendAndCall(this.owner, this.chainIdSrc, ethers.utils.hexZeroPad(this.PeUSDMainnet.address, 32), chain2balance.div(4), ethers.utils.hexZeroPad(this.owner, 32), 300000,  _callParams2, { value: ethers.utils.parseEther("0.5") })
        // console.log('chain1 eusd after transfer from 3', await this.EUSDMock.balanceOf(this.owner))
        // console.log('chain1 peusd after transfer from 3', await this.PeUSDMainnet.balanceOf(this.owner))
    })
})
