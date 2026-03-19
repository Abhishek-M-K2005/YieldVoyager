
import os
import sys

print(f"System Path: {sys.path}")
print(f"Current Working Directory: {os.getcwd()}")

try:
    from dotenv import load_dotenv
    # Explicitly load .env from the current directory (which should be backend)
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    print(f"Loading .env from: {env_path}")
    if os.path.exists(env_path):
        print(".env file exists")
        load_dotenv(env_path)
    else:
        print(".env file DOES NOT EXIST")
except ImportError:
    print("Could not import dotenv. Try running 'pip install python-dotenv'")

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    print(f"API Key found: {api_key[:5]}...{api_key[-5:]} (length: {len(api_key)})")
else:
    print("API Key NOT FOUND in environment variables.")

try:
    from google import genai
    from google.genai import types
    print("Successfully imported google.genai")
    
    if api_key:
        try:
            client = genai.Client(api_key=api_key)
            print("Successfully initialized genai.Client")
        except Exception as e:
            print(f"Error initializing Client: {e}")
    else:
        print("Skipping Client init due to missing API Key.")
        
except ImportError as e:
    print(f"Failed to import google.genai: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
