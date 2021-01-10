import "./App.css";
import React, { Component } from "react";
import { Route, Switch,withRouter } from "react-router-dom";
import { dateDiffInDays, getPerformance, getJars } from "./utils";
import schedule from "./schedule";
import PicklePool from "./components/PicklePool";
import LiquidityAnalysis from './components/LiquidityAnalysis'
class App extends Component {
  state = {
    pickle_price: 0,
    eth_price:0,
    week: 1,
    weekly_emissions: "0",
    liquidity:0,
    tvl: {
      "pickle-eth": "0",
      cdai: "0",
      "3poolcrv": "0",
      renbtccrv: "0",
    },
    performance: {},
    percent_rewards: {
      "pickle-eth": "0",
      "3poolcrv": "0",
      renbtccrv: "0",
      "bac-dai":"0"
    },
  };

  componentDidMount() {
    this.refreshStats();
  }
  

  refreshStats = async () => {

    await this.calculateWeek();
    this.getPicklePrice();
    this.getEthPrice();
    this.getWeeklyEmissions();
    this.getTVL();
    this.getJarPerformance();
    this.getPercentRewards();
  };

  getJarPerformance = () => {
    let perfPromises = getJars().map((j) => {
      return getPerformance(j.name);
    });
    Promise.all(perfPromises).then((perfs) => {
      perfs.forEach((perfData) => {
        perfData.result.then((data) => {
          let p = this.state.performance;
          p[perfData.name] = data.thirtyDay
          this.setState({ performance: p });
        });
      });
    });
  };

  getPercentRewards = () => {
    fetch("https://api.pickle-jar.info/protocol/farm")
      .then((response) => response.json())
      .then((result) => {
        for (let [key, value] of Object.entries(result)) {
          result[key] = value.allocShare * 100;
        }
        this.setState({ percent_rewards: {...this.state.percent_rewards,...result} });
      });
  };

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
    console.log(weekly_emissions_info)
    this.setState({ weekly_emissions: weekly_emissions_info["Weekly supply"] });
  };

  calculateWeek = async () => {
    const original = new Date("09/10/2020");
    let today = new Date();
    let diffDays = dateDiffInDays(original, today);
    let weeks = Math.floor(diffDays / 7);
    this.setState({ week: weeks })
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

  getEthPrice = () => {
     fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
      .then((response) => response.json())
      .then((result) =>
        this.setState({ eth_price: result["ethereum"].usd })
      );

  }
  render() {
    return (
      <div className="App">
        <Switch>
          <Route
            path="/"
            exact 
            render={(props) => {
              return(<PicklePool
                state={this.state}
                setRewards={(rewards) =>
                  this.setState({ percent_rewards: rewards })
                }
              />);
            }}
          />
          <Route path="/liquidity" component={() => {
              return (<LiquidityAnalysis
                liquidity={this.state.tvl["pickle-eth"]}
                eth_price={this.state.eth_price}
                pickle_price={this.state.pickle_price}
              />)
          }}
            />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App)
