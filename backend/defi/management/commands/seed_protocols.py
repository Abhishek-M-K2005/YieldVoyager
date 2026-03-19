from django.core.management.base import BaseCommand
from defi.models import Protocol

class Command(BaseCommand):
    help = 'Seeds or updates the restricted list of protocols'

    def handle(self, *args, **kwargs):
        allowed_slugs = [
            "aave",
            "curve-dex",
            "makerdao",
            "compound-finance",
            "lido",
            "uniswap",
        ]

        # 1. Delete protocols NOT in the list
        deleted_count, _ = Protocol.objects.exclude(slug__in=allowed_slugs).delete()
        if deleted_count:
            self.stdout.write(self.style.WARNING(f"Deleted {deleted_count} protocols not in the allowed list."))

        # 2. Add or update protocols in the list
        protocol_data = {
            "aave": {"name": "Aave", "chain": "Ethereum", "risk_level": "medium", "website": "https://aave.com"},
            "curve-dex": {"name": "Curve DEX", "chain": "Multiple", "risk_level": "medium", "website": "https://curve.fi"},
            "makerdao": {"name": "MakerDAO", "chain": "Ethereum", "risk_level": "low", "website": "https://makerdao.com"},
            "compound-finance": {"name": "Compound Finance", "chain": "Ethereum", "risk_level": "medium", "website": "https://compound.finance"},
            "lido": {"name": "Lido", "chain": "Ethereum", "risk_level": "low", "website": "https://lido.fi"},
            "uniswap": {"name": "Uniswap", "chain": "Multiple", "risk_level": "medium", "website": "https://uniswap.org"},
        }

        for slug in allowed_slugs:
            data = protocol_data.get(slug, {"name": slug.title(), "chain": "Unknown", "risk_level": "medium", "website": ""})
            
            # Use get_or_create to avoid duplicates, or update_or_create to refresh data
            obj, created = Protocol.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": data["name"],
                    "chain": data["chain"],
                    "risk_level": data["risk_level"],
                    "website": data["website"]
                }
            )
            
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{action} protocol: {obj.name} ({slug})"))

        self.stdout.write(self.style.SUCCESS('Successfully seeded protocols.'))