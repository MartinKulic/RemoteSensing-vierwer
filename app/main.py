from fastapi import FastAPI

app = FastAPI()
app.frontend("/", directory="frontend", fallback="404.html")

@app.get("/hello")
async def root():
    return {"message": "Hello World"}

#@app.get("/")
#async def first_page():
#    return FileResponse("frontend/index.html")
