import random
from pathlib import Path

DEMO_DETECTIONS = [
    {"object": "bottle", "category": "Plastic Waste", "impact": "Medium", "suggestion": "Recycle in plastic bin"},
    {"object": "newspaper", "category": "Paper Waste", "impact": "Low", "suggestion": "Recycle in paper bin"},
    {"object": "apple", "category": "Organic Waste", "impact": "Low", "suggestion": "Compost in organic bin"},
    {"object": "can", "category": "Metal Waste", "impact": "Medium", "suggestion": "Recycle in metal bin"},
    {"object": "phone", "category": "E-Waste", "impact": "High", "suggestion": "Take to e-waste recycling center"},
]


class WasteDetector:
    """
    Placeholder YOLO waste detector.

    Real integration would use the Ultralytics YOLO model:
        from ultralytics import YOLO
        model = YOLO("yolov8n.pt")  # or a custom fine-tuned model
        results = model(image_path)
        for r in results:
            for box in r.boxes:
                class_id = int(box.cls[0])
                label = model.names[class_id]
                confidence = float(box.conf[0])
                ...
    """

    def __init__(self, model_path: str | None = None):
        self.model_path = model_path

    def detect(self, image_path: str) -> list[dict]:
        _ = Path(image_path)
        count = random.randint(1, 3)
        return random.sample(DEMO_DETECTIONS, count)
