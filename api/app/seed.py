"""Örnek (demo) veri seti.

DİKKAT: Buradaki bankalar kurgusaldır, oranlar ve koşullar gerçek değildir.
Gerçek veriye geçildiğinde her kayıt bankanın resmî kaynağına bağlanmalı ve
`verified=True` ancak elle doğrulandıktan sonra işaretlenmelidir.
"""

from datetime import datetime

from sqlalchemy.orm import Session

from .models import Bank, Category, Product

SAMPLE_SOURCE = "Örnek veri – gerçek bir banka kaynağı değildir"

BANKS = [
    ("ay-katilim", "Ay Katılım Bankası", "https://example.com/ay-katilim"),
    ("vadi-katilim", "Vadi Katılım", "https://example.com/vadi-katilim"),
    ("cinar-katilim", "Çınar Katılım", "https://example.com/cinar-katilim"),
    ("deniz-katilim", "Deniz Katılım Bankası", "https://example.com/deniz-katilim"),
]

CATEGORIES = [
    {
        "slug": "katilma-hesaplari",
        "name": "Katılma Hesapları",
        "icon": "🏦",
        "sort_order": 1,
        "description": "Paranı belirli bir vade için bankanın havuzuna yatırırsın; sonuç, kâr paylaşım esaslarına göre hesaplanır.",
        "flow_steps": [
            {"icon": "💰", "title": "Paranı yatır", "description": "Katılma hesabını açar, tutarı seçtiğin vade boyunca hesaba yatırırsın."},
            {"icon": "🏦", "title": "Para ilgili havuzda değerlendirilir", "description": "Paran bankanın ilgili fon havuzuna katılır ve diğer hesap sahiplerinin paralarıyla birlikte yönetilir."},
            {"icon": "🔄", "title": "Banka tarafından finansal faaliyetlerde kullanılır", "description": "Banka, havuzu faizsiz bankacılık ilkelerine uygun ticari, finansman ve yatırım faaliyetlerinde kullanır."},
            {"icon": "📊", "title": "Elde edilen kâr paylaşım esaslarına göre hesaplanır", "description": "Sonuç, hesap sözleşmesindeki paylaşım oranına ve paranın havuzda kaldığı süreye göre dağıtılır."},
            {"icon": "✅", "title": "Vade sonunda hesabına yansır", "description": "Paran ve oluşan kâr payı/sonuç hesabına yansır. Kâr payı oranı önceden garanti edilmez."},
        ],
        "key_risks": [
            "Kâr payı oranı önceden kesin değildir; havuzun sonucuna göre değişir.",
            "Katılma hesaplarında kâr kadar zarara katılma ilkesi de geçerlidir.",
            "Vadesinden önce bozdurmada kâr payı azalabilir veya hiç oluşmayabilir.",
            "Sigorta kapsamı ve limitler için bankanın ve TMSF'nin güncel resmî bilgilerine bakınız.",
        ],
    },
    {
        "slug": "altin-kiymetli-maden",
        "name": "Altın ve Kıymetli Madenler",
        "icon": "🪙",
        "sort_order": 2,
        "description": "Paranı altın veya diğer kıymetli madenlere çevirirsin; değerin piyasa fiyatıyla birlikte değişir.",
        "flow_steps": [
            {"icon": "🪙", "title": "Paranı kıymetli madene çevir", "description": "TL'ni bankanın o anki alış fiyatından gram altın (veya gümüş vb.) bakiyesine çevirirsin."},
            {"icon": "🏦", "title": "Bakiyen hesabında tutulur", "description": "Hesap türüne göre madenin saklanması veya bankanın faizsiz faaliyetlerinde kullanılması söz konusudur."},
            {"icon": "📈", "title": "Değer piyasa fiyatıyla değişir", "description": "Gram fiyatı piyasada hareket ettikçe bakiyenin TL karşılığı da değişir."},
            {"icon": "💱", "title": "Bozdurduğunda sonuç oluşur", "description": "Bakiyeni TL'ye çevirdiğinde o günkü banka satış fiyatı üzerinden sonuç oluşur; fark kâr ya da zarar olabilir."},
        ],
        "key_risks": [
            "Kıymetli maden fiyatları kısa sürede önemli ölçüde dalgalanabilir.",
            "Alış ve satış fiyatı arasında fark (makas) bulunur; bu fark sonucu etkiler.",
            "Vadeli altın hesaplarında kâr payı varsa garanti edilmez.",
        ],
    },
    {
        "slug": "katilim-fonlari",
        "name": "Katılım Fonları",
        "icon": "📊",
        "sort_order": 3,
        "description": "Paran, katılım esaslarına uygun varlıklara yatırım yapan bir fonun payına dönüşür; değer fonun performansına göre değişir.",
        "flow_steps": [
            {"icon": "💰", "title": "Paranı fona yatır", "description": "Fon payı satın alırsın; paran fonun portföyüne katılır."},
            {"icon": "🧭", "title": "Fon, stratejisine göre yatırım yapar", "description": "Fon yöneticisi, izahnamede belirtilen stratejiye göre katılım esaslarına uygun çeşitli varlıklara (kira sertifikası, katılma hesabı, hisse, altın vb.) yatırım yapar."},
            {"icon": "📈", "title": "Fonun değeri performansa göre değişir", "description": "Pay fiyatı, yatırım yapılan varlıkların performansına göre her gün değişir."},
            {"icon": "💱", "title": "Fonunu sattığında sonuç oluşur", "description": "Payları sattığında o tarihteki pay fiyatı üzerinden sonuç oluşur; değer artmış ya da azalmış olabilir."},
        ],
        "key_risks": [
            "Geçmiş performans gelecekteki sonuçların garantisi değildir.",
            "Fonlarda anapara veya getiri garantisi yoktur.",
            "Yönetim ücreti ve satış valörü gibi maliyet/koşullar sonucu etkiler.",
        ],
    },
    {
        "slug": "kira-sertifikalari",
        "name": "Kira Sertifikaları",
        "icon": "📜",
        "sort_order": 4,
        "description": "Bir varlığın kira gelirine ortak olursun; kira payı dönemsel ödenir, vade sonunda sertifikanın bedeli itfa edilir.",
        "flow_steps": [
            {"icon": "💰", "title": "Sertifikayı satın alırsın", "description": "Paranla ihraç edilen kira sertifikasından alırsın."},
            {"icon": "🏢", "title": "Toplanan tutarla varlık kiralanır", "description": "Varlık kiralama şirketi, toplanan tutarla bir varlığın kullanım hakkını edinir ve kiraya verir."},
            {"icon": "💵", "title": "Kira gelirinden payın ödenir", "description": "Kira gelirinden sana düşen pay, belirlenen dönemlerde (ör. 6 ayda bir) hesabına geçer."},
            {"icon": "✅", "title": "Vade sonunda itfa edilir", "description": "Vade geldiğinde sertifikanın nominal değeri ödenir."},
        ],
        "key_risks": [
            "İhraççının ödeme gücüne bağlı kredi riski bulunur.",
            "Vadeden önce satışta fiyat, nominal değerin altında kalabilir.",
            "İkinci el piyasada alıcı bulma (likidite) zorlaşabilir.",
        ],
    },
    {
        "slug": "diger",
        "name": "Diğer Tasarruf Ürünleri",
        "icon": "🧩",
        "sort_order": 5,
        "description": "Bireysel emeklilik gibi diğer katılım esaslı birikim ürünleri.",
        "flow_steps": [
            {"icon": "💰", "title": "Düzenli katkı payı ödersin", "description": "Plan sözleşmesinde belirlenen tutarı belirlenen periyotta yatırırsın."},
            {"icon": "🧭", "title": "Katkı payın fonlara yönlendirilir", "description": "Emeklilik şirketi, seçtiğin katılım esaslı fonlara yatırım yapar."},
            {"icon": "📈", "title": "Birikimin fon performansına göre değişir", "description": "Birikimin, fon performansı ve yasal koşullara göre (devlet katkısı vb.) büyüyebilir veya azalabilir."},
            {"icon": "✅", "title": "Şartlar oluşunca birikimine ulaşırsın", "description": "Emeklilik veya ayrılma koşullarına göre birikimini alabilirsin."},
        ],
        "key_risks": [
            "Fon performansı garanti değildir; birikim azalabilir.",
            "Erken ayrılmada devlet katkısı ve getirilerde kayıplar olabilir.",
        ],
    },
]

