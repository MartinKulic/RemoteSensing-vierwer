from pathlib import Path

import pandas as pd
import rasterio


class Inventory_Quarter:
    def __init__(self, inventory_csv_path : Path):
        self.inventory_path = inventory_csv_path

        self.inventory = pd.read_csv(self.inventory_path, sep=';', header=0)
        self.inventory.set_index(["Year", "Quarter"], inplace=True)

        with rasterio.open(self.inventory.iloc[0]["Path"]) as src:
            self.profile = src.profile
            left, bottom, right, top = src.bounds

        self.bounds = [[top, left], [bottom,right]]

    def get_times(self):
        return self.inventory.index.to_numpy()

    def get_tiff(self, year : int, quarter : int):
        path = self.inventory.loc[year, quarter]["Path"]

        with rasterio.open(path, "r") as src:
            r = src.read()

        return r

    def get_init_bbox(self):
        return self.bounds

# inventory = Inventory_Quarter(Path("/home/main/repositories/RemoteSensing/Download/Quarterly_NDVI/ndvi_inventory.csv"))
#
# gtif = inventory.get_tiff(2020,3)
# print(inventory.get_times())
