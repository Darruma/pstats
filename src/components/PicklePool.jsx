import React from "react";
import { Link } from "react-router-dom";
import {
  numberWithCommas,
  getJars,
  roundTo2Dec,
  getJarTotals,
} from "../utils"

function PicklePool({state,setRewards}) {
  let emissions = +state.weekly_emissions.replace(",", "");
  let rewards = Number(state.pickle_price) * emissions;
  let one_percent_rewards = 0.01 * rewards;
  let liquidity_out = state.percent_rewards["pickle-eth"] * one_percent_rewards;
  let jars = getJars().sort((a,b) => {
    let tvlNumA = state.tvl[a.name];
    let tvlNumB = state.tvl[b.name];
    return tvlNumB - tvlNumA
  })
  console.log(jars)
  let totals = getJarTotals(
    state.tvl,
    state.performance,
    one_percent_rewards,
    state.percent_rewards,
    {
      tvl: state.tvl["pickle-eth"],
      rewards: Number(state.percent_rewards["pickle-eth"]),
      out: liquidity_out,
      net_loss: liquidity_out,
    }
  );
  return (
    <div >
      <div className="pickle-color">
        <div className="pickle-title">Weekly Pickle Pool Analysis 🥒</div>
      </div>
      <Link style={{
         textAlign: "center",
         display:"inherit",
         color:"white",
         fontSize:"20px",
         paddingBottom:"10px"
       }}  to="/liquidity"> Liquidity Analysis </Link> 
      <div className="container">
        <div className="info">
          <div className="info-name">Week:</div>
          <div className="info-value">{state.week}</div>
        </div>
        <div className="info">
          <div className="info-name">Weekly Emissions:</div>
          <div className="info-value">{state.weekly_emissions}</div>
        </div>
        <div className="info">
          <div className="info-name">Pickle Price:</div>
          <div className="info-value">${state.pickle_price}</div>
        </div>
        <div className="info">
          <div className="info-name">Total Rewards:</div>
          <div className="info-value">
            ${numberWithCommas(roundTo2Dec(rewards))}
          </div>
        </div>
        <div className="info">
          <div className="info-name">Weekly Profit:</div>
          <div style={{color:'#26ff91'}}className="info-value">${numberWithCommas(roundTo2Dec(totals.net_loss))  }</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-row">
          <p className="label">Strategy </p>
          <p className="label">TVL</p>
          <p className="label">Gross APY</p>
          <p className="label">Gross Income</p>
          <p className="label">Fee Income </p>
          <p className="label">Rewards %</p>
          <p className="label">Rewards Cost</p>
          <p className="label">Net Margin </p>
          <p className="label">Breakeven TVL </p>
        </div>
        <div className="table-row">
          <p className="jars strategy">PICKLE/ETH</p>

          <p className="jars">
            ${numberWithCommas(roundTo2Dec(state.tvl["pickle-eth"]))}
          </p>
          <p className="jars">0%</p>

          <p className="green jars">$0</p>
          <p className="green jars">$0</p>

          <p className="jars">
            {" "}
            <input
              className="percent-change"
              value={state.percent_rewards["pickle-eth"]}
              onChange={(e) => {
                let new_rewards = state.percent_rewards;
                new_rewards["pickle-eth"] = e.target.value;
                setRewards(new_rewards);
              }}
            />
          </p>
          <p className="jars">
            (${numberWithCommas(roundTo2Dec(liquidity_out))})
          </p>
          <p style={{color:'red'}} className=" jars">
            (-${numberWithCommas(roundTo2Dec(liquidity_out))})
          </p>

          <p className="blue jars">$0</p>
        </div>
        {jars.map((jar) => {
          let tvlNum = state.tvl[jar.name];
          let performance = state.performance[jar.name] / 100;
          if(isNaN(performance)) {
            performance = 0
          }
          let yieldDollars = roundTo2Dec((tvlNum * performance) / 52);
          let psin = yieldDollars * 0.275;
          let pickle_rewards = state.percent_rewards[jar.name];
          
          if(pickle_rewards == undefined) {
            pickle_rewards = 0
          }
          pickle_rewards = pickle_rewards.toString()

          let net_loss =(psin - pickle_rewards * one_percent_rewards);
          let breakeven_tvl =  (Math.abs(net_loss) / psin) * tvlNum

          return (
            <div key={jar.name} className="table-row">
              <p className="jars strategy">{jar.label}</p>
              <p className="jars">
                ${numberWithCommas(roundTo2Dec(state.tvl[jar.name]))}
              </p>

              <p className="jars">{(performance * 100).toFixed(2)}%</p>
              <p className="green jars">${numberWithCommas(yieldDollars)}</p>
              <p className="green jars">
                ${numberWithCommas(roundTo2Dec(psin))}
              </p>
              <p className="jars">
                {" "}
                <input
                  className="percent-change"
                  value={pickle_rewards}
                  onChange={(e) => {
                    let new_rewards = state.percent_rewards;
                    new_rewards[jar.name] = e.target.value;
                    setRewards(new_rewards)
                  }}
                />
              </p>
              <p className="jars">
                ($
                {numberWithCommas(
                  roundTo2Dec(pickle_rewards * one_percent_rewards)
                )}
                )
              </p>
              <p style={{color: net_loss > 0 ? '#26ff91' : 'red' }}   className=" jars">
                ({net_loss < 0 ? '-' : ''}${numberWithCommas(roundTo2Dec(Math.abs(net_loss)))})
              </p>
              <p className="blue jars">
                ${`${numberWithCommas(roundTo2Dec(breakeven_tvl))} 
                (${(breakeven_tvl/state.tvl[jar.name]).toFixed(2)}x)`}
              </p>
            </div>
          );
        })}
        <div className="table-row total">
          <p className="jars"> TOTAL</p>
          <p className="jars"> ${numberWithCommas(roundTo2Dec(totals.tvl))} </p>
          <p className="jars">N/A</p>
          <p className=" green jars">
            ${numberWithCommas(roundTo2Dec(totals.yieldDollars))}
          </p>
          <p className=" green jars">
            {" "}
            ${numberWithCommas(roundTo2Dec(totals.psin))}
          </p>
          <p className="jars "> {roundTo2Dec(totals.rewards)}%</p>
          <p className="jars">
            (${numberWithCommas(roundTo2Dec(totals.out))}){" "}
          </p>
          <p style={{ color:totals.net_loss > 0 ? '#26ff91' : 'red' }}className="jars ">
            (${numberWithCommas(roundTo2Dec(totals.net_loss))})
          </p>
          <p className="jars blue">
            N/A 
          </p>
        </div>
      </div>
    </div>
  );
}
export default PicklePool;
