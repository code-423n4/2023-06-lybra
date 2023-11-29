// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {LybraProxy} from "@lybra/Proxy/LybraProxy.sol";
import {LybraProxyAdmin} from "@lybra/Proxy/LybraProxyAdmin.sol";
// import {AdminTimelock} from "@lybra/governance/AdminTimelock.sol";
import {GovernanceTimelock} from "@lybra/governance/GovernanceTimelock.sol";
// import {LybraWBETHVault} from "@lybra/pools/LybraWbETHVault.sol";
import {esLBR} from "@lybra/token/esLBR.sol";
import {LybraWstETHVault} from "@lybra/pools/LybraWstETHVault.sol";
// import {LybraRETHVault} from "@lybra/pools/LybraRETHVault.sol";
// import {PeUSD} from "@lybra/token/PeUSD.sol";
import {esLBRBoost} from "@lybra/miner/esLBRBoost.sol";
import {LBR} from "@lybra/token/LBR.sol";
import {LybraStETHDepositVault} from "@lybra/pools/LybraStETHVault.sol";
// import {StakingRewardsV2} from "@lybra/miner/stakerewardV2pool.sol";
// import {LybraGovernance} from "@lybra/governance/LybraGovernance.sol";
import {PeUSDMainnet} from "@lybra/token/PeUSDMainnetStableVision.sol";
import {ProtocolRewardsPool} from "@lybra/miner/ProtocolRewardsPool.sol";
// import {EUSD} from "@lybra/token/EUSD.sol";
import {Configurator} from "@lybra/configuration/LybraConfigurator.sol";
import {EUSDMiningIncentives} from "@lybra/miner/EUSDMiningIncentives.sol";
// import {LybraEUSDVaultBase} from "@lybra/pools/base/LybraEUSDVaultBase.sol";
// import {LybraPeUSDVaultBase} from "@lybra/pools/base/LybraPeUSDVaultBase.sol";
import {mockChainlink} from "@mocks/chainLinkMock.sol";
import {stETHMock} from "@mocks/stETHMock.sol";
import {EUSDMock} from "@mocks/mockEUSD.sol";
import {mockCurve} from "@mocks/mockCurve.sol";
import {mockUSDC} from "@mocks/mockUSDC.sol";
import {mockLBRPriceOracle} from "@mocks/mockLBRPriceOracle.sol";

/* remappings used
@lybra=contracts/lybra/
@mocks=contracts/mocks/
 */
contract CounterScript is Test {
    address goerliEndPoint = 0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23;

    LybraProxy proxy;
    LybraProxyAdmin admin;
    // AdminTimelock timeLock;
    GovernanceTimelock govTimeLock;
    // LybraWbETHVault wbETHVault;
    // esLBR lbr;
    // LybraWstETHVault stETHVault;
    mockChainlink oracle;
    mockLBRPriceOracle lbrOracleMock;
    stETHMock stETH;
    esLBRBoost eslbrBoost;
    mockUSDC usdc;
    mockCurve curve;
    Configurator configurator;
    LBR lbr;
    esLBR eslbr;
    EUSDMock usd;
    EUSDMiningIncentives eusdMiningIncentives;
    ProtocolRewardsPool rewardsPool;
    LybraStETHDepositVault stETHVault;
    PeUSDMainnet peUsdMainnet;
    address owner = address(7);
    // admins && executers of GovernanceTimelock
    address[] govTimelockArr;

    function setUp() public {
        vm.startPrank(owner);
        oracle = new mockChainlink();
        lbrOracleMock = new mockLBRPriceOracle();
        stETH = new stETHMock();
        govTimelockArr.push(owner);
        govTimeLock = new GovernanceTimelock(
            1,
            govTimelockArr,
            govTimelockArr,
            owner
        );
        eslbrBoost = new esLBRBoost();
        usdc = new mockUSDC();
        curve = new mockCurve();
        //  _dao , _curvePool
        configurator = new Configurator(address(govTimeLock), address(curve));
        // _config , _sharedDecimals , _lzEndpoint
        lbr = new LBR(address(configurator), 8, goerliEndPoint);
        // _config
        eslbr = new esLBR(address(configurator));
        // _config
        usd = new EUSDMock(address(configurator));
        // _config, _boost, _etherOracle, _lbrOracle
        eusdMiningIncentives = new EUSDMiningIncentives(
            address(configurator),
            address(eslbrBoost),
            address(oracle),
            address(lbrOracleMock)
        );
        // _config
        rewardsPool = new ProtocolRewardsPool(address(configurator));
        // _config, _stETH, _oracle
        stETHVault = new LybraStETHDepositVault(
            address(configurator),
            address(stETH),
            address(oracle)
        );
        // _config, _sharedDecimals, _lzEndpoint
        peUsdMainnet = new PeUSDMainnet(
            address(configurator),
            8,
            goerliEndPoint
        );

        configurator.initToken(address(usd), address(peUsdMainnet));
        curve.setToken(address(usd), address(usdc));
        configurator.setMintVault(address(stETHVault), true);
        configurator.setPremiumTradingEnabled(true);
        configurator.setMintVaultMaxSupply(
            address(stETHVault),
            10_000_000_000 ether
        );
        configurator.setBorrowApy(address(stETHVault), 200);
        configurator.setEUSDMiningIncentives(address(eusdMiningIncentives));
        eusdMiningIncentives.setToken(address(lbr), address(eslbr));
        rewardsPool.setTokenAddress(
            address(eslbr),
            address(lbr),
            address(eslbrBoost)
        );

        // Missing configurator.initEUSD(this.EUSDMock.address) as initEUSD in configurator does not exist.
        // And it's not same as initToken. 
        vm.stopPrank();
    }

    function testOz() public returns (bool) {
        return true;
    }
    
}
