// a and b are javascript Date objects

export function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export function roundTo2Dec(x) {
  return Math.round(x)
}


export function getJarTotals(tvlData,perf,one_percent_rewards,perc_rewards,liquidity) {
  let result = {
    tvl:liquidity.tvl,
    yieldDollars:0,
    psin:0,
    rewards:liquidity.rewards,
    out:liquidity.out,
    net_loss:liquidity.net_loss,
    breakeven:0
  }
  getJars().forEach(j => {
    let tvlNum = tvlData[j.name]
    result.tvl += tvlNum
    let performance = Number(perf[j.name ]) / 100
    let yieldDollars = roundTo2Dec((tvlNum * performance) / 52)
    result.yieldDollars += Number(yieldDollars)

    let psin = yieldDollars * 0.275;
    result.psin += psin

    let pickle_rewards = Number(perc_rewards[j.name])
    result.rewards += Number(pickle_rewards)
    result.out += (pickle_rewards * one_percent_rewards)

    let net_loss = Math.abs(psin - (pickle_rewards * one_percent_rewards))
    result.net_loss += net_loss
    let breakeven_tvl = ((net_loss/psin) * tvlNum) + tvlNum
    result.breakeven += breakeven_tvl

  })
  return result
}

export function getPerformance(jar_name) {
    return fetch(`https://api.pickle-jar.info/protocol/jar/${jar_name}/performance`)
    .then(response => {
      return {
        name:jar_name,
        result:response.json()
      }
    })

 }

 let jars = [

{
  label:"RENBTC",
  name:"renbtccrv",

},
{
  label:"3POOL",
  name:"3poolcrv",
},
{
  label:"SLP ETH/BTC",
  name:"slp-wbtc"
},{
  name:"slp-usdt",
  label:"SLP ETH/USDT",
},
{
  name:"slp-usdc",
  label:"SLP ETH/USDC",
},
{
  name:"slp-yfi",
  label:"SLP ETH/YFI"
}, {
  name:"slp-dai",
  label:"SLP ETH/DAI"
}, {
  name:"bac-dai",
  label:"UNI BAC/DAI"
}


]

 export function getJars() {
   return jars
 }

