import qrcode
import base64
import io
import os
from PIL import Image
from django.conf import settings


EC_MAP = {'L': qrcode.constants.ERROR_CORRECT_L, 'M': qrcode.constants.ERROR_CORRECT_M,
          'Q': qrcode.constants.ERROR_CORRECT_Q, 'H': qrcode.constants.ERROR_CORRECT_H}


def build_payload(qr_type, data):
    if qr_type == 'url':
        return data.get('url', '')
    if qr_type == 'text':
        return data.get('text', '')
    if qr_type == 'wifi':
        hidden = 'true' if data.get('hidden') else 'false'
        return f"WIFI:T:{data.get('encryption', 'WPA')};S:{data.get('ssid', '')};P:{data.get('password', '')};H:{hidden};;"
    if qr_type == 'vcard':
        return '\n'.join(['BEGIN:VCARD', 'VERSION:3.0', f"FN:{data.get('name', '')}",
            f"TEL;TYPE=CELL:{data.get('phone', '')}", f"EMAIL:{data.get('email', '')}",
            f"ORG:{data.get('org', '')}", f"TITLE:{data.get('title', '')}", 'END:VCARD'])
    if qr_type == 'email':
        return f"mailto:{data.get('email', '')}?subject={data.get('subject', '')}&body={data.get('body', '')}"
    if qr_type == 'sms':
        return f"SMSTO:{data.get('phone', '')}:{data.get('message', '')}"
    if qr_type == 'whatsapp':
        num = data.get('phone', '').replace('+', '').replace(' ', '')
        return f"https://wa.me/{num}?text={data.get('message', '')}"
    if qr_type == 'phone':
        return f"tel:{data.get('phone', '')}"
    if qr_type == 'event':
        return '\n'.join(['BEGIN:VEVENT', f"SUMMARY:{data.get('title', '')}",
            f"DTSTART:{data.get('start', '')}", f"DTEND:{data.get('end', '')}",
            f"LOCATION:{data.get('location', '')}", 'END:VEVENT'])
    if qr_type == 'app':
        return data.get('store_url', '')
    if qr_type == 'social':
        return data.get('profile_url', '')
    return ''


def embed_logo(qr_img, logo_path, ratio=0.22):
    img = qr_img.convert('RGB')
    w, h = img.size
    logo_size = int(min(w, h) * ratio)
    try:
        logo = Image.open(logo_path).convert('RGBA')
        logo.thumbnail((logo_size, logo_size), Image.LANCZOS)
        lw, lh = logo.size
        # white rounded backing so logo pops
        bg = Image.new('RGBA', (int(lw*1.18), int(lh*1.18)), (255, 255, 255, 255))
        px = (w - lw) // 2
        py = (h - lh) // 2
        bx = (w - bg.size[0]) // 2
        by = (h - bg.size[1]) // 2
        img = img.convert('RGBA')
        img.paste(bg, (bx, by), bg)
        img.paste(logo, (px, py), logo)
        return img.convert('RGB')
    except Exception:
        return qr_img


def render_qr(payload, fill_color='#7f1d1d', back_color='#ffffff', size=10,
              border=2, ec='H', logo_path=None):
    qr = qrcode.QRCode(version=None, error_correction=EC_MAP.get(ec, EC_MAP['H']),
                       box_size=size, border=border)
    qr.add_data(payload)
    qr.make(fit=True)
    img = qr.make_image(fill_color=fill_color, back_color=back_color)
    if logo_path and os.path.exists(str(logo_path)):
        img = embed_logo(img, str(logo_path))
    return img


def img_to_base64(img):
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    return base64.b64encode(buffer.getvalue()).decode('utf-8')
