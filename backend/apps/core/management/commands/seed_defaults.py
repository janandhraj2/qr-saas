from django.core.management.base import BaseCommand
from apps.core.models import Language, Translation, SiteSettings
from apps.payments.models import Plan, PaymentGateway


class Command(BaseCommand):
    help = 'Seed default languages, plans, gateways and settings'

    def handle(self, *args, **options):
        en, _ = Language.objects.get_or_create(code='en', defaults={'name': 'English', 'native_name': 'English', 'is_default': True})
        Language.objects.get_or_create(code='ta', defaults={'name': 'Tamil', 'native_name': 'தமிழ்'})
        Language.objects.get_or_create(code='hi', defaults={'name': 'Hindi', 'native_name': 'हिन्दी'})

        EN = {
            'nav_features': 'Features', 'nav_pricing': 'Pricing', 'nav_login': 'Login', 'nav_get_started': 'Get Started',
            'hero_badge': 'JAR SOLUTIONS PRESENTS', 'hero_title_1': 'QR Codes,', 'hero_title_2': 'Reimagined.',
            'hero_sub': 'Create stunning, customizable QR codes in seconds. From WiFi to WhatsApp — one platform for every need.',
            'hero_cta': 'Create Free QR', 'hero_cta2': 'View Pricing', 'hero_note': 'Free plan: 2 QR codes • No credit card needed',
            'feat_title': 'Why choose', 'feat_sub': 'Everything you need to create, manage and scale QR codes.',
            'types_title': 'Every QR type', 'types_sub': 'you need',
            'cta_title': 'Ready to get started?', 'cta_sub': 'Join JAR QR today — free forever plan available.', 'cta_btn': 'Start Creating Free',
            'dash_welcome': 'Welcome', 'dash_pro': 'JAR Pro — Unlimited QR codes', 'dash_guest_used': 'QR codes used',
            'dash_upgrade': 'Upgrade to Pro', 'dash_create': 'Create QR Code', 'dash_title_ph': 'Title (optional)',
            'dash_generate': 'Generate QR Code', 'dash_download': 'Download PNG', 'dash_mine': 'My QR Codes',
            'limit_alert': 'Guest limit reached. Upgrade to JAR Pro for unlimited codes!',
            'pricing_title': 'Simple, honest', 'pricing_sub': 'Start free. Upgrade when you grow. Cancel anytime.',
            'login_title': 'Welcome', 'login_sub': 'Login to your JAR QR account', 'login_btn': 'Login',
            'reg_title': 'Create', 'reg_sub': 'Free plan: 2 QR codes. No card needed.', 'reg_btn': 'Create Free Account',
        }
        for k, v in EN.items():
            Translation.objects.get_or_create(language=en, key=k, defaults={'value': v})

        TA = {
            'nav_features': 'அம்சங்கள்', 'nav_pricing': 'விலை', 'nav_login': 'உள்நுழை', 'nav_get_started': 'தொடங்குங்கள்',
            'hero_badge': 'JAR SOLUTIONS வழங்குகிறது', 'hero_title_1': 'QR குறியீடுகள்,', 'hero_title_2': 'மீண்டும் உருவாக்கப்பட்டது.',
            'hero_sub': 'வினாடிகளில் அழகான, தனிப்பயனாக்கக்கூடிய QR குறியீடுகளை உருவாக்குங்கள். WiFi முதல் WhatsApp வரை — எல்லா தேவைகளுக்கும் ஒரே தளம்.',
            'hero_cta': 'இலவச QR உருவாக்கு', 'hero_cta2': 'விலையைக் காண்', 'hero_note': 'இலவச திட்டம்: 2 QR குறியீடுகள் • கடன் அட்டை தேவையில்லை',
            'feat_title': 'ஏன் தேர்வு செய்ய வேண்டும்', 'feat_sub': 'QR குறியீடுகளை உருவாக்கவும், நிர்வகிக்கவும், விரிவாக்கவும் தேவையான அனைத்தும்.',
            'types_title': 'உங்களுக்குத் தேவையான', 'types_sub': 'எல்லா QR வகைகளும்',
            'cta_title': 'தொடங்கத் தயாரா?', 'cta_sub': 'இன்றே JAR QR இல் சேருங்கள் — எப்போதும் இலவச திட்டம் உள்ளது.', 'cta_btn': 'இலவசமாகத் தொடங்கு',
            'dash_welcome': 'வரவேற்கிறோம்', 'dash_pro': 'JAR Pro — வரம்பற்ற QR குறியீடுகள்', 'dash_guest_used': 'QR குறியீடுகள் பயன்படுத்தப்பட்டன',
            'dash_upgrade': 'Proக்கு மேம்படுத்து', 'dash_create': 'QR குறியீடு உருவாக்கு', 'dash_title_ph': 'தலைப்பு (விருப்பம்)',
            'dash_generate': 'QR குறியீடு உருவாக்கு', 'dash_download': 'PNG பதிவிறக்கு', 'dash_mine': 'எனது QR குறியீடுகள்',
            'limit_alert': 'விருந்தினர் வரம்பு எட்டப்பட்டது. வரம்பற்ற குறியீடுகளுக்கு JAR Proக்கு மேம்படுத்துங்கள்!',
            'pricing_title': 'எளிமையான, நேர்மையான', 'pricing_sub': 'இலவசமாகத் தொடங்குங்கள். வளர்ந்தால் மேம்படுத்துங்கள். எப்போது வேண்டுமானாலும் ரத்து செய்யுங்கள்.',
            'login_title': 'வரவேற்கிறோம்', 'login_sub': 'உங்கள் JAR QR கணக்கில் உள்நுழைக', 'login_btn': 'உள்நுழை',
            'reg_title': 'உருவாக்கு', 'reg_sub': 'இலவச திட்டம்: 2 QR குறியீடுகள். கடன் அட்டை தேவையில்லை.', 'reg_btn': 'இலவச கணக்கை உருவாக்கு',
        }
        ta = Language.objects.get(code='ta')
        for k, v in TA.items():
            Translation.objects.get_or_create(language=ta, key=k, defaults={'value': v})

        HI = {
            'nav_features': 'विशेषताएं', 'nav_pricing': 'मूल्य', 'nav_login': 'लॉगिन', 'nav_get_started': 'शुरू करें',
            'hero_badge': 'JAR SOLUTIONS प्रस्तुत करता है', 'hero_title_1': 'QR कोड,', 'hero_title_2': 'नए रूप में।',
            'hero_sub': 'सेकंडों में शानदार, कस्टमाइज़ेबल QR कोड बनाएं। WiFi से WhatsApp तक — हर ज़रूरत के लिए एक प्लेटफ़ॉर्म।',
            'hero_cta': 'मुफ़्त QR बनाएं', 'hero_cta2': 'मूल्य देखें', 'hero_note': 'मुफ़्त प्लान: 2 QR कोड • क्रेडिट कार्ड नहीं चाहिए',
            'feat_title': 'क्यों चुनें', 'feat_sub': 'QR कोड बनाने, प्रबंधित करने और बढ़ाने के लिए आपको जो कुछ भी चाहिए।',
            'types_title': 'हर QR प्रकार', 'types_sub': 'जो आपको चाहिए',
            'cta_title': 'शुरू करने के लिए तैयार?', 'cta_sub': 'आज ही JAR QR से जुड़ें — हमेशा के लिए मुफ़्त प्लान उपलब्ध।', 'cta_btn': 'मुफ़्त में शुरू करें',
            'dash_welcome': 'स्वागत है', 'dash_pro': 'JAR Pro — अनलिमिटेड QR कोड', 'dash_guest_used': 'QR कोड उपयोग किए गए',
            'dash_upgrade': 'Pro में अपग्रेड करें', 'dash_create': 'QR कोड बनाएं', 'dash_title_ph': 'शीर्षक (वैकल्पिक)',
            'dash_generate': 'QR कोड बनाएं', 'dash_download': 'PNG डाउनलोड करें', 'dash_mine': 'मेरे QR कोड',
            'limit_alert': 'मेहमान सीमा पूरी हो गई। अनलिमिटेड कोड के लिए JAR Pro में अपग्रेड करें!',
            'pricing_title': 'सरल, ईमानदार', 'pricing_sub': 'मुफ़्त में शुरू करें। बढ़ने पर अपग्रेड करें। कभी भी रद्द करें।',
            'login_title': 'स्वागत है', 'login_sub': 'अपने JAR QR खाते में लॉगिन करें', 'login_btn': 'लॉगिन',
            'reg_title': 'बनाएं', 'reg_sub': 'मुफ़्त प्लान: 2 QR कोड। कार्ड नहीं चाहिए।', 'reg_btn': 'मुफ़्त खाता बनाएं',
        }
        hi = Language.objects.get(code='hi')
        for k, v in HI.items():
            Translation.objects.get_or_create(language=hi, key=k, defaults={'value': v})

        SiteSettings.get()

        Plan.objects.get_or_create(key='pro_monthly', defaults={
            'name': 'JAR Pro - Monthly', 'price_inr': 199, 'days': 30, 'max_qrs': None,
            'features': ['Unlimited QR codes', 'All QR types', 'Logo inside QR', 'Custom colors & sizes', 'High-res PNG'],
            'is_popular': True})
        Plan.objects.get_or_create(key='pro_annual', defaults={
            'name': 'JAR Pro - Annual', 'price_inr': 1999, 'days': 365, 'max_qrs': None,
            'features': ['Everything in Monthly', '2 months free', 'Priority support']})
        Plan.objects.get_or_create(key='starter_pack', defaults={
            'name': 'Starter Pack', 'price_inr': 99, 'days': 365, 'max_qrs': 25,
            'features': ['25 QR codes', 'Logo inside QR', 'Custom colors']})

        PaymentGateway.objects.get_or_create(name='razorpay', defaults={
            'display_name': 'Razorpay (Cards / UPI / NetBanking)', 'is_default': True})
        PaymentGateway.objects.get_or_create(name='upi', defaults={
            'display_name': 'UPI Direct Transfer', 'config': {'upi_id': 'yourupi@bank'}, 'is_active': True})

        self.stdout.write(self.style.SUCCESS('Defaults seeded: languages, translations, plans, gateways.'))
