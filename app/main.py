from pathlib import Path
from enum import Enum
from select import select
from typing import Annotated

from fastapi import FastAPI, Request, Query
from fastapi import Path as faPath
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel
from rio_tiler.errors import TileOutsideBounds
from starlette.responses import Response

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
    CollectionsNames.NDVI_W_GAPS: Inventory_Quarter(Path("/home/main/repositories/RemoteSensing/Download/Quarterly_COG_NDVI/ndvi_inventory.csv")),
    }

class tiffRequestBody(BaseModel):
    time:tuple
    band:int


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

@app.get("/tiles/{collection}/{stringified_key}/{x}/{y}/{z}.png")
async def get_collection_at_time(collection: CollectionsNames,
                                stringified_key: Annotated[str, faPath(title="Key tuple stringified where elements are separated by _")], x:int, y:int, z:int,
                                band: Annotated[int, Query(title="Index of band from GTiff. Index starts at 1")] = 1):

    select_collection = available_collections[collection] # collection should be valid thanks to fastAPI
    time_key = tuple(int(part) for part in stringified_key.split("_"))

    try:
        img = select_collection.get_img(time_key, x, y, z, band)
    except TileOutsideBounds:
        return Response(status_code=204)

    return Response(
        content=img,
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=31536000, immutable"}
    )

@app.post("/point/{collection}/{lat}/{long}")
async def get_point(collection: CollectionsNames, lat: float, long: float,
                    band: Annotated[int, Query(title="Index of band from GTiff. Index starts at 1")] = 1):

    selected_collection = available_collections[collection]
    response = selected_collection.get_data_for_point_response(lat, long, band)

    return response
