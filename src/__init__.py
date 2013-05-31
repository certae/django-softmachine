import logging
from datetime import datetime

filename = 'logs/UsageInfo.log'
logging.basicConfig(filename=filename, level=logging.INFO)

logging.info(datetime.now())
