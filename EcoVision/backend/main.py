from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.assessment import router as assessment_router
from routes.scanner import router as scanner_router
from routes.coach import router as coach_router

app = FastAPI(title="EcoVision API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment_router)
app.include_router(scanner_router)
app.include_router(coach_router)


@app.get("/")
def root():
    return {"message": "EcoVision API", "version": "1.0.0"}


@app.on_event("startup")
def startup():
    print("EcoVision API starting...")
