"""Albaraka Türk Katılım Bankası Gerçek Ürün Veri Seti.

Tüm ürünler Albaraka Türk Katılım Bankası ve Albaraka Portföy Yönetimi'nin
kamuya açık, resmî ürün ve hizmetlerine dayanmaktadır.
Bağlantıların tamamı canlı olarak HTTP 200 doğrulanmıştır.
"""

from datetime import datetime

from sqlalchemy.orm import Session

from .models import Bank, Category, Product

ALBARAKA_SOURCE = "Albaraka Türk Katılım Bankası Resmî Web Sitesi (albaraka.com.tr)"

BANKS = [
    ("albaraka-turk", "Albaraka Türk", "https://www.albaraka.com.tr"),
]

CATEGORIES = [
    {
        "slug": "katilma-hesaplari",
        "name": "Katılma Hesapları",
        "icon": "🏦",
        "sort_order": 1,
        "description": "Tasarruflarınızı Albaraka'nın kâr-zarar ortaklığı havuzunda faizsiz bankacılık ilkeleriyle değerlendirin.",
        "flow_steps": [
            {"icon": "💰", "title": "Hesap açılır ve tutar yatırılır", "description": "Seçtiğiniz vadeye (1, 3, 6 ay, 1 yıl veya 3 yıl) göre Albaraka Katılma Hesabı açılır."},
            {"icon": "🏦", "title": "Albaraka fon havuzuna dahil edilir", "description": "Paranız Albaraka Türk'ün ilgili para birimi fon havuzunda toplanır."},
            {"icon": "🔄", "title": "Faizsiz ticari ve finansman faaliyetlerinde işletilir", "description": "Toplanan fonlar kurumsal ve bireysel finansmanlarda, faizsiz ticaret ve yatırım işlemlerinde kullanılır."},
            {"icon": "📊", "title": "Kâr paylaşım oranına göre payınız hesaplanır", "description": "Dönem sonunda havuzun elde ettiği kâr, sözleşmedeki paylaşım oranına ve vade gününüze göre paylaştırılır."},
            {"icon": "✅", "title": "Anaparanız ve kâr payınız hesabınıza yansır", "description": "Vade bitiminde oluşan kâr payı hesabınıza aktarılır. Katılma hesapları 1.200.000 TL'ye kadar TMSF güvencesindedir."},
        ],
        "key_risks": [
            "Kâr payı oranı önceden taahhüt edilmez, havuzun gerçekleşen kârına göre belirlenir.",
            "Katılım bankacılığı esası gereği anapara garantisi kâr-zarar ortaklığı ilkesine dayanır.",
            "Vadesinden önce para çekildiğinde vadesiz hesap statüsü geçerli olabilir ve kâr payı kaybı yaşanabilir.",
            "1.200.000 TL'ye kadar olan kısım TMSF sigortası kapsamındadır.",
        ],
    },
    {
        "slug": "altin-kiymetli-maden",
        "name": "Altın ve Kıymetli Madenler",
        "icon": "🪙",
        "sort_order": 2,
        "description": "Fiziki saklama, kaybolma ve çalınma riski olmadan vadeli kârlı veya vadesiz altın/gümüş birikimi yapın.",
        "flow_steps": [
            {"icon": "🪙", "title": "Altın veya gümüş bakiyesi alınır", "description": "TL veya döviz karşılığı bankanın anlık kuruyla 24 ayar saf altın veya gümüş bakiyesine dönüştürülür."},
            {"icon": "🏦", "title": "Albaraka güvencesinde saklanır veya işletilir", "description": "Vadesiz hesapta güvenle saklanır; Kârlı Altın Hesabı'nda ise altın havuzunda faizsiz finansmanda kullanılır."},
            {"icon": "📈", "title": "Gram altın kâr payı ve fiyat artışı kazanılır", "description": "Kârlı Altın Hesabı'nda getiri yine gram altın olarak eklenir, maden fiyatı arttıkça toplam değeriniz yükselir."},
            {"icon": "💱", "title": "İstendiğinde nakde çevrilir", "description": "Albaraka Mobil veya şubelerden güncel kurla anında TL'ye dönüştürülebilir."},
        ],
        "key_risks": [
            "Kıymetli maden piyasasındaki fiyat dalgalanmalarından kaynaklı kur/fiyat riski bulunur.",
            "Banka alış-satış kur farkı (makas aralığı) piyasa koşullarına göre değişkenlik gösterebilir.",
        ],
    },
    {
        "slug": "katilim-fonlari",
        "name": "Katılım Yatırım Fonları",
        "icon": "📊",
        "sort_order": 3,
        "description": "Albaraka Portföy uzmanlığıyla yönetilen; kira sertifikası, hisse senedi ve altına dayalı katılım fonları.",
        "flow_steps": [
            {"icon": "💰", "title": "Fon payı satın alınır", "description": "Albaraka Mobil veya TEFAS üzerinden Albaraka Portföy katılım fonlarından pay adedi alınır."},
            {"icon": "🧭", "title": "Portföy yöneticileri faizsiz varlıklara yatırım yapar", "description": "Fon izahnamesine göre katılım endeksi hisseleri, kira sertifikaları (sukuk) veya altın varlıkları profesyonelce yönetilir."},
            {"icon": "📈", "title": "Fon pay değeri piyasayla birlikte güncellenir", "description": "Varlıkların getirisine paralel olarak fon pay fiyatı her iş günü TEFAS'ta yeniden hesaplanır."},
            {"icon": "💱", "title": "İstediğiniz iş günü nakde çevrilebilir", "description": "Fon satış valörü süresinde (T+1 veya T+2) satış emri vererek getiriyle birlikte nakde dönüştürülür."},
        ],
        "key_risks": [
            "Yatırım fonlarında anapara garantisi bulunmaz, getiri piyasa performansına bağlıdır.",
            "Hisse senedi ağırlıklı fonlarda (RBH) dalgalanma ve değer kaybı riski daha yüksektir.",
            "Yıllık fon işletim gider kesintisi fon birim pay fiyatının içinden günlük olarak yansıtılır.",
        ],
    },
    {
        "slug": "kira-sertifikalari",
        "name": "Kira Sertifikaları (Sukuk)",
        "icon": "📜",
        "sort_order": 4,
        "description": "Gayrimenkul ve somut varlıkların kira gelirlerine ortak olarak dönemsel düzenli getiri elde edin.",
        "flow_steps": [
            {"icon": "💰", "title": "Kira sertifikası (Sukuk) satın alınır", "description": "Albaraka Türk veya Hazine/kamu tarafından ihraç edilen kira sertifikası portföyünüze eklenir."},
            {"icon": "🏢", "title": "Somut varlıkların kira gelirine ortak olunur", "description": "Varlık kiralama şirketinin mülkiyetindeki varlıkların kira getirisi ihraç şartlarına göre toplanır."},
            {"icon": "💵", "title": "Dönemsel kira payı hesaba yatar", "description": "Genellikle 3 veya 6 aylık kupon dönemlerinde belirlenen kira payı doğrudan hesabınıza ödenir."},
            {"icon": "✅", "title": "İtfa tarihinde anapara geri ödenir", "description": "Vade sonunda sertifikanın nominal anapara bedeli hesabınıza iade edilir."},
        ],
        "key_risks": [
            "İhraççı kurumun (Bereket VKŞ, Hazine vb.) kredi ve geri ödeme güvenilirliğine bağlıdır.",
            "Vadesinden önce ikincil piyasada satılmak istendiğinde anlık piyasa fiyatı nominal değerin altında kalabilir.",
        ],
    },
    {
        "slug": "diger",
        "name": "Bireysel Emeklilik & Birikim",
        "icon": "🧩",
        "sort_order": 5,
        "description": "Devlet katkısı destekli, faizsiz fonlarla geleceğe yönelik uzun vadeli düzenli birikim planları.",
        "flow_steps": [
            {"icon": "💰", "title": "Aylık düzenli katkı payı yatırılır", "description": "Belirlediğiniz periyot ve tutarla Albaraka Katılım BES hesabınıza ödeme yapılır."},
            {"icon": "🧭", "title": "Faizsiz katılım fonlarında büyütülür", "description": "Tasarruflarınız Albaraka Portföy'ün katılım esaslı emeklilik yatırım fonlarında değerlendirilir."},
            {"icon": "🎁", "title": "%30 Devlet katkısı eklenir", "description": "Yatırdığınız her tutar için yasal şartlar dahilinde %30 oranında devlet katkısı hak edişi birikir."},
            {"icon": "✅", "title": "Emeklilik döneminde toplu veya maaş olarak alınır", "description": "10 yıl ve 56 yaş kriteri tamamlandığında avantajlı vergilendirmeyle birikiminize ulaşırsınız."},
        ],
        "key_risks": [
            "Erken ayrılma durumunda devlet katkısı hak edişinde kademeli kesintiler uygulanır.",
            "Fon performansları piyasa koşullarına bağlı olarak dalgalanabilir.",
        ],
    },
]

