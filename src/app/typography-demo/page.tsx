import { getTranslations } from 'next-intl/server';
import { TypographyDemoPageClient } from '@/components/pages/TypographyDemoPageClient';

export default async function TypographyDemo() {
  const t = await getTranslations('typography');
  
  return <TypographyDemoPageClient translations={t} />;
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <PageTitle>Brënda Librave - Typography Demo</PageTitle>
          <BodyText className="text-lg">
            Showcase of our dual-font system with Albanian content
          </BodyText>
        </div>

        {/* Book Content Section */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
          <SectionTitle className="text-center mb-8">Literary Content (Crimson Pro)</SectionTitle>
          
          <BookTitle>Gjuha Shqipe në Letërsinë Bashkëkohore</BookTitle>
          <BookSubtitle>Një studim i thellë mbi evolucionin e gjuhës</BookSubtitle>
          
          <BookDescription>
            Ky libër eksploron zhvillimin e gjuhës shqipe në letërsinë e shekullit të 21-të, 
            duke analizuar ndikimin e teknologjisë dhe globalizimit në shprehjen letrare. 
            Autorja na prezanton një perspektivë të re mbi ruajtjen e identitetit kulturor 
            përmes gjuhës së shkruar.
          </BookDescription>

          <Quote>
            "Gjuha është pasuria më e madhe e një kombi, dhe letërsia është tempulli 
            ku kjo pasuri ruhet dhe përtërihet." - Naim Frashëri
          </Quote>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <CardTitle className="font-serif">Karakteristikat</CardTitle>
              <ul className="space-y-2">
                <li><AlbanianText>• Analiza e thellë gjuhësore</AlbanianText></li>
                <li><AlbanianText>• Shembuj nga autorë të njohur</AlbanianText></li>
                <li><AlbanianText>• Perspektiva moderne</AlbanianText></li>
                <li><AlbanianText>• 350 faqe përmbajtje</AlbanianText></li>
              </ul>
            </div>
            <div>
              <CardTitle className="font-serif">Detaje Teknike</CardTitle>
              <Caption>Botimi i parë: 2024</Caption>
              <Caption>Shtëpia botuese: Librat Shqiptarë</Caption>
              <Caption>ISBN: 978-9928-000-000-0</Caption>
              <PriceText className="text-2xl mt-4">2,500 L</PriceText>
              <Caption className="text-green-600">Në stok</Caption>
            </div>
          </div>
        </section>

        {/* Interface Elements Section */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
          <SectionTitle className="text-center mb-8">Interface Elements (Outfit)</SectionTitle>
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Navigation Demo */}
            <div className="space-y-4">
              <CardTitle>Navigation</CardTitle>
              <nav className="space-y-2">
                <div className="p-3 bg-albanian-red/10 rounded-lg">
                  <NavText className="text-albanian-red">Kryefaqja</NavText>
                </div>
                <div className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <NavText>Librat</NavText>
                </div>
                <div className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <NavText>Kategorite</NavText>
                </div>
                <div className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <NavText>Rreth Nesh</NavText>
                </div>
              </nav>
            </div>

            {/* Buttons Demo */}
            <div className="space-y-4">
              <CardTitle>Buttons</CardTitle>
              <div className="space-y-3">
                <button className="w-full py-3 px-6 bg-albanian-red text-white rounded-lg hover:bg-albanian-red-dark transition-colors">
                  <ButtonText>Blej Tani</ButtonText>
                </button>
                <button className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <ButtonText>Shto në Shportë</ButtonText>
                </button>
                <button className="w-full py-3 px-6 text-albanian-red hover:bg-albanian-red/5 rounded-lg transition-colors">
                  <ButtonText>Lista e Dëshirave</ButtonText>
                </button>
              </div>
            </div>

            {/* Content Cards Demo */}
            <div className="space-y-4">
              <CardTitle>Content Cards</CardTitle>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <CardTitle className="text-base mb-2">Drita e Artë</CardTitle>
                <BodyText className="text-sm mb-3">
                  Roman historik nga Gjergj Fishta që përshkruan...
                </BodyText>
                <div className="flex justify-between items-center">
                  <PriceText className="text-lg">1,800 L</PriceText>
                  <Caption className="text-green-600">Në stok</Caption>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Samples */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
          <SectionTitle className="text-center mb-8">Font Specimens</SectionTitle>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Crimson Pro Specimen */}
            <div>
              <h3 className="font-sans text-lg font-semibold mb-4 text-center">
                Crimson Pro (Literary)
              </h3>
              <div className="space-y-3 p-6 bg-amber-50 rounded-lg">
                <p className="font-serif text-xs">Aa Bb Cc Dd Ee Ëë Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz Çç</p>
                <p className="font-serif text-sm">The quick brown fox jumps over the lazy dog</p>
                <p className="font-serif text-base">Një zog i vogël këndonte në pemë</p>
                <p className="font-serif text-lg">Albanian Literature Collection</p>
                <p className="font-serif text-xl font-bold">Koleksioni i Letërsisë Shqiptare</p>
              </div>
            </div>

            {/* Outfit Specimen */}
            <div>
              <h3 className="font-sans text-lg font-semibold mb-4 text-center">
                Outfit (Interface)
              </h3>
              <div className="space-y-3 p-6 bg-blue-50 rounded-lg">
                <p className="font-sans text-xs">Aa Bb Cc Dd Ee Ëë Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz Çç</p>
                <p className="font-sans text-sm">The quick brown fox jumps over the lazy dog</p>
                <p className="font-sans text-base">Një zog i vogël këndonte në pemë</p>
                <p className="font-sans text-lg">Modern Interface Design</p>
                <p className="font-sans text-xl font-bold">Dizajn Modern i Ndërfaqes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8">
          <Caption>
            Typography system for Brënda Librave - Combining literary elegance with modern interface design
          </Caption>
        </footer>

      </div>
    </div>
  );
}
