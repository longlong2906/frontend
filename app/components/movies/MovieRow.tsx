"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  vote_average: number;
  weighted_rating: number;
  overview: string;
  poster_path?: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllLink?: string;
}

export default function MovieRow({ title, movies, viewAllLink }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      // ... (rest of logic) ...
      // (I will replace the top part and Header render)
      // Need to match StartLine carefully.
      // Original StartLine 1.
      // I will target up to the return statement.

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 5;

      setShowLeftArrow(canScrollLeft);
      setShowRightArrow(canScrollRight);
    }
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      // Kiểm tra lại sau khi scroll (smooth scroll cần delay)
      setTimeout(() => {
        checkScrollButtons();
      }, 100);
    }
  }, [checkScrollButtons]);

  const handleScroll = useCallback(() => {
    // Gọi ngay lập tức
    checkScrollButtons();
    // Và gọi lại sau một chút để đảm bảo
    requestAnimationFrame(() => {
      checkScrollButtons();
    });
  }, [checkScrollButtons]);

  // Kiểm tra ban đầu và khi resize
  useEffect(() => {
    // Delay để đảm bảo DOM đã render và images đã load
    const timer1 = setTimeout(() => checkScrollButtons(), 100);
    const timer2 = setTimeout(() => checkScrollButtons(), 500);
    const timer3 = setTimeout(() => checkScrollButtons(), 1000);
    const timer4 = setTimeout(() => checkScrollButtons(), 1500);

    const handleResize = () => {
      setTimeout(() => checkScrollButtons(), 100);
    };

    window.addEventListener('resize', handleResize);

    // Sử dụng MutationObserver để theo dõi khi content thay đổi
    const observer = new MutationObserver(() => {
      setTimeout(() => checkScrollButtons(), 100);
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [movies, checkScrollButtons]);

  return (
    <div className="mb-8 px-6 group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 px-3 py-1.5 rounded-full transition-all border border-zinc-700 hover:border-zinc-500"
          >
            <span>Xem toàn bộ</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-50 w-16 bg-gradient-to-r from-black/90 via-black/70 to-transparent flex items-center justify-center hover:from-black hover:via-black/90 transition-all duration-300 group/btn"
            aria-label="Scroll left"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover/btn:bg-white/30 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}

        {/* Movies Grid */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-50 w-16 bg-gradient-to-l from-black/90 via-black/70 to-transparent flex items-center justify-center hover:from-black hover:via-black/90 transition-all duration-300 group/btn"
            aria-label="Scroll right"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover/btn:bg-white/30 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

