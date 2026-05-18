from PIL import Image
import os

os.makedirs("icons", exist_ok=True)

# Create a 256x256 amber/orange icon matching FORGIA theme
img = Image.new("RGBA", (256, 256), (200, 160, 60, 255))

# Draw a simple "Ω" symbol in darker color
from PIL import ImageDraw, ImageFont

draw = ImageDraw.Draw(img)

# Try to draw Omega symbol
try:
    font = ImageFont.truetype("arial.ttf", 160)
except:
    font = ImageFont.load_default()

# Center the Omega
text = "Ω"
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
position = ((256 - text_width) // 2, (256 - text_height) // 2 - 20)

draw.text(position, text, fill=(40, 30, 10, 255), font=font)

# Save as multi-resolution ICO
img.save("icons/icon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

# Also save as PNG for other uses
img.save("icons/icon.png")

print("Icons generated successfully")
