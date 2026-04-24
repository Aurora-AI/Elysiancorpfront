import os
import requests
import json
from PIL import Image, ImageEnhance

def download_and_process_unsplash(output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    print("\nIniciando curadoria do Unsplash (API NAPI)...")
    url = "https://unsplash.com/napi/topics/textures-patterns/photos?page=1&per_page=10"
    
    try:
        r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        if r.status_code != 200:
            print(f"❌ Erro na API do Unsplash: HTTP {r.status_code}")
            return
            
        data = r.json()
        count = 0
        
        for item in data:
            if count >= 5:
                break
                
            img_id = item['id']
            img_url = item['urls']['raw'] + "&w=1920&q=80&fit=crop"
            slug = item.get('slug', img_id)
            
            # Temporary file
            temp_path = os.path.join(output_dir, f"temp_{img_id}.jpg")
            final_path = os.path.join(output_dir, f"editorial_{slug}.jpg")
            
            if os.path.exists(final_path):
                print(f"⏭️ {slug} já existe. Pulando.")
                count += 1
                continue
                
            print(f"Baixando textura {img_id}...")
            img_res = requests.get(img_url, timeout=15)
            if img_res.status_code == 200:
                with open(temp_path, 'wb') as f:
                    f.write(img_res.content)
                
                # Processamento Dark Editorial
                print(f"Aplicando Design System (Carvão Abissal) em {img_id}...")
                img = Image.open(temp_path).convert("RGB")
                gray = img.convert("L")
                enhancer = ImageEnhance.Contrast(gray)
                high_contrast = enhancer.enhance(1.8)
                brightness = ImageEnhance.Brightness(high_contrast)
                darker = brightness.enhance(0.7)
                
                darker.save(final_path, quality=95)
                os.remove(temp_path)
                print(f"✅ Textura pronta: {final_path}")
                count += 1
            else:
                print(f"❌ Falha no download de {img_id}")
                
    except Exception as e:
        print(f"❌ Erro fatal: {e}")

if __name__ == "__main__":
    output_directory = r"c:\Projetos\Aurora\MadLabAurora\ElysianCorp\public\Banco de Texturas"
    print("==================================================")
    print("   ELYSIAN CORP - TEXTURE CURATION PROTOCOL       ")
    print("==================================================")
    download_and_process_unsplash(output_directory)
    print("\n✨ Curadoria finalizada com sucesso!")
