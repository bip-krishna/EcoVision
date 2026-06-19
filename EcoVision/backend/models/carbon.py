from pydantic import BaseModel


class AssessmentRequest(BaseModel):
    transport: str
    food: str
    energy: int
    shopping: str


class AssessmentResponse(BaseModel):
    score: int
    footprint: float
    breakdown: dict


class CoachRequest(BaseModel):
    score: int
    category: str


class CoachResponse(BaseModel):
    suggestions: list[str]


class ScanResponse(BaseModel):
    object: str
    category: str
    impact: str
    suggestion: str
