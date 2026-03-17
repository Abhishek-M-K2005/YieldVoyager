from django.contrib import admin
from .models import Protocol, Vault, Position

admin.site.register(Protocol)
admin.site.register(Vault)
admin.site.register(Position)

