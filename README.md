# Lybra Finance audit details
- Total Prize Pool: $60,500 USDC 
  - HM awards: $40,000 USDC 
  - Analysis awards: $2,500 USDC 
  - QA awards: $5,000 USDC 
  - Bot Race awards: $3,750 USDC 
  - Gas awards: $1,250 USDC 
  - Judge awards: $6,000 USDC 
  - Lookout awards: $2,670 USDC 
  - Scout awards: $500 USDC 
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2023-06-lybra-finance/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts June 23, 2023 20:00 UTC 
- Ends June 30, 2023 20:00 UTC 

## Automated Findings / Publicly Known Issues

Automated findings output for the audit can be found [here](add link to report) within 24 hours of audit opening.

*Note for C4 wardens: Anything included in the automated findings output is considered a publicly known issue and is ineligible for awards.*

# Overview

Lybra Finance is a groundbreaking DeFi protocol focused on bringing stability to the volatile cryptocurrency market through its innovative stablecoin, eUSD. Built on LSD/LST's, the protocol initially utilizes Lido Finance-issued stETH as its primary components and plans to support additional LST's in the upcoming V2.

eUSD is an omnichain LSD/LST-based stablecoin solution. Lybra has been capitalizing on the fresh avenues ushered in by LSD/LST's to offer the world's first interest-bearing stablecoin. In doing so, it is creating exactly the kind of profit-generating utility that LSD/LST's need to start fulfilling their vast potential.

With the rollout of V2, Lybra will be introducing peUSD into its ecosystem. Consider peUSD as the DeFi-optimized version of eUSD. It's designed to be bridged to any supported L2's, without any constraints on liquidity.

# Scope

