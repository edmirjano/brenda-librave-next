import { capitalize, cn, debounce, formatFileSize, slugify, truncate } from '@/lib/utils';

describe('Utility functions', () => {
  describe('cn (class name utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-100', 'hover:text-red-600');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-100');
      expect(result).toContain('hover:text-red-600');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class', !isActive && 'inactive-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
      expect(result).not.toContain('inactive-class');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'other-class');
      expect(result).toContain('base-class');
      expect(result).toContain('other-class');
    });
  });

  describe('slugify', () => {
    it('should create slugs from Albanian text', () => {
      const text = 'Kështjella e Kadaresë';
      const result = slugify(text);
      expect(result).toBe('kshtjella-e-kadares');
    });

    it('should handle special characters', () => {
      const text = 'Libër për fëmijë të vegjël!';
      const result = slugify(text);
      expect(result).toBe('libr-pr-fmij-t-vegjl');
    });

    it('should handle multiple spaces', () => {
      const text = 'Multiple    spaces   here';
      const result = slugify(text);
      expect(result).toBe('multiple-spaces-here');
    });

    it('should handle leading and trailing spaces', () => {
      const text = '  Leading and trailing  ';
      const result = slugify(text);
      expect(result).toBe('leading-and-trailing');
    });

    it('should handle empty strings', () => {
      const result = slugify('');
      expect(result).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('HELLO');
      expect(capitalize('hELLO')).toBe('HELLO');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single characters', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('A')).toBe('A');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncate(text, 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23); // 20 + '...'
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      const result = truncate(text, 20);
      expect(result).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars';
      const result = truncate(text, 20);
      expect(result).toBe('Exactly twenty chars');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1023)).toBe('1023 B');
    });

    it('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    it('should format megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
    });

    it('should format gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });

    it('should reset timer on subsequent calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1');
      jest.advanceTimersByTime(50);
      debouncedFn('arg2');
      jest.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg2');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });
});