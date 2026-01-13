"""
Script to create icon files for Chrome extension
Requires: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple icon with text 'FA' for Form Auto-Filler"""
    # Create a new image with transparent background
    img = Image.new('RGBA', (size, size), (33, 150, 243, 255))  # Blue background
    draw = ImageDraw.Draw(img)
    
    # Draw a white circle in the center
    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin], 
                 fill=(255, 255, 255, 255))
    
    # Try to add text "FA" (Form Auto-Filler)
    try:
        # Try to use a default font
        font_size = size // 2
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            # Try alternative font
            font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", font_size)
        except:
            # Use default font if system fonts not available
            font = ImageFont.load_default()
    
    # Calculate text position (centered)
    text = "FA"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) // 2, (size - text_height) // 2 - 5)
    
    # Draw text in blue
    draw.text(position, text, fill=(33, 150, 243, 255), font=font)
    
    # Save as PNG
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

def main():
    """Create all three icon sizes"""
    sizes = [16, 48, 128]
    
    for size in sizes:
        filename = f"icon{size}.png"
        create_icon(size, filename)
    
    print("\nAll icons created successfully!")
    print("Files created:")
    for size in sizes:
        print(f"  - icon{size}.png")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("Error: Pillow library not installed.")
        print("Install it using: pip install Pillow")
    except Exception as e:
        print(f"Error: {e}")

