from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from app.Inventory import Inventory_Quarter

app = FastAPI()
#app.frontend("/", directory="frontend", fallback="404.html")
frontend_dir = Path("frontend")

app.mount(
    "/static",
    StaticFiles(directory=frontend_dir),
    name="static",
)

templates = Jinja2Templates(directory=frontend_dir)

ndvi_inventory = Inventory_Quarter(Path("/home/main/repositories/RemoteSensing/Download/Quarterly_NDVI/ndvi_inventory.csv"))

@app.get("/hello")
async def root():
    return {"message": "Hello World"}

@app.get("/map", response_class=HTMLResponse)
async def get_map(request: Request):
    return templates.TemplateResponse(
        "map/index.html",
        {
            "request": request,
            "bounds": ndvi_inventory.get_init_bbox(),
        },
    )

