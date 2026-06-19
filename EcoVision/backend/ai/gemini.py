"""
Placeholder Gemini AI eco-coach.

Real integration would use google-genai:
    from google import genai

    client = genai.Client(api_key="YOUR_API_KEY")
    prompt = f"Given a carbon footprint score of {score} in category '{category}', provide actionable suggestions..."
    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
"""

SUGGESTIONS_BY_SCORE = {
    "low": [
        "Switch to renewable energy",
        "Start composting",
        "Use public transport",
        "Reduce meat consumption",
        "Buy second-hand items",
    ],
    "mid": [
        "Cycle twice a week",
        "Reduce AC usage",
        "Use reusable bottles",
        "Try meatless Mondays",
        "Shop locally",
    ],
    "high": [
        "You're doing great! Try solar panels",
        "Offset your remaining emissions",
        "Share tips with friends",
        "Try a zero-waste week",
    ],
}

CATEGORY_TIPS = {
    "transport": ["Carpool when possible", "Walk short distances", "Maintain proper tire pressure"],
    "food": ["Buy local produce", "Reduce food waste", "Grow your own herbs"],
    "energy": ["Switch to LED bulbs", "Unplug idle electronics", "Install smart thermostat"],
    "shopping": ["Buy in bulk", "Choose quality over quantity", "Repair instead of replace"],
}


class EcoCoach:
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    def get_suggestions(self, score: int, category: str = "") -> list[str]:
        if score < 40:
            suggestions = list(SUGGESTIONS_BY_SCORE["low"])
        elif score <= 70:
            suggestions = list(SUGGESTIONS_BY_SCORE["mid"])
        else:
            suggestions = list(SUGGESTIONS_BY_SCORE["high"])

        if category:
            extra = CATEGORY_TIPS.get(category.lower(), [])
            suggestions.extend(extra)

        return suggestions[:8]
