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

    def get_times(self):
        return self.inventory.index.to_list()

    def get_init_bbox(self):
        return self.bounds

    def get_tiff(self, key:list):
        path = self.inventory.loc[key]["Path"]

        with rasterio.open(path, "r") as src:
            r = np.array(src.read())

        return r
class Inventory_Quarter (Inventory):
    def __init__(self, inventory_csv_path : Path):
        super().__init__(inventory_csv_path, ["Year", "Quarter"])


    def get_tiff(self, year : int, quarter : int):
        return Inventory.get_tiff(self, [year, quarter])



# inventory = Inventory_Quarter(Path("/home/main/repositories/RemoteSensing/Download/Quarterly_NDVI/ndvi_inventory.csv"))
#
# gtif = inventory.get_tiff(2020,3)
# print(inventory.get_times())
