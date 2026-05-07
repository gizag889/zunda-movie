from PIL import Image
import os

def resize_image(path, max_height=2000):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    
    img = Image.open(path)
    width, height = img.size
    
    if height > max_height:
        new_height = max_height
        new_width = int(width * (max_height / height))
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        img.save(path)
        print(f"Resized {path} from {height} to {new_height}")
    else:
        # 形式を最適化するために再保存
        img.save(path)
        print(f"Optimized {path}")

if __name__ == "__main__":
    resize_image("public/metan.png")
    resize_image("public/zundamon.png")
    resize_image("public/zunda_mouse_open.png")

