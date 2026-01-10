from django.db import models

# Create your models here.
class User(models.Model):
    wallet_address = models.CharField(max_length=42, unique=True)
    nonce = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.wallet_address