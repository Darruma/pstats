import React, { Component, useState } from "react";
import { numberWithCommas, roundTo2Dec } from "../utils";
import {Link} from 'react-router-dom'
class LiquidityAnalysis extends Component {
  state = {
    liquidity: numberWithCommas(this.props.liquidity.toString()),
  };
  render() {
    let liquidity = this.state.liquidity.replace(/,/g, "");
    const halfLiquidity = Number(liquidity) / 2;
    const pooledPickle = halfLiquidity / this.props.pickle_price;
    const pooledEth = halfLiquidity / this.props.eth_price;
    const originalPrice = pooledEth / pooledPickle;
    const const_product = pooledEth * pooledPickle;
    return (
      <div>
        <div
          style={{ color: "#26ff91", textAlign: "center" }}
          className="pickle-title"
        >
          Liquidity Analysis
        </div>
       <Link style={{
         textAlign: "center",
         display:"inherit",
         color:"white",
         fontSize:"20px",
         paddingBottom:"10px"
       }} to="/">Pickle Pool Analysis</Link>
       
        <div style={{ width: "550px" }} className="container">
          <div className="info">
            <div className="info-name">Liquidity:</div>
            <div className="info-value">
              <input
                className="info-value"
                value={this.state.liquidity}
                lang={"en"}
                onChange={(e) => {
                  this.setState({ liquidity: e.target.value });
                }}
                type="text"
              />
            </div>
          </div>
          <div className="info">
            <div className="info-name">Pooled Pickle: </div>
            <div className="info-value">
              {numberWithCommas(roundTo2Dec(pooledPickle))}
            </div>
          </div>
          <div className="info">
            <div className="info-name">Pooled Eth</div>
            <div className="info-value">
              {numberWithCommas(roundTo2Dec(pooledEth))}
            </div>
          </div>
        </div>

        <div className="table-container liquidity-container">
          <div className="liquid-row">
            <div className="label liquid ">Pickle Bought</div>
            <div className="label liquid">Price</div>
            <div className="label liquid">Price Change</div>
          </div>

          {[1, 100, 1000, 5000, 10000, 50000, 100000].map((pickle_bought) => {
            const newPooledPickle = pooledPickle - pickle_bought;
            const newEthLiquidity = const_product / newPooledPickle;
            const ethCost = newEthLiquidity - pooledEth;
            const price = ethCost / pickle_bought;
            const price_change =
              ((price - originalPrice) / originalPrice) * 100;
            return (
              <div className="liquid-row">
                <div className=" liquid-text liquid">{pickle_bought}</div>
                <div className=" liquid-text liquid">
                  ${(price * this.props.eth_price).toFixed(2)}
                </div>
                <div style={{color:"light-green"}} className=" liquid-text liquid">
                   
                  {price_change.toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
        <div className="table-container liquidity-container">
          <div className="liquid-row">
            <div className="label liquid ">Pickle Sold</div>
            <div className="label liquid">Price</div>
            <div className="label liquid">Price Change</div>
          </div>
          {[1, 100, 1000, 5000, 10000, 50000, 100000].map((pickle_bought) => {
            const newPooledPickle = pooledPickle + pickle_bought;
            const newEthLiquidity = const_product / newPooledPickle;
            const ethCost = Math.abs(newEthLiquidity - pooledEth);
            const price = ethCost / pickle_bought;
            const price_change =
              ((price - originalPrice) / originalPrice) * 100;
            return (
              <div className="liquid-row">
                <div className=" liquid-text liquid">{pickle_bought}</div>
                <div className=" liquid-text liquid">
                  ${(price * this.props.eth_price).toFixed(2)}
                </div>
                <div style={{color:"red"}} lassName=" liquid-text liquid">
                  {price_change.toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default LiquidityAnalysis;
