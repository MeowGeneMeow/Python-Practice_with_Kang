
import pandas as pd
from itertools import chain
import numpy as np


df = pd.read_excel("yahoostock.xlsx")

searchTitle = input('你想搜尋哪支股票:')

companyName = pd.read_excel("yahoostock.xlsx", sheet_name="Sheet", usecols=[0])
companyNumber = pd.read_excel(
    "yahoostock.xlsx", sheet_name="Sheet", usecols=[1])


companyName_list = np.array(companyName)
companyNumber_list = np.array(companyNumber)

result = np.where(companyName_list == searchTitle)

indexNumber = int(result[0])

print(companyName_list[indexNumber] + " " + companyNumber_list[indexNumber])


# 執行： python importExcel.py
