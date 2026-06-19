from fastapi import APIRouter
from models.carbon import AssessmentRequest, AssessmentResponse

router = APIRouter(prefix="/api/assessment")

CARBON_FACTORS = {
    "transport": {"bike": 0, "public": 20, "car": 50, "plane": 80},
    "food": {"vegan": 10, "vegetarian": 20, "mixed": 40, "meat-heavy": 70},
    "shopping": {"minimal": 10, "low": 25, "medium": 50, "high": 100},
}


@router.post("", response_model=AssessmentResponse)
def assess_carbon(data: AssessmentRequest):
    transport_factor = CARBON_FACTORS["transport"].get(data.transport, 0)
    food_factor = CARBON_FACTORS["food"].get(data.food, 0)
    energy_factor = data.energy * 0.5
    shopping_factor = CARBON_FACTORS["shopping"].get(data.shopping, 0)

    footprint = transport_factor + food_factor + energy_factor + shopping_factor

    raw_score = 100 - (footprint / 300 * 100)
    score = max(0, min(100, int(raw_score)))

    total_factor = transport_factor + food_factor + shopping_factor + energy_factor
    breakdown = {
        "transport": round((transport_factor / total_factor * 100) if total_factor else 0, 1),
        "food": round((food_factor / total_factor * 100) if total_factor else 0, 1),
        "energy": round((energy_factor / total_factor * 100) if total_factor else 0, 1),
        "shopping": round((shopping_factor / total_factor * 100) if total_factor else 0, 1),
    }

    return AssessmentResponse(score=score, footprint=round(footprint, 1), breakdown=breakdown)
