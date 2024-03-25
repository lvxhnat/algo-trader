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

## Contributing

All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome.

If you are simply looking to start working with the codebase, navigate to the GitHub "issues" tab and start looking through interesting issues. You can also triage issues which may include reproducing bug reports, or asking for vital information such as version numbers or reproduction instructions. To read more about contributing, you can refer to [CONTRIBUTING](./docs/CONTRIBUTING.md)

## License

GPLv3
