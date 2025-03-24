const ADDRESSES = require('../helper/coreAssets.json')
const { sumTokens } = require("../helper/unwrapLPs");


const liquidityBridgeContracts = {
  ethereum: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  bsc: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  arbitrum: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  optimism: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  base: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  era: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  linea: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  polygon_zkevm: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  scroll: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  manta: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  xlayer: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  polygon: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  avax: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],
  tron: ["0x22C5AB813418B7E02f7C889394f54CEF79EE235e"],

};

// Tokens added to the liquidity bridges, excluding Celer-Pegged tokens.
const liquidityBridgeTokens = [
  {
    // USDT
    ethereum: ADDRESSES.ethereum.USDT,
    bsc: ADDRESSES.bsc.USDT,
    tron: ADDRESSES.tron.USDT,
    arbitrum: ADDRESSES.arbitrum.USDT,
    optimism: ADDRESSES.optimism.USDT,
    avax: ADDRESSES.avax.USDT_e,
    polygon: ADDRESSES.polygon.USDT,
    xlayer: ADDRESSES.xlayer.USDT,
  },
  {
    // USDC
    ethereum: ADDRESSES.ethereum.USDC,
    bsc: ADDRESSES.bsc.USDC,
    arbitrum: ADDRESSES.arbitrum.USDC,
    optimism: ADDRESSES.optimism.USDC,
    base: ADDRESSES.base.USDC,
    avax: ADDRESSES.avax.USDC,
    polygon: ADDRESSES.polygon.USDC,
  },
  {
    // WETH
    ethereum: ADDRESSES.ethereum.WETH,
    bsc: ADDRESSES.bsc.ETH,
    arbitrum: ADDRESSES.arbitrum.WETH,
    optimism: ADDRESSES.optimism.WETH,
    base: ADDRESSES.base.WETH,
    era: ADDRESSES.era.WETH,
    linea: ADDRESSES.linea.WETH,
    polygon_zkevm: ADDRESSES.polygon_zkevm.WETH,
    scroll: ADDRESSES.scroll.WETH,
    manta: ADDRESSES.manta.WETH,
    xlayer: ADDRESSES.xlayer.WETH,
  },
];

function chainTvl(chain) {
  return async (time, _, {[chain]: block}) => {
    const toa = []
    liquidityBridgeTokens.forEach(token => {
      if (!token[chain])
        return;
      liquidityBridgeContracts[chain].forEach(owner => toa.push([token[chain], owner]))
    })
    const balances = await sumTokens({}, toa, block, chain, undefined)
    return balances
  };
}

let chains = liquidityBridgeTokens.reduce((allChains, token) => {
  Object.keys(token).forEach((key) => allChains.add(key));
  return allChains;
}, new Set());

Object.keys(liquidityBridgeContracts).forEach(chain => chains.add(chain))

Array.from(chains).forEach(chain => {
  module.exports[chain] = { tvl: chainTvl(chain) }
})
module.exports.methodology = `Tokens bridged via crosschainx are counted as TVL`;
module.exports.misrepresentedTokens = true;
module.exports.hallmarks = [
  [1651881600, "UST depeg"],
];
