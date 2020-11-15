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
  return (Math.round(x * 100) / 100).toFixed(2);
}
export function numberFromCommas(x) {
  parseInt(x.replace(/,/g, ''), 10)
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
  reward_perc:8

},
{
   label:"WBTC/ETH",
   name:"wbtc-eth",
   reward_perc:5
 },
{
  label:"PDAI",
  name:"cdai",
  reward_perc:6
},
{
  label:"USDC/ETH",
  name:"usdc-eth",
  reward_perc: 4
},{
  label:"3POOL",
  name:"3poolcrv",
  reward_perc:4,
},
{
  label:"USDT/ETH",
  name:"usdt-eth",
  reward_perc: 4
},
{
  label:"DAI/ETH",
  name:"dai-eth",
  reward_perc: 4
}
]

 export function getJars() {
   return jars
 }

