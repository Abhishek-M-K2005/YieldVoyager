import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from defi.scheduler import fetch_defillama_data

print("Manually triggering fetch_defillama_data to populate ChromaDB with live metrics...")
fetch_defillama_data()
print("Finished pulling live data.")