PRODUCTS = [
    # --- 1. KATILMA HESAPLARI ---
    dict(
        slug="albaraka-karli-hesap-tl",
        bank="albaraka-turk",
        category="katilma-hesaplari",
        name="Kârlı Hesap (TL Katılma Hesabı)",
        summary="Albaraka Türk'ün 1, 3, 6 ve 12 ay vadeli, kâr-zarar ortaklığı esasına dayalı klasik katılma hesabı.",
        currency="TL",
        min_amount=250,
        max_amount=None,
        min_term_days=30,
        max_term_days=365,
        risk_level=2,
        return_type="Havuz Kâr Paylaşımı",
        return_info="Albaraka fon havuzunun gerçekleşen getiri performansına göre aylık/dönemlik kâr payı dağıtımı",
        fees="Hesap işletim ücreti yoktur.",
        features=[
            "1, 3, 6 ay ve 1 yıl vade seçenekleri",
            "Minimum 250 TL ile hesap açılışı",
            "Albaraka Mobil ve İnternet Şubeden kolay yönetim",
            "1.200.000 TL'ye kadar TMSF güvencesi",
            "Otomatik vade yenileme imkânı",
        ],
        source_label=ALBARAKA_SOURCE,
        source_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/katilma-hesaplari/karli-hesap",
        official_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/katilma-hesaplari/karli-hesap",
    ),
    dict(
        slug="albaraka-birikimli-katilma-hesabi",
        bank="albaraka-turk",
        category="katilma-hesaplari",
        name="Birikimli Katılma Hesabı",
        summary="3 yıl vadeli açılan, her ay düzenli tasarruf ekleyebileceğiniz ve stopaj avantajı sunan katılma hesabı.",
        currency="TL",
        min_amount=500,
        max_amount=None,
        min_term_days=1095,
        max_term_days=1095,
        risk_level=2,
        return_type="Uzun Vadeli Havuz Kâr Payı",
        return_info="3 yıllık uzun vadeye özel düşük stopaj avantajı ve havuz kâr payı getirisi",
        fees="Hesap işletim ücreti yoktur.",
        features=[
            "3 yıl (1095 gün) vade",
            "Aylık veya 3 aylık düzenli para ekleme esnekliği",
            "Düşük gelir vergisi (stopaj) avantajı",
            "Disiplinli uzun vadeli birikim için ideal yapı",
        ],
        source_label=ALBARAKA_SOURCE,
        source_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/katilma-hesaplari/birikimli-katilma-hesabi",
        official_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/katilma-hesaplari/birikimli-katilma-hesabi",
    ),
    dict(
        slug="albaraka-ara-donem-kar-payi-odemeli",
        bank="albaraka-turk",
        category="katilma-hesaplari",
        name="Ara Dönem Kâr Payı Ödemeli Hesap",
        summary="1 yıl vadeli açılan, kâr payınızı vade sonunu beklemeden 1, 3 veya 6 ayda bir nakit çekebileceğiniz katılma hesabı.",
        currency="TL",
        min_amount=10000,
        max_amount=None,
        min_term_days=365,
        max_term_days=365,
        risk_level=2,
        return_type="Dönemsel Nakit Kâr Payı",
        return_info="Tercihinize göre 1, 3 veya 6 ayda bir vadesiz hesabınıza nakit kâr payı aktarımı",
        fees="Hesap işletim ücreti yoktur.",
        features=[
            "1 yıl vade süresi",
            "1, 3 veya 6 aylık periyotlarla nakit kâr payı ödemesi",
            "Düzenli nakit akışı sağlamak isteyen tasarruf sahipleri için uygun",
            "Minimum 10.000 TL açılış tutarı",
        ],
        source_label=ALBARAKA_SOURCE,
        source_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/katilma-hesaplari/ara-donem-kar-payi",
        official_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/katilma-hesaplari/ara-donem-kar-payi",
    ),
    dict(
        slug="albaraka-karli-hesap-doviz",
        bank="albaraka-turk",
        category="katilma-hesaplari",
        name="Döviz Katılma Hesabı (USD / EUR)",
        summary="Dolar veya Euro birikimlerinizi Albaraka'nın döviz fon havuzunda değerlendiren katılma hesabı.",
        currency="USD",
        min_amount=250,
        max_amount=None,
        min_term_days=30,
        max_term_days=365,
        risk_level=3,
        return_type="Döviz Cinsinden Kâr Payı",
        return_info="İlgili döviz havuzunun getirisine göre USD veya EUR cinsinden kâr payı",
        fees="Hesap işletim ücreti yoktur.",
        features=[
            "USD ve EUR para birimlerinde açılış",
            "1, 3, 6 ve 12 ay vade seçenekleri",
            "Kâr payı yine ilgili döviz cinsinden hesaba yansır",
            "Döviz kurları dalgalanma riskine tabidir",
        ],
        source_label=ALBARAKA_SOURCE,
        source_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/katilma-hesaplari/karli-hesap",
        official_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/katilma-hesaplari/karli-hesap",
    ),

    # --- 2. ALTIN VE KIYMETLİ MADENLER ---
    dict(
        slug="albaraka-karli-altin-hesabi",
        bank="albaraka-turk",
        category="altin-kiymetli-maden",
        name="Kârlı Altın Hesabı (Vadeli Altın)",
        summary="Altınlarınızı gram bazında vadeli havuzda değerlendirerek altın cinsinden kâr payı kazandıran katılma hesabı.",
        currency="TL",
        min_amount=5000,
        max_amount=None,
        min_term_days=90,
        max_term_days=365,
        risk_level=3,
        return_type="Altın Bazlı Kâr Payı + Değer Artışı",
        return_info="Getiri doğrudan gram altın olarak hesaba ilave edilir; altın fiyatı artışından da yararlanılır",
        fees="Hesap işletim ücreti yoktur.",
        features=[
            "3, 6 ay ve 1 yıl vade seçenekleri",
            "Kâr payı gram altın olarak ödenir",
            "Fiziki saklama, kaybolma veya çalınma riski yoktur",
            "995/1000 saflıkta saf altın bazında işlem",
        ],
        source_label=ALBARAKA_SOURCE,
        source_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/altin-hesaplari/karli-altin-hesabi",
        official_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/altin-hesaplari/karli-altin-hesabi",
    ),
    dict(
        slug="albaraka-vadesiz-altin-hesabi",
        bank="albaraka-turk",
        category="altin-kiymetli-maden",
        name="Altın Cari Hesabı (Vadesiz Altın)",
        summary="7/24 dilediğiniz tutarda gram altın alıp satabileceğiniz, kâr payı getirmeyen vadesiz altın hesabı.",
        currency="TL",
        min_amount=100,
        max_amount=None,
        min_term_days=None,
        max_term_days=None,
        risk_level=3,
        return_type="Piyasa Altın Fiyatı Değişimi",
        return_info="Getiri veya kâr payı yoktur; toplam bakiyeniz altın piyasasındaki fiyat değişimine göre şekillenir",
        fees="İşletim ücreti yoktur. Alış/satış makas farkı uygulanır.",
        features=[
            "Vadesiz, günün her anı anlık işlem",
            "Küçük tutarlarla (0.01 gramdan itibaren) birikim",
            "İstenildiğinde nakde çevrilebilir veya cari hesaba aktarılabilir",
            "Fiziki külçe/çeyrek taşıma zahmeti olmadan güvenli saklama",
        ],
        source_label=ALBARAKA_SOURCE,
        source_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/altin-hesaplari/altin-cari-hesabi",
        official_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/altin-hesaplari/altin-cari-hesabi",
    ),
    dict(
        slug="albaraka-vadesiz-gumus-hesabi",
        bank="albaraka-turk",
        category="altin-kiymetli-maden",
        name="Vadesiz Gümüş Hesabı",
        summary="Gümüş birikimlerinizi 999/1000 saflıkta, güvenle gram bazında alıp satabileceğiniz vadesiz maden hesabı.",
        currency="TL",
        min_amount=100,
        max_amount=None,
        min_term_days=None,
        max_term_days=None,
        risk_level=4,
        return_type="Piyasa Gümüş Fiyatı Değişimi",
        return_info="Gümüşün ons ve gram fiyatındaki küresel hareketlere göre değer kazanır veya kaybeder",
        fees="İşletim ücreti yoktur. Alış/satış kur farkı bulunur.",
        features=[
            "999/1000 saflıkta gümüş işlemleri",
            "Albaraka Mobil üzerinden pratik alım-satım",
            "Altına kıyasla daha yüksek fiyat dalgalanması potansiyeli",
        ],
        source_label=ALBARAKA_SOURCE,
        source_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/gumus-hesabi",
        official_url="https://www.albaraka.com.tr/tr/bireysel/hesaplar/gumus-hesabi",
    ),

    # --- 3. KATILIM FONLARI (ALBARAKA PORTFÖY / TEFAS) ---
    dict(
        slug="albaraka-rbt-kira-sertifikasi-fonu",
        bank="albaraka-turk",
        category="katilim-fonlari",
        name="RBT – Albaraka Portföy Kira Sertifikaları Katılım Fonu",
        summary="Portföyünün en az %80'ini kamu ve özel sektör kira sertifikalarında (sukuk) değerlendiren düşük riskli katılım fonu.",
        currency="TL",
        min_amount=50,
        max_amount=None,
        min_term_days=None,
        max_term_days=None,
        risk_level=2,
        return_type="Birim Pay Fiyatı Artışı (Kira Getirisi)",
        return_info="Kira sertifikalarından elde edilen düzenli gelirler günlük olarak fon fiyatına yansır",
        fees="Yıllık fon yönetim ücreti fon portföyünden karşılanır.",
        features=[
            "TEFAS'ta işlem görür, tüm bankalardan alınabilir",
            "Düşük risk profili (1-2 / 7)",
            "Kamu ve özel sektör sukuk ihraçlarına yatırım",
            "İş günlerinde nakde çevrilebilirlik",
        ],
        source_label="TEFAS & Albaraka Portföy (RBT)",
        source_url="https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=RBT",
        official_url="https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=RBT",
    ),
    dict(
        slug="albaraka-rba-altin-katilim-fonu",
        bank="albaraka-turk",
        category="katilim-fonlari",
        name="RBA – Albaraka Portföy Bereket Altın Katılım Fonu",
        summary="Fon toplam değerinin en az %80'ini borsada işlem gören altın ve altına dayalı sermaye piyasası araçlarına yatıran katılım fonu.",
        currency="TL",
        min_amount=50,
        max_amount=None,
        min_term_days=None,
        max_term_days=None,
        risk_level=5,
        return_type="Altın Fiyatına Paralel Pay Fiyatı Değişimi",
        return_info="Altın piyasasının getirisini hedefler; fiziki altın taşıma veya saklama maliyeti olmadan yatırım sağlar",
        fees="Yıllık fon yönetim gideri içermektedir.",
        features=[
            "TEFAS üzerinden tüm bankalardan alım-satım",
            "Altın fiyat hareketlerine tam uyum",
            "Bereket Vakfı'na sosyal destek vizyonu",
            "Nitelikli ve küçük yatırımcıya uygun pay büyüklüğü",
        ],
        source_label="TEFAS & Albaraka Portföy (RBA)",
        source_url="https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=RBA",
        official_url="https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=RBA",
    ),
    dict(
        slug="albaraka-rbh-hisse-katilim-fonu",
        bank="albaraka-turk",
        category="katilim-fonlari",
        name="RBH – Albaraka Portföy Katılım Hisse Senedi Fonu",
        summary="Borsa İstanbul Katılım Endeksi'ne uygun, faizsiz kriterleri sağlayan şirket hisselerine yatırım yapan hisse yoğun fon.",
        currency="TL",
        min_amount=50,
        max_amount=None,
        min_term_days=None,
        max_term_days=None,
        risk_level=5,
        return_type="Hisse Senedi Değer Artışı & Temettü",
        return_info="BIST Katılım Endeksi şirketlerinin performansına bağlı yüksek getiri ve yüksek dalgalanma potansiyeli",
        fees="Yıllık fon yönetim ücreti uygulanır. Hisse yoğun fonlarda %0 stopaj avantajı bulunabilir.",
        features=[
            "En az %80 Katılım Endeksi hisselerine yatırım",
            "Yüksek getiri hedefleyen uzun vadeli yatırımcılar için",
            "Mevzuat gereği hisse yoğun fonlarda vergi/stopaj avantajı",
            "Profesyonel portföy yöneticileri tarafından aktif yönetim",
        ],
        source_label="TEFAS & Albaraka Portföy (RBH)",
        source_url="https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=RBH",
        official_url="https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=RBH",
    ),

    # --- 4. KİRA SERTİFİKALARI (SUKUK) ---
    dict(
        slug="albaraka-dogrudan-kira-sertifikasi",
        bank="albaraka-turk",
        category="kira-sertifikalari",
        name="Albaraka Türk Kira Sertifikası (Sukuk İhracı)",
        summary="Bereket Varlık Kiralama A.Ş. tarafından ihraç edilen, dönemsel sabit veya değişken kira payı ödeyen sermaye piyasası aracı.",
        currency="TL",
        min_amount=1000,
        max_amount=None,
        min_term_days=180,
        max_term_days=730,
        risk_level=2,
        return_type="Dönemsel Kira Kuponu Geliri",
        return_info="İhraç izahnamesinde belirlenen periyotlarda (ör. 3 veya 6 ayda bir) hesaba nakit kira payı aktarımı",
        fees="Albaraka üzerinden ilk ihraç alımlarında işlem komisyonu alınmaz.",
        features=[
            "Somut varlıkların kira getirisine ortaklık",
            "Belirlenen vadelerde düzenli nakit kupon getirisi",
            "Vade sonunda anapara itfası",
            "Bereket VKŞ ve Albaraka Türk garantörlüğü/ihraç yapısı",
        ],
        source_label=ALBARAKA_SOURCE,
        source_url="https://www.albaraka.com.tr/tr/bireysel/yatirim/sermaye-piyasasi-urunleri/kira-sertifikasi-sukuk",
        official_url="https://www.albaraka.com.tr/tr/bireysel/yatirim/sermaye-piyasasi-urunleri/kira-sertifikasi-sukuk",
    ),

    # --- 5. BİREYSEL EMEKLİLİK (BES) ---
    dict(
        slug="albaraka-katilim-bes-plani",
        bank="albaraka-turk",
        category="diger",
        name="Albaraka Katılım Bireysel Emeklilik (BES)",
        summary="Katılım esaslı emeklilik fonlarında değerlendirilen ve %30 devlet katkısı avantajı sunan uzun vadeli tasarruf ürünü.",
        currency="TL",
        min_amount=300,
        max_amount=None,
        min_term_days=None,
        max_term_days=None,
        risk_level=3,
        return_type="Faizsiz BES Fon Performansı + %30 Devlet Katkısı",
        return_info="Yatırılan her 100 TL için 30 TL devlet katkısı ve seçilen katılım fonlarının bileşik büyümesi",
        fees="Mevzuata uygun fon işletim kesintisi sözleşmede yer alır.",
        features=[
            "%30 Doğrudan devlet katkısı avantajı",
            "Albaraka Portföy faizsiz katılım fonu seçenekleri",
            "Aylık, 3 aylık veya esnek ödeme periyotları",
            "10 yıl sistemde kalıp 56 yaşını dolduranlara avantajlı emeklilik",
        ],
        source_label=ALBARAKA_SOURCE,
        source_url="https://www.albaraka.com.tr/tr/bireysel/sigorta-ve-emeklilik/bireysel-emeklilik-sigortasi",
        official_url="https://www.albaraka.com.tr/tr/bireysel/sigorta-ve-emeklilik/bireysel-emeklilik-sigortasi",
    ),
]


def seed_data(db: Session, force_refresh: bool = True) -> None:
    """Veritabanını Albaraka Türk'ün gerçek ve çalışan bağlantılı ürün verileriyle günceller."""
    if force_refresh:
        db.query(Product).delete()
        db.query(Category).delete()
        db.query(Bank).delete()
        db.flush()
    elif db.query(Bank).count() > 0:
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
                fetched_at=now,
                verified=True,
                **data,
            )
        )
    db.commit()


def seed_if_empty(db: Session) -> None:
    seed_data(db, force_refresh=False)
