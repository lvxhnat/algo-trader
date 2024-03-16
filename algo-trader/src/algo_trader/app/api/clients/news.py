from typing import List
from pydantic import BaseModel
from ib_insync import Contract, HistoricalNews

import re
from datetime import datetime, timedelta
from algo_trader.app.config.base_config import ibkr_client

class NewsHeadline(BaseModel):
    datetime: datetime 
    provider_code: str 
    article_id: str
    headline: str

def request_historical_news_headlines(
    contract: Contract,
    start: datetime = datetime.today() - timedelta(days = 5),
    end: datetime = datetime.today(),
) -> List[NewsHeadline]:
    
    """ 
    Example Usage 
    ==============
    >>> request_historical_news_headlines(Stock('AMD', 'SMART', 'USD'))
    [
        {'datetime': datetime.datetime(2024, 3, 7, 12, 26, 35), 'provider_code': 'BRFUPDN', 'article_id': 'BRFUPDN$16d8649e', 'headline': 'DZ Bank downgraded Advanced Micro (AMD) to Hold with target $200'}, 
        {'datetime': datetime.datetime(2024, 1, 31, 15, 14, 27), 'provider_code': 'BRFG', 'article_id': 'BRFG$168837e4', 'headline': "Advanced Micro's soft Q1 revenue outlook spurs profit-taking today; AI demand remains robust"}, 
        {'datetime': datetime.datetime(2024, 1, 31, 14, 49, 28), 'provider_code': 'BRFUPDN', 'article_id': 'BRFUPDN$1687b023', 'headline': 'Northland Capital upgraded Advanced Micro (AMD) to Outperform with target $195'},
        ...
    ]

    Notes
    ==============
    For sync code for testing, use
    >>> ibkr_client.sync_connect()
    >>> news_providers = ibkr_client.reqNewsProviders()
    >>> provider_codes = "+".join([provider.code for provider in news_providers])

    References
    ==============
    https://github.com/erdewit/ib_insync/issues/244
    """

    provider_codes: str = ibkr_client.news_provider_codes

    ibkr_client.qualifyContracts(contract)
    headlines: List[HistoricalNews] = ibkr_client.reqHistoricalNews(contract.conId, provider_codes, start, end, 10)

    clean_headline = lambda s: re.sub(r'\{.*?\}', '', s.replace("!", ""))
    serialise_headlines = lambda headline: {
        "datetime": headline.time, 
        "provider_code": headline.providerCode, 
        "article_id": headline.articleId,
        "headline": clean_headline(headline.headline),
    }

    return [*map(serialise_headlines, headlines)]

if __name__ == '__main__':
    from ib_insync import Stock
    print(request_historical_news_headlines(Stock('AMD', 'SMART', 'USD')))