| Contract | SLOC | Purpose | Libraries used |  
| ----------- | ----------- | ----------- | ----------- |
| [configuration/LybraConfigurator.sol](contracts/lybra/configuration/LybraConfigurator.sol) | 180 | This contract is used for setting various parameters and control functionalities of the Lybra Protocol.  | n/a |
| [governance/AdminTimelock.sol](contracts/lybra/governance/AdminTimelock.sol) | 5 | Timelock for Lybra Admin | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [governance/GovernanceTimelock.sol](contracts/lybra/governance/GovernanceTimelock.sol) | 22 | Timelock for Lybra DAO | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [governance/LybraGovernance.sol](contracts/lybra/governance/LybraGovernance.sol) | 108 | Lybra onchain governance module | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [miner/DividendPool.sol](contracts/lybra/miner/DividendPool.sol) | 155 | This contract is a derivative version of Synthetix StakingRewards.sol, distributing Protocol revenue to esLBR stakers.Converting esLBR to LBR. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [miner/esLBRBoost.sol](contracts/lybra/miner/esLBRBoost.sol) | 48 | This contract is used to allow users to set the lock-up period for their esLBR tokens to accelerate mining.  | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [miner/EUSDMiningIncentives.sol](contracts/lybra/miner/EUSDMiningIncentives.sol) | 193 | This contract is a stripped down version of Synthetix StakingRewards.sol, to reward esLBR to EUSD minters. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [miner/stakerewardV2pool.sol](contracts/lybra/miner/stakerewardV2pool.sol) | 105 | This contract is a derivative version of Synthetix StakingRewards.sol, distributing rewards to LPs stakers. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [pools/base/LybraEUSDVaultBase.sol](contracts/lybra/pools/base/LybraEUSDVaultBase.sol) | 180 | This contract is the base implementation for rebasing Lst vaults. This contract is abstract. All rebasing asset pool contracts inherit from LybraEUSDVaultBase. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [pools/base/LybraPeUSDVaultBase.sol](contracts/lybra/pools/base/LybraPeUSDVaultBase.sol) | 185 | This contract is the base implementation for Non-rebasing Lst vaults. This contract is abstract. All Non-rebasing assets pool contracts inherit from LybraPeUSDVaultBase. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [pools/LybraRETHVault.sol](contracts/lybra/pools/LybraRETHVault.sol) | 35 | This contract inherits from the LybraPeUSDVaultBase contract and supports collateralizing Rocket Pool ETH(rETH) to borrow PeUSD. When users deposit ETH, the contract will deposit the ETH into the RocketDepositPool contract and convert it to rETH. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [pools/LybraStETHVault.sol](contracts/lybra/pools/LybraStETHVault.sol) | 63 | This contract inherits from the LybraEUSDVaultBase contract and supports collateralizing stETH to borrow eUSD. When users deposit ETH, the contract will deposit the ETH into the Lido contract and convert it to stETH.In addition, this contract implements the logic to convert the rebase earnings of stETH held in the vault into eUSD yield. The conversion process follows the Dutch auction mechanism, where the price remains unchanged for 1 hour during the rebase period and then decreases by 1% every 30 minutes to encourage users to initiate the conversion themselves. | n/a |
| [pools/LybraWbETHVault.sol](contracts/lybra/pools/LybraWbETHVault.sol) | 26 | This contract inherits from the LybraPeUSDVaultBase contract and supports collateralizing WbETH to borrow PeUSD. When users deposit ETH, the contract will deposit the ETH into the WbETH contract and convert it to WbETH. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [pools/LybraWstETHVault.sol](contracts/lybra/pools/LybraWstETHVault.sol) | 33 | This contract inherits from the LybraPeUSDVaultBase contract and supports collateralizing WstETH to borrow PeUSD. When users deposit ETH, the contract will deposit the ETH into the Lido contract and convert it to WstETH. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [proxy/LybraProxy.sol](contracts/lybra/Proxy/LybraProxy.sol) | 5 | This contract inherits TransparentUpgradeableProxy, used to upgrade LybraConfigurator. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [proxy/LybraProxyAdmin.sol](contracts/lybra/Proxy/LybraProxyAdmin.sol) | 3 | This contract is the admin of the lybra proxy contracts. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [token/esLBR.sol](contracts/lybra/token/esLBR.sol) | 29 | esLBR is an ERC-20 token that allows the owner to delegate voting rights to any address, including their own address. Changes to the owner’s token balance automatically adjust the voting rights of the delegate.esLBR is escrowed LBR. It has the same value as LBR and is subject to the total supply of LBR. esLBR cannot be traded or transferred but has voting rights and can share in protocol earnings. Mining rewards are the primary source of esLBR.esLBR holders can convert their esLBR toLBR through a vesting process. Once the process is started, esLBR will be linearly converted to LBR over a period of 90 days. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [token/EUSD.sol](contracts/lybra/token/esLBR.sol) | 174 | The eUSD contract is an interest-bearing ERC20-like token designed for the Lybra protocol. It represents the holder's share in the total amount of Ether controlled by the protocol. The contract stores the sum of all shares to calculate each account's token balance, which is based on the account's shares and the total supply of eUSD. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [token/LBR.sol](contracts/lybra/token/LBR.sol) | 52 | LBR is an ERC20-compliant token leverages the LayerZero's OFT protocol to enable native cross-chain functionality, allowing seamless transfers and interactions across different blockchain networks.Apart from the initial production, LBR can only be produced by destroying esLBR in the fund contract.LBR can only be exchanged to esLBR in the lybraFund contract. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [token/PeUSD.sol](contracts/lybra/token/PeUSD.sol) | 37 | PeUSD is a stable, interest-free ERC20-like token minted through eUSD in the Lybra protocol. It is pegged to 1eUSD and does not undergo rebasing. The token operates by allowing users to deposit eUSD and mint an equivalent amount of PeUSD. When users redeem PeUSD, they can retrieve the corresponding proportion of eUSD. As a result, users can utilize PeUSD without sacrificing the yield on their eUSD holdings.In addition to minting PeUSD by using eUSD as collateral, PeUSD can also be minted by depositing assets (such as WstETH) into non-rebase asset vaults.PeUSD leverages the LayerZero's OFT protocol to enable native cross-chain functionality, allowing seamless transfers and interactions across different blockchain networks. By integrating with OFT, PeUSD is not constrained by liquidity pools and can freely move between chains. This interoperability enhances the versatility and utility of PeUSD, empowering users with the ability to utilize PeUSD's stable value and features across multiple blockchain ecosystems. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |
| [token/PeUSDMainnetStableVision.sol](contracts/lybra/token/PeUSDMainnetStableVision.sol) | 118 | This contract keeps track of the totalShares of eUSD deposited by users and the totalMinted PeUSD.When users redeem PeUSD, they can retrieve the corresponding proportion of eUSD.As a result, users can utilize PeUSD without sacrificing the yield on their eUSD holdings. | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |

## Out of scope

- OFT/* LayerZero Omnichain Fungible Token
- mocks/*
- lybra/governance/AdminTimelock.sol openzeppelin module
- External libraries:
- @openzeppelin/*
- @chainlink/*


# Additional Context

## Scoping Details 
```
- If you have a public code repo, please share it here:  
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

# Tests

To run this repo, you'll need Hardhat and NodeJS installed.

```text
# Clone the repository
git clone https://github.com/code-423n4/2023-06-lybra

# Navigate to the directory
cd 2023-06-lybra

# Install dependencies
npm install

# Run compile
npm run build

# Run tests
npm run test
```
