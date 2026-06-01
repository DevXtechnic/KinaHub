import os
import sys
import hashlib
import urllib.request
from urllib.error import URLError
import django

# Setup Django
sys.path.insert(0, '/home/neo/Project/kina_ai/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from products.models import ProductImage, Review
from sellers.models import Store

DOWNLOADS_DIR = os.path.join(settings.MEDIA_ROOT, 'downloads')
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

# Helper function to download and hash
def download_media(url):
    if not url or url.startswith('/media/'):
        return url
        
    url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()
    
    # Guess extension
    ext = '.jpg'
    if '.png' in url.lower(): ext = '.png'
    elif '.mp4' in url.lower(): ext = '.mp4'
    elif 'unsplash' in url.lower(): ext = '.jpg'
    
    filename = f"{url_hash}{ext}"
    local_path = os.path.join(DOWNLOADS_DIR, filename)
    relative_url = f"/media/downloads/{filename}"
    
    if os.path.exists(local_path):
        return relative_url
        
    print(f"Downloading {url} ...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(local_path, 'wb') as out_file:
            out_file.write(response.read())
        return relative_url
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return url

print("--- Migrating Product Images ---")
for img in ProductImage.objects.all():
    new_url = download_media(img.image_url)
    if new_url != img.image_url:
        img.image_url = new_url
        img.save()

print("--- Migrating Review Media ---")
for review in Review.objects.all():
    changed = False
    if review.image_url:
        new_img = download_media(review.image_url)
        if new_img != review.image_url:
            review.image_url = new_img
            changed = True
    if review.video_url:
        new_vid = download_media(review.video_url)
        if new_vid != review.video_url:
            review.video_url = new_vid
            changed = True
    if changed:
        review.save()

print("--- Migrating Store Media ---")
for store in Store.objects.all():
    changed = False
    if store.logo_url:
        new_logo = download_media(store.logo_url)
        if new_logo != store.logo_url:
            store.logo_url = new_logo
            changed = True
    if store.banner_url:
        new_banner = download_media(store.banner_url)
        if new_banner != store.banner_url:
            store.banner_url = new_banner
            changed = True
    if changed:
        store.save()

print("Done migrating media!")
