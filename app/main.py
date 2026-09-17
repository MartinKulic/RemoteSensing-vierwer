from pathlib import Path
from enum import Enum
from select import select

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel

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
    NDVI_W_GAPS = "NDVI with gaps"


available_collections = {
    CollectionsNames.NDVI_W_GAPS: Inventory_Quarter(Path("/home/main/repositories/RemoteSensing/Download/Quarterly_NDVI/ndvi_inventory.csv")),
    }

class tiffRequestBody(BaseModel):
    time:tuple


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
            "availableKeyes": select_collection.get_keyes(),
            "availableTimes": select_collection.get_times(),
            "available_collections": [col.value for col in available_collections],
        },
    )
@app.get("/map", response_class=HTMLResponse)
async def get_map_default(request: Request):
    return RedirectResponse(request.url_for("get_map", collection=CollectionsNames.NDVI_W_GAPS.value), status_code=307) #301 - permanent redirect

@app.post("/map/{collection}")
async def get_collection_at_time(collection: CollectionsNames, tiff_request:tiffRequestBody):
    select_collection = available_collections[collection] # collection should be valid thanks to fastAPI

    time_key = tiff_request.time
    print(time_key)
    return select_collection.get_tiff(time_key)

