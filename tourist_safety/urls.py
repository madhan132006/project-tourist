from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    
    # Admin Panel
    path('admin/', admin.site.urls),

    # Safety App URLs
    path('', include('safety_app.urls')),

]