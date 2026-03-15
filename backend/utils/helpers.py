def format_error(message, status_code=400):
    return {"error": message}, status_code

def format_success(data, message="Success", status_code=200):
    return {"message": message, "data": data}, status_code
