// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract mockCurve {
   function get_dy_underlying(int128 i, int128 j, uint256 dx) external view returns (uint256){
      return 1e6;
   }
    function exchange_underlying(int128 i, int128 j, uint256 dx, uint256 min_dy) external returns(uint256){
        return dx * 1e6 / 1e18;
    }
}