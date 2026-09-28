from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            "success": False,
            "message": "An error occurred while processing your request.",
            "errors": {}
        }

        if isinstance(response.data, dict):
            if "detail" in response.data:
                custom_data["message"] = str(response.data["detail"])
                errors_copy = response.data.copy()
                del errors_copy["detail"]
                custom_data["errors"] = errors_copy
            else:
                custom_data["errors"] = response.data
                custom_data["message"] = "Validation or processing error."
        elif isinstance(response.data, list):
            custom_data["errors"] = {"non_field_errors": response.data}
            custom_data["message"] = response.data[0] if response.data else "Error occurred."

        response.data = custom_data

    return response
