from django.db import models

# Create your models here.
class User(models.Model):
    wallet_address = models.CharField(max_length=42, unique=True)
    nonce = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Profile Fields
    username = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    risk_tolerance = models.CharField(
        max_length=20, 
        choices=[('low', 'Conservative'), ('medium', 'Moderate'), ('high', 'Aggressive')],
        default='medium'
    )
    investment_goal = models.CharField(
        max_length=50,
        blank=True, 
        default="Long-term Growth"
    )

    def __str__(self):
        return self.wallet_address