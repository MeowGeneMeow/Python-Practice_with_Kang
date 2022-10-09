# -*- coding: UTF-8 -*-
import sys
import os
import pandas as pd
import numpy as np



def main(expFolder, totalParts, numOC, targetFolder):

    # get the data location
    # merge dataset to ONE

    dataset = None
    for i in range(totalParts):
        filename = expFolder+"_part"+str(i)+".csv"
        df = pd.read_csv(os.path.join(expFolder, filename))
        if dataset is not None:
            dataset = pd.concat( [dataset, df], ignore_index=True )
        else:
            dataset = df

    print('Total dataset count :', dataset.shape)
    # if target folder not exists, create it
    if not os.path.exists(targetFolder):
        os.mkdir(targetFolder)
        print("Output folder :", targetFolder)

    # select dataframe we want
    lower_bound = numOC
    print(f"We'll select > {lower_bound} rows....")

    #df_OLDCUSTPHONE = dataset[ dataset['[CustPhone]'].value_counts() > lower_bound ]
    # list all of the customer
    set_unique_CID = set(dataset['[CustPhone]'])
    #print(set_unique_CID)
    #OLD_CUSTID = 
    # divide into two group:
    # rare-used customer and OLD customer
    df_excluded_customer = pd.DataFrame(columns =['CustPhone', 'occurrence'])
    df_OLD_CUSTOMER = pd.DataFrame(columns =['CustPhone', 'occurrence'])
    for user in set_unique_CID:

        dict_check = { 'CustPhone': user, 'occurrence': len(dataset[dataset['[CustPhone]'] == user]) }
        print(dict_check)
        if dict_check['occurrence'] > numOC:
            df_OLD_CUSTOMER = df_OLD_CUSTOMER.append(dict_check, ignore_index = True)
        else:
            df_excluded_customer = df_excluded_customer.append(dict_check, ignore_index = True)

    # save results
    df_OLD_CUSTOMER.to_csv('OLDCUST.csv', index=False)
    df_excluded_customer.to_csv('excludedUser.csv', index=False)




if __name__ == "__main__":
    if (len(sys.argv) < 5):
        print("Usage: %s <exp_folder> <total_parts> <OLD CUSTOMER criteria> <target_folder>"%sys.argv[0])
        sys.exit(1)

    if sys.argv[1] and sys.argv[2] and sys.argv[3] and sys.argv[4]:
        main(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4])