# (slug, banka, kategori, ad, özet, para birimi, min, max, min_vade, max_vade,
#  risk, getiri tipi, getiri bilgisi, masraf, özellikler, özel akış)
PRODUCTS = [
    # --- Katılma hesapları ---
    dict(slug="ay-tl-katilma-hesabi", bank="ay-katilim", category="katilma-hesaplari",
         name="TL Katılma Hesabı", summary="1 ile 12 ay arası esnek vadelerle TL katılma hesabı.",
         currency="TL", min_amount=1000, max_amount=None, min_term_days=30, max_term_days=365,
         risk_level=2, return_type="Değişken kâr payı",
         return_info="Örnek: son dönem kâr payı oranı yıllık %40 civarı (garanti değildir)",
         fees="Hesap açılış ve işletim ücreti yok (örnek).",
         features=["Vade seçimi 1–12 ay", "Dönem sonunda kâr payı hesaba yansır", "İnternet şubesinden açılabilir"]),
    dict(slug="vadi-3-aylik-tl-katilma", bank="vadi-katilim", category="katilma-hesaplari",
         name="3 Aylık TL Katılma Hesabı", summary="3–6 ay vadeli, orta vadeli birikim için katılma hesabı.",
         currency="TL", min_amount=5000, max_amount=5000000, min_term_days=90, max_term_days=180,
         risk_level=2, return_type="Değişken kâr payı",
         return_info="Örnek: yıllık %42 civarı (garanti değildir)",
         fees="Erken bozdurmada kâr payı kesintisi olabilir (örnek).",
         features=["90–180 gün vade", "Minimum 5.000 TL", "Otomatik yenileme seçeneği"]),
    dict(slug="cinar-uzun-vadeli-tl-katilma", bank="cinar-katilim", category="katilma-hesaplari",
         name="Uzun Vadeli TL Katılma Hesabı", summary="1–3 yıl vadeli, uzun dönem birikim için katılma hesabı.",
         currency="TL", min_amount=10000, max_amount=None, min_term_days=365, max_term_days=1095,
         risk_level=3, return_type="Değişken kâr payı",
         return_info="Örnek: yıllık %44 civarı (garanti değildir)",
         fees="Hesap işletim ücreti yok (örnek).",
         features=["1–3 yıl vade", "Daha yüksek tutarlar için uygun", "Vade sonunda kâr payı yansır"]),
    dict(slug="deniz-usd-katilma-hesabi", bank="deniz-katilim", category="katilma-hesaplari",
         name="USD Katılma Hesabı", summary="Dolar cinsinden 1–12 ay vadeli katılma hesabı.",
         currency="USD", min_amount=500, max_amount=None, min_term_days=30, max_term_days=365,
         risk_level=3, return_type="Değişken kâr payı",
         return_info="Örnek: yıllık %3 civarı (garanti değildir)",
         fees="Döviz bozdurma işlemlerinde banka kuru uygulanır (örnek).",
         features=["USD cinsinden hesap", "1–12 ay vade", "Kur riski kullanıcıya aittir"]),
    # --- Altın / kıymetli maden ---
    dict(slug="ay-vadeli-altin-katilma", bank="ay-katilim", category="altin-kiymetli-maden",
         name="Vadeli Altın Katılma Hesabı", summary="Gram altın bakiyeni vadeli olarak havuzda değerlendirir.",
         currency="TL", min_amount=5000, max_amount=None, min_term_days=90, max_term_days=365,
         risk_level=3, return_type="Altın cinsinden değişken kâr payı",
         return_info="Örnek: yıllık %0,5–1 gram bazlı kâr payı (garanti değildir)",
         fees="Altın alış/satış makası uygulanır (örnek).",
         features=["Gram altın cinsinden", "90–365 gün vade", "Kâr payı altın olarak yansır"],
         flow_steps=[
             {"icon": "🪙", "title": "Paranı altına çevir", "description": "TL'ni bankanın alış fiyatından gram altın bakiyesine çevirirsin."},
             {"icon": "🏦", "title": "Altının havuzda değerlendirilir", "description": "Altın bakiyen, vade boyunca bankanın altın havuzunda faizsiz bankacılık ilkelerine uygun şekilde kullanılır."},
             {"icon": "📊", "title": "Kâr payı altın cinsinden hesaplanır", "description": "Elde edilen sonuç paylaşım esaslarına göre hesaplanır ve gram altın olarak bakiyene eklenir."},
             {"icon": "💱", "title": "Vade sonunda altını bozdurabilir ya da tutabilirsin", "description": "Bozdurursan o günkü satış fiyatı üzerinden TL karşılığı oluşur; fiyat düşmüşse TL değerin azalabilir."},
         ]),
    dict(slug="vadi-vadesiz-altin-hesabi", bank="vadi-katilim", category="altin-kiymetli-maden",
         name="Vadesiz Altın Hesabı", summary="Dilediğin zaman alıp satabileceğin gram altın hesabı.",
         currency="TL", min_amount=500, max_amount=None, min_term_days=None, max_term_days=None,
         risk_level=3, return_type="Fiyat değişimi",
         return_info="Getiri yok; sonuç gram altın fiyatındaki değişime bağlı",
         fees="Alış/satış makası uygulanır (örnek).",
         features=["Vadesiz, istediğinde bozdurulabilir", "Küçük tutarlarla başlanabilir", "Mobil uygulamadan işlem"]),
    dict(slug="cinar-kiymetli-maden-hesabi", bank="cinar-katilim", category="altin-kiymetli-maden",
         name="Gümüş / Kıymetli Maden Hesabı", summary="Gümüş ve diğer kıymetli madenler için vadesiz hesap.",
         currency="TL", min_amount=1000, max_amount=None, min_term_days=None, max_term_days=None,
         risk_level=4, return_type="Fiyat değişimi",
         return_info="Getiri yok; sonuç maden fiyatındaki değişime bağlı",
         fees="Alış/satış makası uygulanır (örnek).",
         features=["Gümüş ve platin seçenekleri", "Vadesiz", "Fiyat oynaklığı yüksek olabilir"]),
    # --- Katılım fonları ---
    dict(slug="deniz-katilim-para-piyasasi-fonu", bank="deniz-katilim", category="katilim-fonlari",
         name="Katılım Para Piyasası Fonu", summary="Kısa vadeli, düşük oynaklıklı katılım esaslı enstrümanlara yatırım yapan fon.",
         currency="TL", min_amount=100, max_amount=None, min_term_days=None, max_term_days=None,
         risk_level=2, return_type="Pay fiyatı değişimi",
         return_info="Geçmiş performans (örnek): son 1 yıl yaklaşık %38 (gelecek için garanti değildir)",
         fees="Yıllık yönetim ücreti %0,5 (örnek).",
         features=["Günlük alım-satım", "Kısa vadeli enstrümanlar", "Düşük risk profili"]),
    dict(slug="ay-katilim-hisse-fonu", bank="ay-katilim", category="katilim-fonlari",
         name="Katılım Hisse Senedi Fonu", summary="Katılım endeksine uygun hisselere yatırım yapan fon.",
         currency="TL", min_amount=100, max_amount=None, min_term_days=None, max_term_days=None,
         risk_level=5, return_type="Pay fiyatı değişimi",
         return_info="Geçmiş performans (örnek): yıllık dalgalı; kayıp ihtimali yüksek",
         fees="Yıllık yönetim ücreti %2 (örnek).",
         features=["Hisse ağırlıklı portföy", "Yüksek oynaklık", "Uzun vade için tasarlanmış"]),
    dict(slug="cinar-katilim-karma-fon", bank="cinar-katilim", category="katilim-fonlari",
         name="Katılım Değişken Fon", summary="Kira sertifikası, altın ve hisse arasında dağıtım yapan karma fon.",
         currency="TL", min_amount=250, max_amount=None, min_term_days=None, max_term_days=None,
         risk_level=3, return_type="Pay fiyatı değişimi",
         return_info="Geçmiş performans (örnek): son 1 yıl yaklaşık %35",
         fees="Yıllık yönetim ücreti %1,5 (örnek).",
         features=["Dengeli varlık dağılımı", "Yönetici dağılımı değiştirebilir", "Günlük alım-satım"]),
    dict(slug="vadi-katilim-altin-fonu", bank="vadi-katilim", category="katilim-fonlari",
         name="Katılım Altın Fonu", summary="Portföyünü ağırlıklı olarak altına bağlayan katılım fonu.",
         currency="TL", min_amount=100, max_amount=None, min_term_days=None, max_term_days=None,
         risk_level=4, return_type="Pay fiyatı değişimi",
         return_info="Geçmiş performans (örnek): altın fiyatına paralel hareket eder",
         fees="Yıllık yönetim ücreti %1 (örnek).",
         features=["Altına dayalı portföy", "Fiziksel altın saklama yok", "Günlük alım-satım"]),
    # --- Kira sertifikaları ---
    dict(slug="vadi-6-aylik-kira-sertifikasi", bank="vadi-katilim", category="kira-sertifikalari",
         name="6 Aylık Kira Sertifikası", summary="Kısa vadeli, dönem sonunda itfa edilen kira sertifikası.",
         currency="TL", min_amount=1000, max_amount=None, min_term_days=180, max_term_days=180,
         risk_level=2, return_type="Sabit kira payı (vade sonu)",
         return_info="Örnek: 6 ay için yaklaşık %20 kira payı (ihraççıya bağlı)",
         fees="İhraç ve saklama masrafı yok (örnek).",
         features=["Vade sonunda tek ödeme", "Nominal değer itfa edilir", "İhraççı riski vardır"]),
    dict(slug="deniz-2-yillik-kira-sertifikasi", bank="deniz-katilim", category="kira-sertifikalari",
         name="2 Yıllık Değişken Kira Sertifikası", summary="Kira payı dönemsel ödenen, 2 yıl vadeli sertifika.",
         currency="TL", min_amount=10000, max_amount=None, min_term_days=720, max_term_days=730,
         risk_level=3, return_type="Dönemsel değişken kira payı",
         return_info="Örnek: 6 aylık dönemlerde ödeme, referans orana bağlı değişken",
         fees="İkinci el satışta işlem komisyonu olabilir (örnek).",
         features=["6 ayda bir kira payı", "2 yıl vade", "İkincil piyasada satılabilir"]),
    # --- Diğer ---
    dict(slug="cinar-katilim-bes-plani", bank="cinar-katilim", category="diger",
         name="Katılım Esaslı BES Planı", summary="Katılım esaslı fonlara yatırım yapan bireysel emeklilik planı.",
         currency="TL", min_amount=500, max_amount=None, min_term_days=None, max_term_days=None,
         risk_level=3, return_type="Fon performansı",
         return_info="Birikim, seçilen fonların performansına göre değişir",
         fees="Fon yönetim ve plan masrafları sözleşmede belirtilir (örnek).",
         features=["Aylık katkı payı", "Katılım esaslı fon seçenekleri", "Devlet katkısı yasal koşullara bağlı"]),
]


def seed_if_empty(db: Session) -> None:
    if db.query(Bank).count() > 0:
        return

    banks = {slug: Bank(slug=slug, name=name, website_url=url) for slug, name, url in BANKS}
    categories = {c["slug"]: Category(**c) for c in CATEGORIES}
    db.add_all([*banks.values(), *categories.values()])
    db.flush()

    now = datetime.utcnow()
    for p in PRODUCTS:
        data = dict(p)
        bank = banks[data.pop("bank")]
        category = categories[data.pop("category")]
        db.add(
            Product(
                bank_id=bank.id,
                category_id=category.id,
                source_label=SAMPLE_SOURCE,
                source_url=f"{bank.website_url}/urunler/{data['slug']}",
                official_url=f"{bank.website_url}/basvuru/{data['slug']}",
                fetched_at=now,
                verified=False,
                **data,
            )
        )
    db.commit()
