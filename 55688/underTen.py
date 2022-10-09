import pandas as pd
from itertools import chain
import numpy as np
from pandas import DataFrame

#col_names=['JobID','SN,JobTime','CustPhone','Lng_X','Lat_Y','City','Dist','EndTime','OFF_Lng_X','OFF_Lat_Y']
df = pd.read_csv(r"C:\Users\gean1\OneDrive\桌面\Python-Practice_with_Qsnake\55688\exp_07102022163231_part4.csv",index_col=0)

print(len(df))

print(df["[CustPhone]"].value_counts())

df1 = DataFrame(
    {
        "CstuPhone": df["[CustPhone]"],
        "OFF_Lng_X": df["[OFF_Lng_X]"],
        "OFF_Lat_Y": df["[OFF_Lat_Y]"]
    }
)
print(df1)
print(df1.apply(pd.value_counts))
print(df1)