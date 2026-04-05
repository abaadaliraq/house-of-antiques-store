'use client'

import { useEffect, useRef, useState } from 'react'

const slides = [
  '/cover1.jpg',
  '/cover2.jpg',
  '/cover3.jpg',
  '/cover4.jpg',
]

const AUTO_DELAY = 3500

export default function StoreHero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<number | null>(null)

  function startAutoSlide() {
    stopAutoSlide()

    intervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, AUTO_DELAY)
  }

  function stopAutoSlide() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function goToSlide(index: number) {
    setActiveIndex(index)
    startAutoSlide()
  }

  useEffect(() => {
    startAutoSlide()
    return () => stopAutoSlide()
  }, [])

  return (
    <section className="store-hero">
      <div
        className="store-hero__slider"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        <div
          className="store-hero__track"
          style={{
            transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
          }}
        >
          {slides.map((src, index) => (
            <div className="store-hero__slide" key={index}>
              <div
                className="store-hero__image"
                style={{ backgroundImage: `url(${src})` }}
              />
            </div>
          ))}
        </div>

        <div className="store-hero__overlay" />

        <div className="store-hero__content fade-up">
  <>
  <div className="store-hero__sub">
    House of Antiques - بيت التحفيات
  </div>
  <h1 className="store-hero__title">ANTIQUE STORE</h1>
</>
</div>

        <div className="store-hero__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={
                activeIndex === index
                  ? 'store-hero__dot is-active'
                  : 'store-hero__dot'
              }
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}