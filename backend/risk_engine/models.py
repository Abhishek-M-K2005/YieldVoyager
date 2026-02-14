from django.db import models
from defi.models import Protocol
# Create your models here.

class RiskSnapshot(models.Model):
    protocol = models.ForeignKey(Protocol, on_delete=CASCADE)
    score = models.FloatField()
    level = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.protocol.name} - {self.score}";
    

