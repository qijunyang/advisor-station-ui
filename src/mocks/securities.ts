import type { Security } from '../services/securities/types';

// Static test snapshot checked against Nasdaq Trader symbol directories on 2026-10-30.
// https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt
// https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt
// Exchange labels follow https://www.nasdaqtrader.com/Trader.aspx?id=SymbolDirDefs
// Listed senior notes are bonds; bond ETFs retain type 'etf'. No prices or live updates.
export const securities: readonly Security[] = Object.freeze(([
  {"id":"nasdaq-aapl","symbol":"AAPL","name":"Apple Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-msft","symbol":"MSFT","name":"Microsoft Corporation - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-amzn","symbol":"AMZN","name":"Amazon.com, Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-googl","symbol":"GOOGL","name":"Alphabet Inc. - Class A Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-meta","symbol":"META","name":"Meta Platforms, Inc. - Class A Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-nvda","symbol":"NVDA","name":"NVIDIA Corporation - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-tsla","symbol":"TSLA","name":"Tesla, Inc.  - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-amd","symbol":"AMD","name":"Advanced Micro Devices, Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-intc","symbol":"INTC","name":"Intel Corporation - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-csco","symbol":"CSCO","name":"Cisco Systems, Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-adbe","symbol":"ADBE","name":"Adobe Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-nflx","symbol":"NFLX","name":"Netflix, Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-cost","symbol":"COST","name":"Costco Wholesale Corporation - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-pep","symbol":"PEP","name":"PepsiCo, Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-qcom","symbol":"QCOM","name":"QUALCOMM Incorporated - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-txn","symbol":"TXN","name":"Texas Instruments Incorporated - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-amgn","symbol":"AMGN","name":"Amgen Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-sbux","symbol":"SBUX","name":"Starbucks Corporation - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-intu","symbol":"INTU","name":"Intuit Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nasdaq-isrg","symbol":"ISRG","name":"Intuitive Surgical, Inc. - Common Stock","type":"stock","exchange":"NASDAQ"},
  {"id":"nyse-arca-spy","symbol":"SPY","name":"State Street SPDR S&P 500 ETF Trust","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-ivv","symbol":"IVV","name":"iShares Core S&P 500 ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-voo","symbol":"VOO","name":"Vanguard S&P 500 ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-vti","symbol":"VTI","name":"Vanguard Morningstar Total Stock Market ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-iwm","symbol":"IWM","name":"iShares Russell 2000 Index Fund","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-dia","symbol":"DIA","name":"State Street SPDR Dow Jones Industrial Average ETF Trust","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-efa","symbol":"EFA","name":"iShares MSCI EAFE ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-eem","symbol":"EEM","name":"iShares MSCI Emerging Index Fund","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-agg","symbol":"AGG","name":"iShares Core U.S. Aggregate Bond ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nasdaq-bnd","symbol":"BND","name":"Vanguard Total Bond Market ETF","type":"etf","exchange":"NASDAQ"},
  {"id":"nasdaq-tlt","symbol":"TLT","name":"iShares 20+ Year Treasury Bond ETF","type":"etf","exchange":"NASDAQ"},
  {"id":"nyse-arca-lqd","symbol":"LQD","name":"iShares iBoxx $ Investment Grade Corporate Bond ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-gld","symbol":"GLD","name":"SPDR Gold Shares","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-iau","symbol":"IAU","name":"iShares Gold Trust Shares","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-vnq","symbol":"VNQ","name":"Vanguard Real Estate ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-xlk","symbol":"XLK","name":"State Street Technology Select Sector SPDR ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-xlf","symbol":"XLF","name":"State Street Financial Select Sector SPDR ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nyse-arca-xle","symbol":"XLE","name":"State Street Energy Select Sector SPDR ETF","type":"etf","exchange":"NYSE Arca"},
  {"id":"nasdaq-adamg","symbol":"ADAMG","name":"Adamas Trust, Inc. - 9.125% Senior Notes Due 2030","type":"bond","exchange":"NASDAQ"},
  {"id":"nasdaq-adami","symbol":"ADAMI","name":"Adamas Trust, Inc. - 9.125% Senior Notes Due 2029","type":"bond","exchange":"NASDAQ"},
] satisfies Security[]).map((security) => Object.freeze(security)));
