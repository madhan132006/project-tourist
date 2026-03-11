from django.db import models

class Tourist(models.Model):
    name = models.CharField(max_length=100)
    passport_id = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    digital_id = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Location(models.Model):
    tourist = models.ForeignKey(Tourist, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)


class DangerZone(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    radius = models.FloatField()


class Incident(models.Model):
    tourist = models.ForeignKey(Tourist, on_delete=models.CASCADE)
    description = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=50, default="Reported")