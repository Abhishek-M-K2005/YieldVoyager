from django.contrib import admin
from .models import User

@admin.register(User)
class WalletUserAdmin(admin.ModelAdmin):
    list_display = ("wallet_address", "created_at")

