from pathlib import Path
from enum import Enum
from select import select

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from app.Inventory import Inventory_Quarter

app = FastAPI()

frontend_dir = Path("frontend")

app.mount(
    "/static",
    StaticFiles(directory=frontend_dir),
    name="static",
)
templates = Jinja2Templates(directory=frontend_dir)
app.frontend("/", directory=frontend_dir, fallback="404.html")

class CollectionsNames(str, Enum):
    NDVI_W_GAPS = "NDVI_w_gaps"



available_collections = {
    CollectionsNames.NDVI_W_GAPS: Inventory_Quarter(Path("/home/main/repositories/RemoteSensing/Download/Quarterly_NDVI/ndvi_inventory.csv")),
    }






@app.get("/hello")
async def root():
    return {"message": "Hello World"}


@app.get("/map/{collection}", response_class=HTMLResponse)
async def get_map(collection: CollectionsNames, request: Request):
    select_collection = available_collections[collection]
    return templates.TemplateResponse(
        "map/index.html",
        {
            "request": request,
            "bounds": select_collection.get_init_bbox(),
            "availableTimes": select_collection.get_times(),
        },
    )
@app.get("/map", response_class=HTMLResponse)
async def get_map_default(request: Request):
    return await get_map(CollectionsNames.NDVI_W_GAPS, request)

# @app.post("/map{collection}{}",)

