from fastapi import APIRouter
from models.carbon import CoachRequest, CoachResponse

router = APIRouter(prefix="/api/coach")


@router.post("", response_model=CoachResponse)
def get_coaching(data: CoachRequest):
    suggestions = []

    if data.score < 40:
        suggestions = [
            "Switch to renewable energy",
            "Start composting",
            "Use public transport",
            "Reduce meat consumption",
            "Buy second-hand items",
        ]
    elif 40 <= data.score <= 70:
        suggestions = [
            "Cycle twice a week",
            "Reduce AC usage",
            "Use reusable bottles",
            "Try meatless Mondays",
            "Shop locally",
        ]
    else:
        suggestions = [
            "You're doing great! Try solar panels",
            "Offset your remaining emissions",
            "Share tips with friends",
            "Try a zero-waste week",
        ]

    if data.category:
        category_tips = {
            "transport": ["Carpool when possible", "Walk short distances", "Maintain proper tire pressure"],
            "food": ["Buy local produce", "Reduce food waste", "Grow your own herbs"],
            "energy": ["Switch to LED bulbs", "Unplug idle electronics", "Install smart thermostat"],
            "shopping": ["Buy in bulk", "Choose quality over quantity", "Repair instead of replace"],
        }
        extra = category_tips.get(data.category.lower(), [])
        suggestions.extend(extra)

    return CoachResponse(suggestions=suggestions[:8])
