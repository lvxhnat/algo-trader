# Auto Trader

This repository aims to create a modern frontend around the IBKR TWS API, and provide feature enhancements that are otherwise not available on the TWS API.

## Quick Start

Set up both the frontend and the backend

```bash
# In frontend
yarn install
yarn run

# In a separate terminal, spin up the backend
# cd into algo-trader/
pip install -e .
uvicorn algo_trader.app.main:app --reload --port 1237
```
