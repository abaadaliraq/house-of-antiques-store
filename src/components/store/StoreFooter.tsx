import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Globe,
  MapPin,
} from "lucide-react";

const socialLinks = {
  instagram: "https://www.instagram.com/house_ofantiques?igsh=N3B1NmxkZGhxcTZ1",
  facebook: "https://www.facebook.com/house.of.antiques.iraq",
  whatsapp: "https://wa.me/9647777045599",
  email: "mailto:houseofantique30@gmail.com",
  website: "https://www.houseof-antiques.com/",
  maps: "https://maps.app.goo.gl/Jw3hiXZiLLTuFkEQA",
  phone: "tel:07777045599",
};

export default function StoreFooter() {
  return (
    <footer id="contact" className="store-footer-black">
      <div className="store-footer-black__inner">
        <div className="store-footer-black__top">
          <div className="store-footer-black__brand">
            <div className="store-footer-black__title">House of Antiques</div>
            <div className="store-footer-black__sub">
              Curated heritage, rare objects, and collectible pieces.
            </div>
          </div>

          <div className="store-footer-black__contact">
            <a href={socialLinks.phone} className="store-footer-black__contactItem">
              07777045599
            </a>
            <a href={socialLinks.email} className="store-footer-black__contactItem">
              houseofantique30@gmail.com
            </a>
          </div>
        </div>

        <div className="store-footer-black__socials">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="store-footer-black__icon"
            aria-label="Instagram"
          >
 </a>

          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noreferrer"
            className="store-footer-black__icon"
            aria-label="Facebook"
          >
            <span style={{ fontSize: "14px", fontWeight: 700 }}>f</span>
          </a>

          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="store-footer-black__icon"
            aria-label="WhatsApp"
          >
            <MessageCircle size={18} />
          </a>

          <a
            href={socialLinks.email}
            className="store-footer-black__icon"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>

          <a
            href={socialLinks.website}
            target="_blank"
            rel="noreferrer"
            className="store-footer-black__icon"
            aria-label="Website"
          >
            <Globe size={18} />
          </a>

          <a
            href={socialLinks.maps}
            target="_blank"
            rel="noreferrer"
            className="store-footer-black__icon"
            aria-label="Location"
          >
            <MapPin size={18} />
          </a>
        </div>

        <nav className="store-footer-black__links">
          <Link href="/terms">الشروط والأحكام</Link>
          <Link href="/returns">سياسة الاسترجاع</Link>
          <Link href="/shipping">سياسة الشحن</Link>
          <Link href="/privacy">سياسة الخصوصية</Link>
        </nav>

        <div className="store-footer-black__copy">
          © 2026 House of Antiques. All rights reserved.
        </div>
      </div>
    </footer>
  );
}