import { BookingPageView } from "@/components/booking/BookingPageView";
import { bookingFaqs } from "@/content/booking";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

const PATH = "/book";

export const metadata = pageMetadata({
  title: "Book a Meeting",
  description:
    "Book a free 30-minute call with the developer who would build your project. Pick a slot that suits you, or send a request and we'll confirm a time.",
  path: PATH,
});

export default function BookPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Book a Meeting", path: PATH },
        ])}
      />
      <JsonLd data={faqSchema(bookingFaqs)} />
      <BookingPageView />
    </>
  );
}
