# Lybra Finance audit details
- Total Prize Pool: $60,500 USDC 
  - HM awards: $41,250 USDC 
  - Analysis awards: $2,500 USDC 
  - QA awards: $1,250 USDC 
  - Bot Race awards: $3,750 USDC 
  - Gas awards: $1,250 USDC 
  - Judge awards: $6,000 USDC 
  - Lookout awards: $4,000 USDC 
  - Scout awards: $500 USDC
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2023-06-lybra-finance/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts June 23, 2023 20:00 UTC 
- Ends July 3, 2023 20:00 UTC 

## Automated Findings / Publicly Known Issues

Automated findings output for the audit can be found [here](https://gist.github.com/liveactionllama/27513952718ec3cbcf9de0fda7fef49c).

*Note for C4 wardens: Anything included in the automated findings output is considered a publicly known issue and is ineligible for awards.*

# Overview

Lybra Finance is a groundbreaking DeFi protocol focused on bringing stability to the volatile cryptocurrency market through its innovative stablecoin, eUSD. Built on LSD/LST's, the protocol initially utilizes Lido Finance-issued stETH as its primary components and plans to support additional LST's in the upcoming V2.

eUSD is an omnichain LSD/LST-based stablecoin solution. Lybra has been capitalizing on the fresh avenues ushered in by LSD/LST's to offer the world's first interest-bearing stablecoin. In doing so, it is creating exactly the kind of profit-generating utility that LSD/LST's need to start fulfilling their vast potential.

With the rollout of V2, Lybra will be introducing peUSD into its ecosystem. Consider peUSD as the DeFi-optimized version of eUSD. It's designed to be bridged to any supported L2's, without any constraints on liquidity.

## Scope
### Files in scope
|File|[SLOC](#nowhere "(nSLOC, SLOC, Lines)")|Description|Libraries|
|:-|:-:|:-|:-|
|_Contracts (19)_|
|[contracts/lybra/Proxy/LybraProxyAdmin.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/Proxy/LybraProxyAdmin.sol)|[3](#nowhere "(nSLOC:3, SLOC:3, Lines:6)")|This contract is the admin of the lybra proxy contracts.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/Proxy/LybraProxy.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/Proxy/LybraProxy.sol)|[5](#nowhere "(nSLOC:5, SLOC:5, Lines:10)")|This contract inherits TransparentUpgradeableProxy, used to upgrade LybraConfigurator.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/governance/AdminTimelock.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/governance/AdminTimelock.sol)|[5](#nowhere "(nSLOC:5, SLOC:5, Lines:9)")|Timelock for Lybra Admin| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/governance/GovernanceTimelock.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/governance/GovernanceTimelock.sol) [🧮](#nowhere "Uses Hash-Functions")|[22](#nowhere "(nSLOC:22, SLOC:22, Lines:33)")|Timelock for Lybra DAO| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/pools/LybraWbETHVault.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/LybraWbETHVault.sol) [💰](#nowhere "Payable Functions")|[26](#nowhere "(nSLOC:26, SLOC:26, Lines:37)")|This contract inherits from the LybraPeUSDVaultBase contract and supports collateralizing WbETH to borrow PeUSD. When users deposit ETH, the contract will deposit the ETH into the WbETH contract and convert it to WbETH.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/token/esLBR.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/esLBR.sol) [♻️](#nowhere "TryCatch Blocks")|[29](#nowhere "(nSLOC:29, SLOC:29, Lines:44)")|The eUSD contract is an interest-bearing ERC20-like token designed for the Lybra protocol. It represents the holder's share in the total amount of Ether controlled by the protocol. The contract stores the sum of all shares to calculate each account's token balance, which is based on the account's shares and the total supply of eUSD.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/pools/LybraWstETHVault.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/LybraWstETHVault.sol) [💰](#nowhere "Payable Functions")|[33](#nowhere "(nSLOC:33, SLOC:33, Lines:51)")|This contract inherits from the LybraPeUSDVaultBase contract and supports collateralizing WstETH to borrow PeUSD. When users deposit ETH, the contract will deposit the ETH into the Lido contract and convert it to WstETH.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/pools/LybraRETHVault.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/LybraRETHVault.sol) [💰](#nowhere "Payable Functions") [🧮](#nowhere "Uses Hash-Functions")|[35](#nowhere "(nSLOC:35, SLOC:35, Lines:49)")|This contract inherits from the LybraPeUSDVaultBase contract and supports collateralizing Rocket Pool ETH(rETH) to borrow PeUSD. When users deposit ETH, the contract will deposit the ETH into the RocketDepositPool contract and convert it to rETH.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/token/PeUSD.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/PeUSD.sol)|[37](#nowhere "(nSLOC:37, SLOC:37, Lines:55)")|PeUSD is a stable, interest-free ERC20-like token minted through eUSD in the Lybra protocol. It is pegged to 1eUSD and does not undergo rebasing. The token operates by allowing users to deposit eUSD and mint an equivalent amount of PeUSD. When users redeem PeUSD, they can retrieve the corresponding proportion of eUSD. As a result, users can utilize PeUSD without sacrificing the yield on their eUSD holdings.In addition to minting PeUSD by using eUSD as collateral, PeUSD can also be minted by depositing assets (such as WstETH) into non-rebase asset vaults.PeUSD leverages the LayerZero's OFT protocol to enable native cross-chain functionality, allowing seamless transfers and interactions across different blockchain networks. By integrating with OFT, PeUSD is not constrained by liquidity pools and can freely move between chains. This interoperability enhances the versatility and utility of PeUSD, empowering users with the ability to utilize PeUSD's stable value and features across multiple blockchain ecosystems.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/miner/esLBRBoost.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/esLBRBoost.sol)|[48](#nowhere "(nSLOC:48, SLOC:48, Lines:70)")|This contract is used to allow users to set the lock-up period for their esLBR tokens to accelerate mining.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/token/LBR.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/LBR.sol)|[52](#nowhere "(nSLOC:52, SLOC:52, Lines:73)")|LBR is an ERC20-compliant token leverages the LayerZero's OFT protocol to enable native cross-chain functionality, allowing seamless transfers and interactions across different blockchain networks.Apart from the initial production, LBR can only be produced by destroying esLBR in the fund contract.LBR can only be exchanged to esLBR in the lybraFund contract.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/pools/LybraStETHVault.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/LybraStETHVault.sol) [💰](#nowhere "Payable Functions") [📤](#nowhere "Initiates ETH Value Transfer") [🧮](#nowhere "Uses Hash-Functions") [♻️](#nowhere "TryCatch Blocks")|[63](#nowhere "(nSLOC:63, SLOC:63, Lines:110)")|This contract inherits from the LybraEUSDVaultBase contract and supports collateralizing stETH to borrow eUSD. When users deposit ETH, the contract will deposit the ETH into the Lido contract and convert it to stETH.In addition, this contract implements the logic to convert the rebase earnings of stETH held in the vault into eUSD yield. The conversion process follows the Dutch auction mechanism, where the price remains unchanged for 1 hour during the rebase period and then decreases by 1% every 30 minutes to encourage users to initiate the conversion themselves.||
|[contracts/lybra/miner/stakerewardV2pool.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/stakerewardV2pool.sol) [📤](#nowhere "Initiates ETH Value Transfer")|[105](#nowhere "(nSLOC:101, SLOC:105, Lines:150)")|This contract is a derivative version of Synthetix StakingRewards.sol, distributing rewards to LPs stakers.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/governance/LybraGovernance.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/governance/LybraGovernance.sol) [🧮](#nowhere "Uses Hash-Functions")|[111](#nowhere "(nSLOC:111, SLOC:111, Lines:206)")|Lybra onchain governance module| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/token/PeUSDMainnetStableVision.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/PeUSDMainnetStableVision.sol) [💰](#nowhere "Payable Functions")|[118](#nowhere "(nSLOC:111, SLOC:118, Lines:199)")|This contract keeps track of the totalShares of eUSD deposited by users and the totalMinted PeUSD.When users redeem PeUSD, they can retrieve the corresponding proportion of eUSD.As a result, users can utilize PeUSD without sacrificing the yield on their eUSD holdings.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/miner/ProtocolRewardsPool.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/ProtocolRewardsPool.sol) [📤](#nowhere "Initiates ETH Value Transfer")|[155](#nowhere "(nSLOC:153, SLOC:155, Lines:228)")|This contract is a derivative version of Synthetix StakingRewards.sol, distributing Protocol revenue to esLBR stakers.Converting esLBR to LBR.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/token/EUSD.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/EUSD.sol) [Σ](#nowhere "Unchecked Blocks")|[174](#nowhere "(nSLOC:174, SLOC:174, Lines:487)")|The eUSD contract is an interest-bearing ERC20-like token designed for the Lybra protocol. It represents the holder's share in the total amount of Ether controlled by the protocol. The contract stores the sum of all shares to calculate each account's token balance, which is based on the account's shares and the total supply of eUSD.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/configuration/LybraConfigurator.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/configuration/LybraConfigurator.sol) [📤](#nowhere "Initiates ETH Value Transfer") [🧮](#nowhere "Uses Hash-Functions")|[183](#nowhere "(nSLOC:181, SLOC:183, Lines:356)")|This contract is used for setting various parameters and control functionalities of the Lybra Protocol.||
|[contracts/lybra/miner/EUSDMiningIncentives.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/EUSDMiningIncentives.sol) [♻️](#nowhere "TryCatch Blocks")|[193](#nowhere "(nSLOC:187, SLOC:193, Lines:247)")|This contract is a stripped down version of Synthetix StakingRewards.sol, to reward esLBR to EUSD minters.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/) `@chainlink/*`|
|_Abstracts (2)_|
|[contracts/lybra/pools/base/LybraEUSDVaultBase.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/base/LybraEUSDVaultBase.sol) [💰](#nowhere "Payable Functions") [📤](#nowhere "Initiates ETH Value Transfer") [♻️](#nowhere "TryCatch Blocks")|[180](#nowhere "(nSLOC:180, SLOC:180, Lines:328)")|This contract is the base implementation for rebasing Lst vaults. This contract is abstract. All rebasing asset pool contracts inherit from LybraEUSDVaultBase.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/pools/base/LybraPeUSDVaultBase.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/base/LybraPeUSDVaultBase.sol) [💰](#nowhere "Payable Functions") [📤](#nowhere "Initiates ETH Value Transfer") [♻️](#nowhere "TryCatch Blocks")|[185](#nowhere "(nSLOC:185, SLOC:185, Lines:296)")|This contract is the base implementation for Non-rebasing Lst vaults. This contract is abstract. All Non-rebasing assets pool contracts inherit from LybraPeUSDVaultBase.| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|Total (over 21 files):| [1762](#nowhere "(nSLOC:1741, SLOC:1762, Lines:3044)") ||

## Out of scope
### All other source contracts (not in scope)
|File|[SLOC](#nowhere "(nSLOC, SLOC, Lines)")|Description|Libraries|
|:-|:-:|:-|:-|
|_Abstracts (4)_|
|[contracts/OFT/BaseOFTV2.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/BaseOFTV2.sol) [💰](#nowhere "Payable Functions")|[25](#nowhere "(nSLOC:25, SLOC:25, Lines:43)")|| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/OFT/lzApp/NonblockingLzApp.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/lzApp/NonblockingLzApp.sol) [💰](#nowhere "Payable Functions") [🧮](#nowhere "Uses Hash-Functions")|[33](#nowhere "(nSLOC:33, SLOC:33, Lines:57)")|||
|[contracts/OFT/lzApp/LzApp.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/lzApp/LzApp.sol) [🖥](#nowhere "Uses Assembly") [🧮](#nowhere "Uses Hash-Functions")|[98](#nowhere "(nSLOC:98, SLOC:98, Lines:139)")|| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/OFT/OFTCoreV2.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/OFTCoreV2.sol) [🧮](#nowhere "Uses Hash-Functions")|[162](#nowhere "(nSLOC:162, SLOC:162, Lines:243)")|||
|_Libraries (4)_|
|[contracts/OFT/libraries/LzLib.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/libraries/LzLib.sol) [🖥](#nowhere "Uses Assembly") [🧪](#nowhere "Experimental Features")|[54](#nowhere "(nSLOC:54, SLOC:54, Lines:81)")|||
|[contracts/OFT/util/BitLib.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/util/BitLib.sol)|[54](#nowhere "(nSLOC:54, SLOC:54, Lines:63)")|||
|[contracts/OFT/util/ExcessivelySafeCall.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/util/ExcessivelySafeCall.sol) [🖥](#nowhere "Uses Assembly")|[73](#nowhere "(nSLOC:60, SLOC:73, Lines:136)")|||
|[contracts/OFT/util/BytesLib.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/util/BytesLib.sol) [🖥](#nowhere "Uses Assembly")|[309](#nowhere "(nSLOC:287, SLOC:309, Lines:510)")|||
|_Interfaces (18)_|
|[contracts/OFT/IOFTReceiverV2.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/IOFTReceiverV2.sol)|[4](#nowhere "(nSLOC:4, SLOC:4, Lines:16)")|||
|[contracts/OFT/interfaces/ILayerZeroReceiver.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/interfaces/ILayerZeroReceiver.sol)|[4](#nowhere "(nSLOC:4, SLOC:4, Lines:12)")|||
|[contracts/OFT/interfaces/IStargatePool.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/interfaces/IStargatePool.sol)|[4](#nowhere "(nSLOC:4, SLOC:4, Lines:6)")|||
|[contracts/OFT/interfaces/IStargateFactory.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/interfaces/IStargateFactory.sol)|[5](#nowhere "(nSLOC:5, SLOC:5, Lines:8)")|||
|[contracts/lybra/interfaces/IGovernanceTimelock.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/interfaces/IGovernanceTimelock.sol)|[5](#nowhere "(nSLOC:5, SLOC:5, Lines:7)")|||
|[contracts/OFT/IOFTV2.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/IOFTV2.sol) [💰](#nowhere "Payable Functions")|[6](#nowhere "(nSLOC:6, SLOC:6, Lines:25)")|||
|[contracts/OFT/interfaces/ILayerZeroUserApplicationConfig.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/interfaces/ILayerZeroUserApplicationConfig.sol)|[7](#nowhere "(nSLOC:7, SLOC:7, Lines:25)")|||
|[contracts/lybra/interfaces/IesLBR.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/interfaces/IesLBR.sol)|[9](#nowhere "(nSLOC:9, SLOC:9, Lines:11)")|||
|[contracts/OFT/interfaces/IStargateReceiver.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/interfaces/IStargateReceiver.sol)|[11](#nowhere "(nSLOC:4, SLOC:11, Lines:14)")|||
|[contracts/OFT/interfaces/IStargateRouterETH.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/interfaces/IStargateRouterETH.sol) [💰](#nowhere "Payable Functions")|[12](#nowhere "(nSLOC:6, SLOC:12, Lines:16)")|||
|[contracts/lybra/interfaces/ILybra.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/interfaces/ILybra.sol)|[12](#nowhere "(nSLOC:12, SLOC:12, Lines:14)")|||
|[contracts/OFT/ICommonOFT.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/ICommonOFT.sol)|[13](#nowhere "(nSLOC:13, SLOC:13, Lines:39)")|| [`@openzeppelin/*`](https://openzeppelin.com/contracts/)|
|[contracts/lybra/interfaces/IPeUSD.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/interfaces/IPeUSD.sol)|[17](#nowhere "(nSLOC:11, SLOC:17, Lines:19)")|||
|[contracts/OFT/interfaces/ILayerZeroEndpoint.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/interfaces/ILayerZeroEndpoint.sol) [💰](#nowhere "Payable Functions")|[19](#nowhere "(nSLOC:19, SLOC:19, Lines:87)")|||
|[contracts/lybra/interfaces/Iconfigurator.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/interfaces/Iconfigurator.sol)|[24](#nowhere "(nSLOC:24, SLOC:24, Lines:27)")|||
|[contracts/OFT/interfaces/IStargateWidget.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/interfaces/IStargateWidget.sol) [💰](#nowhere "Payable Functions")|[31](#nowhere "(nSLOC:14, SLOC:31, Lines:40)")|||
|[contracts/lybra/interfaces/IEUSD.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/interfaces/IEUSD.sol)|[40](#nowhere "(nSLOC:17, SLOC:40, Lines:55)")|||
|[contracts/OFT/interfaces/IStargateRouter.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/interfaces/IStargateRouter.sol) [💰](#nowhere "Payable Functions")|[62](#nowhere "(nSLOC:16, SLOC:62, Lines:72)")|||
|Total (over 26 files):| [1093](#nowhere "(nSLOC:953, SLOC:1093, Lines:1765)") ||


### External imports
* **@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol**
  * [contracts/lybra/miner/EUSDMiningIncentives.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/EUSDMiningIncentives.sol)
* **@openzeppelin/contracts/access/Ownable.sol**
  * ~~[contracts/OFT/lzApp/LzApp.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/lzApp/LzApp.sol)~~
  * [contracts/lybra/miner/ProtocolRewardsPool.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/ProtocolRewardsPool.sol)
  * [contracts/lybra/miner/EUSDMiningIncentives.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/EUSDMiningIncentives.sol)
  * [contracts/lybra/miner/esLBRBoost.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/esLBRBoost.sol)
  * [contracts/lybra/miner/stakerewardV2pool.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/stakerewardV2pool.sol)
* **@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol**
  * [contracts/lybra/governance/LybraGovernance.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/governance/LybraGovernance.sol)
* **@openzeppelin/contracts/governance/TimelockController.sol**
  * [contracts/lybra/governance/AdminTimelock.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/governance/AdminTimelock.sol)
  * [contracts/lybra/governance/GovernanceTimelock.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/governance/GovernanceTimelock.sol)
* **@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol**
  * [contracts/lybra/Proxy/LybraProxyAdmin.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/Proxy/LybraProxyAdmin.sol)
* **@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol**
  * [contracts/lybra/Proxy/LybraProxy.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/Proxy/LybraProxy.sol)
* **@openzeppelin/contracts/token/ERC20/ERC20.sol**
  * [contracts/lybra/miner/ProtocolRewardsPool.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/ProtocolRewardsPool.sol)
  * [contracts/lybra/pools/LybraRETHVault.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/LybraRETHVault.sol)
  * [contracts/lybra/pools/LybraWbETHVault.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/LybraWbETHVault.sol)
  * [contracts/lybra/pools/LybraWstETHVault.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/LybraWstETHVault.sol)
  * [contracts/lybra/token/LBR.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/LBR.sol)
  * [contracts/lybra/token/PeUSD.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/PeUSD.sol)
  * [contracts/lybra/token/PeUSDMainnetStableVision.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/PeUSDMainnetStableVision.sol)
* **@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol**
  * [contracts/lybra/token/esLBR.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/esLBR.sol)
* **@openzeppelin/contracts/token/ERC20/IERC20.sol**
  * [contracts/lybra/miner/stakerewardV2pool.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/miner/stakerewardV2pool.sol)
  * [contracts/lybra/pools/base/LybraEUSDVaultBase.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/base/LybraEUSDVaultBase.sol)
  * [contracts/lybra/pools/base/LybraPeUSDVaultBase.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/pools/base/LybraPeUSDVaultBase.sol)
  * [contracts/lybra/token/EUSD.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/EUSD.sol)
* **@openzeppelin/contracts/utils/Context.sol**
  * [contracts/lybra/token/EUSD.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/EUSD.sol)
* **@openzeppelin/contracts/utils/introspection/ERC165.sol**
  * ~~[contracts/OFT/BaseOFTV2.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/BaseOFTV2.sol)~~
* **@openzeppelin/contracts/utils/introspection/IERC165.sol**
  * ~~[contracts/OFT/ICommonOFT.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/OFT/ICommonOFT.sol)~~
* **@openzeppelin/contracts/utils/math/SafeMath.sol**
  * [contracts/lybra/token/EUSD.sol](https://github.com/code-423n4/2023-06-lybra/blob/main/contracts/lybra/token/EUSD.sol)


# Additional Context

## Scoping Details 
```
- If you have a public code repo, please share it here:  https://github.com/LybraFinance/LybraV2
- How many contracts are in scope?:   27
- Total SLoC for these contracts?:  1866
- How many external imports are there?: 3 
- How many separate interfaces and struct definitions are there for the contracts within scope?:  0 separate interfaces and 5 struct definitions
- Does most of your code generally use composition or inheritance?:   Inheritance
- How many external calls?:   3
- What is the overall line coverage percentage provided by your tests?:  0
- Is there a need to understand a separate part of the codebase / get context in order to audit this part of the protocol?:   false
- Please describe required context:   n/a
- Does it use an oracle?:  Yes, Chainlink
- Does the token conform to the ERC20 standard?:  True
- Are there any novel or unique curve logic or mathematical models?: The Lybra Protocol introduces a novel design for eUSD interest rebases. When the balance of stETH increases through LSD or other reasons, the excess income is sold for eUSD. This additional stETH is exchanged for eUSD based on the current price, and the eUSD shares of the previous holder are destroyed. As a result, the balances of other eUSD holders increase due to the decrease in total shares. This design ensures that the interest rebases are conducted in a fair and efficient manner, allowing for the distribution of additional income to all eUSD holders.
- Does it use a timelock function?:  True
- Is it an NFT?: no
- Does it have an AMM?: no  
- Is it a fork of a popular project?:   False
- Does it use rollups?: no  
- Is it multi-chain?:  True
- Does it use a side-chain?: False
```

## Tests

**No tests are available.**

## Gas reports

**No gas reports are available.**

## Quickstart command

```
rm -Rf 2023-06-lybra || true && git clone https://github.com/code-423n4/2023-06-lybra.git -j8 && cd 2023-06-lybra && npm install && npm run build
```
