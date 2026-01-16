from django.db import models

class Protocol(models.Model):
    name = models.CharField(max_length=50)
    chain = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Pool(models.Model):
    protocol = models.ForeignKey(Protocol, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    apy = models.FloatField()
    tvl = models.FloatField()
    risk_score = models.FloatField(default=0)

    def __str__(self):
        return self.name

