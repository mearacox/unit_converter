from pydantic import BaseModel

class ConversionRequest(BaseModel):
    value: float
    from_unit: str
    to_unit: str
    conversion_type: str
