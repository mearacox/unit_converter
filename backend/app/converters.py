conversion_data = {
    "length": {
        "inches": 1.0,
        "cm": 2.54,
        "feet": 1 / 12,
        "meters": 0.0254
    },
    "weight": {
        "grams": 1.0,
        "kg": 0.001,
        "pounds": 0.00220462,
        "ounces": 0.035274
    },
    "cooking": {
        "tsp": 1.0,
        "tbsp": 0.333333,
        "cups": 0.0208333,
        "ml": 4.92892
    }
}

def convert_temperature(value: float, from_unit: str, to_unit: str) -> float:
    """Handle temperature conversions with proper formulas"""
    from_unit = from_unit.lower()
    to_unit = to_unit.lower()
    
    # Convert input to Celsius first
    if from_unit == "celsius":
        celsius_value = value
    elif from_unit == "fahrenheit":
        celsius_value = (value - 32) * 5/9
    elif from_unit == "kelvin":
        celsius_value = value - 273.15
    else:
        raise ValueError(f"Invalid temperature unit: {from_unit}")
    
    # Convert from Celsius to target unit
    if to_unit == "celsius":
        result = celsius_value
    elif to_unit == "fahrenheit":
        result = (celsius_value * 9/5) + 32
    elif to_unit == "kelvin":
        result = celsius_value + 273.15
    else:
        raise ValueError(f"Invalid temperature unit: {to_unit}")
    
    return round(result, 4)

def convert_units(value: float, from_unit: str, to_unit: str, conversion_type: str) -> float:
    """Main conversion function that handles all unit types"""
    conversion_type = conversion_type.lower()
    
    # Special handling for temperature
    if conversion_type == "temperature":
        return convert_temperature(value, from_unit, to_unit)
    
    # Handle other conversions (length, weight, cooking)
    units = conversion_data.get(conversion_type)
    if not units:
        raise ValueError(f"Invalid conversion type: {conversion_type}")
    
    from_rate = units.get(from_unit.lower())
    to_rate = units.get(to_unit.lower())
    
    if from_rate is None or to_rate is None:
        raise ValueError("Invalid units for selected conversion type")
    
    result = (value * to_rate) / from_rate
    return round(result, 4)
