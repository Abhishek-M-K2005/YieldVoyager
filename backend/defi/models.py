from django.db import models
from auth_web3.models import User


class Protocol(models.Model):
    """
    DeFi protocol like Aave, Compound, Curve
    """
    name = models.CharField(max_length=50)
    chain = models.CharField(max_length=20)
    website = models.URLField(blank=True)
    risk_level = models.CharField(
        max_length=10,
        choices=[
            ("low", "Low"),
            ("medium", "Medium"),
            ("high", "High")
        ]
    )

    def __str__(self):
        return self.name


class Vault(models.Model):
    """
    Yield opportunity on a protocol for a specific asset
    Example: Aave + USDC
    """
    protocol = models.ForeignKey(Protocol, on_delete=models.CASCADE)
    asset = models.CharField(max_length=10)   # ETH, USDC, DAI
    apy = models.FloatField()
    tvl = models.FloatField(help_text="Total Value Locked")

    def __str__(self):
        return f"{self.protocol.name} - {self.asset}"


class Position(models.Model):
    """
    User-specific deposit into a vault
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vault = models.ForeignKey(Vault, on_delete=models.CASCADE)
    amount = models.FloatField()
    deposited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.wallet_address} - {self.vault}"
