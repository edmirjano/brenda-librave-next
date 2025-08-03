export default function FontTest() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <h1 className="text-3xl font-sans font-bold text-center mb-12">
          Local Font Loading Test
        </h1>

        {/* Crimson Pro Test */}
        <section>
          <h2 className="text-2xl font-sans font-semibold mb-6 text-center">
            Crimson Pro (Literary Font)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regular Weights */}
            <div className="space-y-4">
              <h3 className="text-lg font-sans font-medium mb-4">Regular Weights</h3>
              
              <div className="space-y-3">
                <p className="font-serif font-extralight text-lg">
                  ExtraLight (200) - Të gjitha gjërat e bukura janë të vështira
                </p>
                <p className="font-serif font-light text-lg">
                  Light (300) - Të gjitha gjërat e bukura janë të vështira
                </p>
                <p className="font-serif font-normal text-lg">
                  Regular (400) - Të gjitha gjërat e bukura janë të vështira
                </p>
                <p className="font-serif font-medium text-lg">
                  Medium (500) - Të gjitha gjërat e bukura janë të vështira
                </p>
                <p className="font-serif font-semibold text-lg">
                  SemiBold (600) - Të gjitha gjërat e bukura janë të vështira
                </p>
                <p className="font-serif font-bold text-lg">
                  Bold (700) - Të gjitha gjërat e bukura janë të vështira
                </p>
                <p className="font-serif font-extrabold text-lg">
                  ExtraBold (800) - Të gjitha gjërat e bukura janë të vështira
                </p>
              </div>
            </div>

            {/* Italic Weights */}
            <div className="space-y-4">
              <h3 className="text-lg font-sans font-medium mb-4">Italic Weights</h3>
              
              <div className="space-y-3">
                <p className="font-serif font-extralight italic text-lg">
                  ExtraLight Italic (200) - Një gjuhë, një komb
                </p>
                <p className="font-serif font-light italic text-lg">
                  Light Italic (300) - Një gjuhë, një komb
                </p>
                <p className="font-serif font-normal italic text-lg">
                  Regular Italic (400) - Një gjuhë, një komb
                </p>
                <p className="font-serif font-medium italic text-lg">
                  Medium Italic (500) - Një gjuhë, një komb
                </p>
                <p className="font-serif font-semibold italic text-lg">
                  SemiBold Italic (600) - Një gjuhë, një komb
                </p>
                <p className="font-serif font-bold italic text-lg">
                  Bold Italic (700) - Një gjuhë, një komb
                </p>
                <p className="font-serif font-extrabold italic text-lg">
                  ExtraBold Italic (800) - Një gjuhë, një komb
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Outfit Test */}
        <section>
          <h2 className="text-2xl font-sans font-semibold mb-6 text-center">
            Outfit (Interface Font)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <p className="font-sans font-thin text-lg">
                Thin (100) - Brënda Librave
              </p>
              <p className="font-sans font-extralight text-lg">
                ExtraLight (200) - Brënda Librave
              </p>
              <p className="font-sans font-light text-lg">
                Light (300) - Brënda Librave
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="font-sans font-normal text-lg">
                Regular (400) - Brënda Librave
              </p>
              <p className="font-sans font-medium text-lg">
                Medium (500) - Brënda Librave
              </p>
              <p className="font-sans font-semibold text-lg">
                SemiBold (600) - Brënda Librave
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="font-sans font-bold text-lg">
                Bold (700) - Brënda Librave
              </p>
              <p className="font-sans font-extrabold text-lg">
                ExtraBold (800) - Brënda Librave
              </p>
              <p className="font-sans font-black text-lg">
                Black (900) - Brënda Librave
              </p>
            </div>
          </div>
        </section>

        {/* Special Characters Test */}
        <section>
          <h2 className="text-2xl font-sans font-semibold mb-6 text-center">
            Albanian Character Support Test
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center p-6 bg-amber-50 rounded-lg">
              <h3 className="text-lg font-sans font-medium mb-4">Crimson Pro</h3>
              <p className="font-serif text-2xl mb-4">
                Ë ë Ç ç À à È è Ì ì Ò ò Ù ù
              </p>
              <p className="font-serif text-lg">
                "Çdo gjë ka fillimin e vet, por ëndrrat nuk kanë fund." 
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-sans font-medium mb-4">Outfit</h3>
              <p className="font-sans text-2xl mb-4">
                Ë ë Ç ç À à È è Ì ì Ò ò Ù ù
              </p>
              <p className="font-sans text-lg">
                "Çdo gjë ka fillimin e vet, por ëndrrat nuk kanë fund."
              </p>
            </div>
          </div>
        </section>

        {/* Mixed Usage Example */}
        <section className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-sans font-semibold mb-6 text-center">
            Real Usage Example
          </h2>
          
          <article className="max-w-2xl mx-auto">
            <h1 className="font-serif text-4xl font-bold mb-4 text-center">
              Historia e Gjuhës Shqipe
            </h1>
            
            <h2 className="font-serif text-2xl font-medium mb-6 text-center text-gray-600">
              Një udhëtim nëpër kohë dhe kulturë
            </h2>
            
            <div className="space-y-4">
              <p className="font-serif text-base leading-relaxed">
                Gjuha shqipe është një nga gjuhët më të vjetra të Evropës, me rrënjë që shtrihen 
                mijëra vjet prapa. Ajo ka ruajtur karakteristikat e saj të veçanta përgjatë shekujve, 
                pavarësisht ndikimeve të shumta të jashtme.
              </p>
              
              <blockquote className="font-serif text-lg italic text-gray-700 border-l-4 border-red-500 pl-6 my-6">
                "Gjuha jonë na bën të jemi ajo që jemi, dhe ajo që jemi na bën të kemi gjuhën tonë."
              </blockquote>
              
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-sans text-lg font-semibold mb-2">Karakteristikat Kryesore</h3>
                <ul className="font-sans text-sm space-y-1">
                  <li>• Sistemi vokalor me 7 zanore</li>
                  <li>• Alfabeti prej 36 shkronjash</li>
                  <li>• Struktura gramatikore e kompleksuar</li>
                  <li>• Fjalor i pasur me rrënjë autoktone</li>
                </ul>
              </div>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}