import os
import requests
from PIL import Image, ImageEnhance

def process_local_textures(input_dir, output_dir):
    if not os.path.exists(input_dir):
        print(f"⚠️ Pasta '{input_dir}' não encontrada.")
        return

    files = [f for f in os.listdir(input_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if not files:
        print(f"⚠️ Nenhuma imagem encontrada em '{input_dir}'.")
        return

    os.makedirs(output_dir, exist_ok=True)
    
    for filename in files:
        in_path = os.path.join(input_dir, filename)
        out_path = os.path.join(output_dir, f"editorial_{filename}")
        
        try:
            print(f"Processando {filename}...")
            img = Image.open(in_path).convert("RGB")
            gray = img.convert("L")
            enhancer = ImageEnhance.Contrast(gray)
            high_contrast = enhancer.enhance(1.8)
            brightness = ImageEnhance.Brightness(high_contrast)
            darker = brightness.enhance(0.7)
            darker.save(out_path, quality=95)
            print(f"✅ Salvo em: {out_path}")
        except Exception as e:
            print(f"❌ Erro ao processar {filename}: {e}")

if __name__ == "__main__":
    input_dir = r"c:\Projetos\Aurora\MadLabAurora\Bando de Texturas"
    output_dir = r"c:\Projetos\Aurora\MadLabAurora\ElysianCorp\public\Banco de Texturas"
    process_local_textures(input_dir, output_dir)
