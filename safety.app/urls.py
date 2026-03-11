from django.urls import path
from . import views

urlpatterns = [

path('register',views.register_tourist),

path('report',views.report_incident),

]