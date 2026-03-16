from PIL import Image

def fix_logo(input_path, output_path):
    # open the original logo that we have now (logo_transparent.png could be overwritten, let's use the local logo.png)
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    threshold_white = 240
    threshold_black = 40
    
    for item in datas:
        # If it's pure white or close, make transparent
        if item[0] > threshold_white and item[1] > threshold_white and item[2] > threshold_white:
            newData.append((255, 255, 255, 0))
        # If it's black or very dark (which is the text), make it white
        elif item[0] < threshold_black and item[1] < threshold_black and item[2] < threshold_black and item[3] > 0:
            newData.append((255, 255, 255, item[3]))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

fix_logo("public/img/logo.png", "public/img/logo_transparent.png")
