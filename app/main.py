from pathlib import Path

from fastapi import FastAPI

from app.Inventory import Inventory_Quarter

app = FastAPI()
app.frontend("/", directory="frontend", fallback="404.html")

ndvi_inventory = Inventory_Quarter(Path("/home/main/repositories/RemoteSensing/Download/Quarterly_NDVI/ndvi_inventory.csv"))

@app.get("/hello")
async def root():
    return {"message": "Hello World"}

