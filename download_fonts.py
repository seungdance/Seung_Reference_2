#!/usr/bin/env python3
"""
Download Google Fonts (Jost and Libre Baskerville) for self-hosting
"""
import urllib.request
import re
import os

# Create fonts directory
os.makedirs('fonts', exist_ok=True)

# Get the CSS from Google Fonts
css_url = "https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400;1,700&display=swap"

print("Fetching font CSS...")
with urllib.request.urlopen(css_url) as response:
    css_content = response.read().decode('utf-8')

# Extract font URLs
font_urls = re.findall(r'url\((https://fonts\.gstatic\.com/[^)]+)\)', css_content)

print(f"Found {len(font_urls)} font files to download...")

# Download each font file
for i, url in enumerate(font_urls, 1):
    # Extract filename from URL
    filename = url.split('/')[-1]
    # Clean filename (remove query params if any)
    filename = filename.split('?')[0]
    
    # Determine font name and create subdirectory
    if 'jost' in url.lower():
        font_dir = 'fonts/jost'
        os.makedirs(font_dir, exist_ok=True)
        filepath = os.path.join(font_dir, filename)
    elif 'libre' in url.lower() or 'baskerville' in url.lower():
        font_dir = 'fonts/libre-baskerville'
        os.makedirs(font_dir, exist_ok=True)
        filepath = os.path.join(font_dir, filename)
    else:
        filepath = os.path.join('fonts', filename)
    
    # Download if not exists
    if not os.path.exists(filepath):
        print(f"[{i}/{len(font_urls)}] Downloading {filename}...")
        try:
            urllib.request.urlretrieve(url, filepath)
            print(f"  ✓ Saved to {filepath}")
        except Exception as e:
            print(f"  ✗ Error downloading {filename}: {e}")
    else:
        print(f"[{i}/{len(font_urls)}] {filename} already exists, skipping...")

print("\n✓ Font download complete!")
print("\nNote: These are TTF files. For better web performance, consider converting to WOFF2 format.")

