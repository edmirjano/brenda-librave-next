'use client';

import {
  BookTitle, BookSubtitle, BookDescription, Quote,
  PageTitle, SectionTitle, CardTitle, BodyText, Caption,
  NavText, ButtonText, PriceText, AlbanianText
} from '@/components/ui/Typography';

interface TypographyDemoPageClientProps {
  translations: any;
}

export function TypographyDemoPageClient({ translations }: TypographyDemoPageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <PageTitle>{translations('hero.title')}</PageTitle>
          <BodyText className="text-lg">
            {translations('hero.subtitle')}
          </BodyText>
        </div>

        {/* Book Content Section */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
          <SectionTitle className="text-center mb-8">{translations('literarySection.title')}</SectionTitle>
          
          <BookTitle>{translations('book.title')}</BookTitle>
          <BookSubtitle>{translations('book.subtitle')}</BookSubtitle>
          
          <BookDescription>
            {translations('book.description')}
          </BookDescription>

          <Quote>
            {translations('book.quote')}
          </Quote>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <CardTitle className="font-serif">{translations('book.features.title')}</CardTitle>
              <ul className="space-y-2">
                {translations('book.features.items').map((item: string, index: number) => (
                  <li key={index}><AlbanianText>• {item}</AlbanianText></li>
                ))}
              </ul>
            </div>
            <div>
              <CardTitle className="font-serif">{translations('book.details.title')}</CardTitle>
              <Caption>{translations('book.details.firstEdition')}</Caption>
              <Caption>{translations('book.details.publisher')}</Caption>
              <Caption>{translations('book.details.isbn')}</Caption>
              <PriceText className="text-2xl mt-4">{translations('book.details.price')}</PriceText>
              <Caption className="text-green-600">{translations('book.details.inStock')}</Caption>
            </div>
          </div>
        </section>

        {/* Interface Elements Section */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
          <SectionTitle className="text-center mb-8">{translations('interfaceSection.title')}</SectionTitle>
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Navigation Demo */}
            <div className="space-y-4">
              <CardTitle>{translations('interface.navigation.title')}</CardTitle>
              <nav className="space-y-2">
                {translations('interface.navigation.items').map((item: string, index: number) => (
                  <div key={index} className={`p-3 ${index === 0 ? 'bg-albanian-red/10' : 'hover:bg-gray-100'} rounded-lg ${index > 0 ? 'cursor-pointer' : ''}`}>
                    <NavText className={index === 0 ? 'text-albanian-red' : ''}>{item}</NavText>
                  </div>
                ))}
              </nav>
            </div>

            {/* Buttons Demo */}
            <div className="space-y-4">
              <CardTitle>{translations('interface.buttons.title')}</CardTitle>
              <div className="space-y-3">
                {translations('interface.buttons.items').map((button: any, index: number) => (
                  <button 
                    key={index}
                    className={`w-full py-3 px-6 rounded-lg transition-colors ${
                      button.variant === 'primary' 
                        ? 'bg-albanian-red text-white hover:bg-albanian-red-dark' 
                        : button.variant === 'secondary'
                        ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'text-albanian-red hover:bg-albanian-red/5'
                    }`}
                  >
                    <ButtonText>{button.text}</ButtonText>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Scale Demo */}
            <div className="space-y-4">
              <CardTitle>{translations('interface.typography.title')}</CardTitle>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{translations('interface.typography.h1')}</h1>
                <h2 className="text-xl font-semibold">{translations('interface.typography.h2')}</h2>
                <h3 className="text-lg font-medium">{translations('interface.typography.h3')}</h3>
                <p className="text-base">{translations('interface.typography.body')}</p>
                <p className="text-sm text-gray-600">{translations('interface.typography.caption')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Example Section */}
        <section className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-sans font-semibold mb-6 text-center">
            {translations('usageExample.title')}
          </h2>
          
          <article className="max-w-2xl mx-auto">
            <h1 className="font-serif text-4xl font-bold mb-4 text-center">
              {translations('usageExample.article.title')}
            </h1>
            
            <h2 className="font-serif text-2xl font-medium mb-6 text-center text-gray-600">
              {translations('usageExample.article.subtitle')}
            </h2>
            
            <div className="space-y-4">
              <p className="font-serif text-base leading-relaxed">
                {translations('usageExample.article.content')}
              </p>
              
              <blockquote className="font-serif text-lg italic text-gray-700 border-l-4 border-red-500 pl-6 my-6">
                {translations('usageExample.article.blockquote')}
              </blockquote>
              
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-sans text-lg font-semibold mb-2">{translations('usageExample.features.title')}</h3>
                <ul className="font-sans text-sm space-y-1">
                  {translations('usageExample.features.items').map((feature: string, index: number) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
} 