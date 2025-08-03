# Brënda Librave - Typography System

## Font Strategy

Our dual-font system creates a perfect balance between literary elegance and modern interface design:

### **Crimson Pro (Literary Font)**
- **Use for**: Book titles, descriptions, quotes, literary content, Albanian text
- **Why**: Designed for reading, excellent Albanian character support, elegant serif
- **Classes**: `font-serif`

### **Outfit (Interface Font)**  
- **Use for**: Navigation, buttons, UI elements, modern sections, prices
- **Why**: Clean, modern, premium feel, great for mobile interfaces
- **Classes**: `font-sans`

## Typography Components

Import and use our pre-built typography components:

```typescript
import {
  BookTitle, BookSubtitle, BookDescription, Quote,
  PageTitle, SectionTitle, CardTitle, BodyText, Caption,
  NavText, ButtonText, PriceText, AlbanianText
} from '@/components/ui/Typography';
```

## Usage Examples

### Book Content Page
```tsx
<BookTitle>Gjuha Shqipe në Letërsinë Bashkëkohore</BookTitle>
<BookSubtitle>Një studim i thellë mbi evolucionin e gjuhës</BookSubtitle>
<BookDescription>
  Ky libër eksploron zhvillimin e gjuhës shqipe në letërsinë e shekullit të 21-të...
</BookDescription>
<Quote>
  "Gjuha është pasuria më e madhe e një kombi." - Naim Frashëri
</Quote>
```

### Interface Elements
```tsx
<PageTitle>Brënda Librave</PageTitle>
<SectionTitle>Librat më të Shitur</SectionTitle>
<CardTitle>Drita e Artë</CardTitle>
<BodyText>Përshkrimi i shkurtër i librit...</BodyText>
<PriceText>2,500 L</PriceText>
```

### Navigation
```tsx
<NavText>Kryefaqja</NavText>
<ButtonText>Blej Tani</ButtonText>
```

## Font Weights Available

### Crimson Pro (font-serif)
- `font-light` (300)
- `font-normal` (400) 
- `font-medium` (500)
- `font-semibold` (600)
- `font-bold` (700)
- `font-extrabold` (800)

### Outfit (font-sans)
- `font-thin` (100)
- `font-extralight` (200)
- `font-light` (300)
- `font-normal` (400)
- `font-medium` (500)
- `font-semibold` (600)
- `font-bold` (700)
- `font-extrabold` (800)
- `font-black` (900)

## Albanian Character Support

Both fonts fully support Albanian characters:
- Ë, ë (schwa)
- Ç, ç (c-cedilla)
- Proper diacritical marks
- Albanian punctuation

## Performance Considerations

- Fonts are loaded with `display=swap` for better performance
- Critical text uses font fallbacks (Georgia for serif, system fonts for sans)
- Font files are cached by Google Fonts CDN

## Mobile Optimization

- Responsive font sizes using Tailwind's responsive prefixes
- Touch-friendly text sizing (minimum 16px on mobile)
- Proper line heights for readability on small screens

## Accessibility

- High contrast ratios maintained
- Readable font sizes across all devices
- Proper semantic HTML structure
- Font feature settings for enhanced legibility

## Brand Consistency

This typography system ensures:
- **Literary Heritage**: Crimson Pro honors the bookish nature
- **Modern Interface**: Outfit provides clean, contemporary UI
- **Albanian Identity**: Proper character support and cultural respect
- **Premium Feel**: Both fonts convey quality and sophistication
- **Apple Liquid Glass**: Clean, modern aesthetic alignment
