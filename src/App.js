import "./App.css";
import React, { Component } from "react";
import { dateDiffInDays, numberWithCommas, getPerformance,getJars,roundTo2Dec, getJarTotals} from "./utils";
import schedule from "./schedule";
class App extends Component {
  state = {
    pickle_price: 0,
    week: 11,
    weekly_emissions: "0",
    tvl: {
      "liqudity": "0",
      "wbtc-eth": "0",
      "dai-eth": "0",
      "usdc-eth": "0",
      "usdt-eth": "0",
      "cdai": "0",
      "3poolcrv": "0",
      "renbtccrv": "0",
      "pickle-eth": "0",
    },
    performance:{

    }
  };

  componentDidMount() {
    this.getPicklePrice();
    this.calculateWeek();
    this.getWeeklyEmissions();
    this.getTVL();
    this.getJarPerformance()
  }

  getJarPerformance = () => {
    let perfPromises = getJars().map(j => {
      return getPerformance(j.name)
    })
    Promise.all(perfPromises).then(perfs => {
      perfs.forEach(perfData => {
        perfData.result.then(data => {
          let p = this.state.performance
          p[perfData.name] = roundTo2Dec(data.thirtyDay)
          this.setState({performance:p})

        })

      })
    })

  }

  getTVL = () => {
    fetch("https://api.pickle-jar.info/protocol/value")
      .then((response) => response.json())
      .then((result) => {
        this.setState({ tvl: result });
      });
  };

  getWeeklyEmissions = () => {
    let weekly_emissions_info = schedule.find((element) => {
      return element.Week === this.state.week;
    });
    this.setState({ weekly_emissions: weekly_emissions_info["Weekly supply"] });
  };

  calculateWeek = () => {
    const original = new Date("11/13/2020");
    let today = new Date();
    let diffDays = dateDiffInDays(original, today);
    let diffWeeks = Math.floor(diffDays / 7);
    this.setState({ week: this.state.week + diffWeeks }, () => this.state);
  };
  getPicklePrice = () => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=pickle-finance&vs_currencies=usd"
    )
      .then((response) => response.json())
      .then((result) =>
        this.setState({ pickle_price: result["pickle-finance"].usd })
      );
  };
  render() {
     let emissions = +this.state.weekly_emissions.replace(',', '')
    let rewards = Number(this.state.pickle_price) * emissions
    let one_percent_rewards = 0.01 * rewards;
    let totals = getJarTotals(this.state.tvl,this.state.performance,one_percent_rewards)
    console.log(totals)
   
    return (
      <div className="App">
        <div className="pickle-color">
          <div className="pickle-title">Pickle Pool Analysis</div>
        </div>
        <div className="container">
          <div className="info">
            <div className="info-name">Week:</div>
            <div className="info-value">{this.state.week}</div>
          </div>
          <div className="info">
            <div className="info-name">Weekly Emissions:</div>
            <div className="info-value">{this.state.weekly_emissions}</div>
          </div>
          <div className="info">
            <div className="info-name">Pickle Price:</div>
            <div className="info-value">${this.state.pickle_price}</div>
          </div>
          <div className="info">
            <div className="info-name">Total Rewards:</div>
            <div className="info-value">${numberWithCommas(roundTo2Dec(rewards))}</div>
          </div>
          <div className="info">
            <div className="info-name">1% of Total Rewards:</div>
            <div className="info-value">${numberWithCommas(roundTo2Dec(one_percent_rewards))}</div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-row">
            <p className="label">POOL </p>
            <p className="label">TVL</p>
            <p className="label">Base APY</p>
            <p className="label">Yield</p>
            <p className="label">PS ($ IN) </p>
            <p className="label">Pickle %</p>
            <p className="label">PS ($ OUT) </p>
            <p className="label">NET LOSS </p>
            <p className="label">Breakeven TVL </p>
          </div>
         {getJars().map(jar => {

           let tvlNum = this.state.tvl[jar.name]
           let performance = Number(this.state.performance[jar.name ]) / 100
           let yieldDollars = roundTo2Dec((tvlNum * performance) / 52)
           let psin = yieldDollars * 0.275;
           let pickle_rewards = jar.reward_perc
           let net_loss = Math.abs(psin - (pickle_rewards * one_percent_rewards))
           let breakeven_tvl = ((net_loss/psin) * tvlNum) + tvlNum
  
           return  (<div key={jar.name} className="table-row">
           <p className="jars">{jar.label}</p>
           <p className="jars">${numberWithCommas(this.state.tvl[jar.name])}</p>
           <p className="jars">{this.state.performance[jar.name]}%</p>
           <p className="jars">${numberWithCommas(yieldDollars)}</p>
           <p className="jars">${numberWithCommas(roundTo2Dec(psin))}</p>
           <p className="jars"> {pickle_rewards}% </p>
           <p className="jars">${numberWithCommas(roundTo2Dec(pickle_rewards * one_percent_rewards))}</p>
           <p className="red jars">${numberWithCommas(roundTo2Dec(net_loss))}</p>
          <p className="blue jars">${numberWithCommas(roundTo2Dec(breakeven_tvl))}</p>

         </div>)
         })}
         <div className="table-row total">
            <p className="jars"> TOTAL</p>
            <p className="jars"> ${numberWithCommas(roundTo2Dec(totals.tvl))} </p>
            <p className="jars">N/A</p>
            <p className="jars">${numberWithCommas(roundTo2Dec(totals.yieldDollars))}</p>
            <p className="jars"> ${numberWithCommas(roundTo2Dec(totals.psin))}</p>
            <p className="jars"> {totals.rewards}%</p>
            <p className="jars">${numberWithCommas(roundTo2Dec(totals.out))} </p>
            <p className="jars">${numberWithCommas(roundTo2Dec(totals.net_loss))}</p>
            <p className="jars">${numberWithCommas(roundTo2Dec(totals.breakeven))}</p>
         </div>
        
         </div>


      </div>
    );
  }
}

export default App;
