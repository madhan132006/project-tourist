from django.http import JsonResponse
from .models import Tourist, Incident
from .blockchain import tourist_chain

def register_tourist(request):

    name = request.GET.get("name")
    passport = request.GET.get("passport")

    digital_id = "DID"+passport

    tourist = Tourist.objects.create(
        name=name,
        passport_id=passport,
        digital_id=digital_id
    )

    tourist_chain.add_block(digital_id)

    return JsonResponse({
        "message":"Tourist Registered",
        "digital_id":digital_id
    })


def report_incident(request):

    tourist_id = request.GET.get("tourist_id")
    description = request.GET.get("description")
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    incident = Incident.objects.create(
        tourist_id=tourist_id,
        description=description,
        latitude=lat,
        longitude=lon
    )

    return JsonResponse({"message":"Incident Reported"})