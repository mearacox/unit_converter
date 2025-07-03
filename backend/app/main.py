from fastapi import FastAPI, HTTPException
from app.models import ConversionRequest
from app.converters import convert_units

app = FastAPI()

@app.post("/convert")
def convert(request: ConversionRequest):
    print("Incoming request:", request)

    try:
        result = convert_units(request.value, request.from_unit, request.to_unit, request.conversion_type)
        return {"result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))