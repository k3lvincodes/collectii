
from PIL import Image
import numpy as np

file_path = r"c:\Users\SKYNET\Desktop\K3 Boys\SkyDream\K3 Companies\Playsole\Playsole Dev\playsole\collectii\frontend\public\favicon.png"

def analyze_and_fix(path):
    try:
        img = Image.open(path)
        img = img.convert("RGBA")
        data = np.array(img)
        
        # Check corners for white pixels
        corners = [
            data[0, 0],
            data[0, -1],
            data[-1, 0],
            data[-1, -1]
        ]
        
        print(f"Corner pixels: {corners}")
        
        # If corner is white or near white, make it transparent
        # Threshold for "white"
        threshold = 240
        
        # Mask of white-ish pixels
        red, green, blue, alpha = data.T
        white_areas = (red > threshold) & (green > threshold) & (blue > threshold) & (alpha == 255)
        
        if np.any(white_areas):
            print("Detected white background. converting to transparent and re-cropping...")
            data[white_areas.T] = [255, 255, 255, 0] # Make transparent
            img = Image.fromarray(data)
            
            # Re-crop
            bbox = img.getbbox()
            if bbox:
                print(f"New bounding box: {bbox}")
                img = img.crop(bbox)
                img.save(path)
                print(f"Saved corrected favicon to {path}")
            else:
                print("Image became empty after removing white.")
        else:
            print("No significant white background detected at corners.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_and_fix(file_path)
