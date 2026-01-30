
from PIL import Image
import os

source_path = r"C:\Users\SKYNET\.gemini\antigravity\brain\5b0eb156-cfb2-43ed-ae92-dd28cd150e48\uploaded_media_0_1769781735991.png"
dest_path = r"c:\Users\SKYNET\Desktop\K3 Boys\SkyDream\K3 Companies\Playsole\Playsole Dev\playsole\collectii\frontend\public\favicon.png"

def crop_image(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        # Get bounding box of non-transparent pixels
        bbox = img.getbbox()
        
        if bbox:
            print(f"Original size: {img.size}")
            print(f"Bounding box: {bbox}")
            cropped_img = img.crop(bbox)
            print(f"Cropped size: {cropped_img.size}")
            cropped_img.save(output_path)
            print(f"Saved optimized favicon to {output_path}")
        else:
            print("Image is fully transparent or empty. copying original.")
            img.save(output_path)
            
    except ImportError:
        print("PIL/Pillow not installed. Please run: pip install Pillow")
        exit(1)
    except Exception as e:
        print(f"Error: {e}")
        exit(1)

if __name__ == "__main__":
    crop_image(source_path, dest_path)
