from pathlib import Path

import numpy as np
import pandas as pd
import rasterio


class Inventory:
    def __init__(self, inventory_csv_path : Path, keyes: list):
        self.inventory_path = inventory_csv_path
        self.keyes = keyes

        self.inventory = pd.read_csv(self.inventory_path, sep=';', header=0)
        self.inventory.set_index(keyes, inplace=True)
        self.inventory.sort_index(ascending=True, inplace=True)

        with rasterio.open(self.inventory.iloc[0]["Path"]) as src:
            self.profile = src.profile
            left, bottom, right, top = src.bounds

        self.bounds = [[top, left], [bottom, right]]

    def get_keyes(self):
        return self.inventory.index.to_list()

    """
        Should return strings of observation time 
        Accepted time format is yy-mm-dd
    """
    def key_to_time(self, key) -> str:
        raise Exception("Not implemented - This should be implemented in derived class")

    """
        Should return list of strings of observation times 
        Accepted time format is yy-mm-dd
        """
    def get_times(self) -> list[str]:
        return [self.key_to_time(key) for key in self.get_keyes()]


    def get_init_bbox(self):
        return self.bounds

    def get_tiff(self, key:tuple):
        path = self.inventory.loc[key]["Path"]

        with rasterio.open(path, "r") as src:
            r = np.array(src.read())

        print(r.shape)
        r_np = np.array(r)

        r_np_no_nan = np.array(r_np)
        r_np_no_nan[np.any([np.isnan(r_np), np.isinf(r_np), np.isneginf(r_np)])] = -32768.
        #r_np_no_nan = np.nan_to_num(r_np)

        return r_np_no_nan.tolist()


class Inventory_Quarter (Inventory):
    QUARTERS = [
        "01-01",  # ("01-01", "03-31")
        "04-01",  # ("04-01", "06-30")
        "07-01",  # ("07-01", "09-30")
        "10-01",  # ("10-01", "12-31")
    ]

    def __init__(self, inventory_csv_path : Path):
        super().__init__(inventory_csv_path, ["Year", "Quarter"])

    def key_to_time(self, key) -> str:
        return f"{key[0]}-{Inventory_Quarter.QUARTERS[key[1]-1]}"

    # def get_keyes_to_times(self):
    #     for key in self.get_times():
    #         yield f"{key[0]}-{Inventory_Quarter.QUARTERS[key[1]-1]}"

    # def get_tiff(self, year : int, quarter : int):
    #     return Inventory.get_tiff(self, [year, quarter])

