import { VideoEditorPageView } from "@/components/video-editor/VideoEditorPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { veFaqs } from "@/content/video-editor";
import {
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
  serviceSchema,
} from "@/lib/seo";

const TITLE = "Video Editor — Short-form, Motion & Launch Films";
const DESCRIPTION =
  "Placeholder — mô tả dịch vụ video cho SEO, khoảng 150–160 ký tự. Thay bằng nội dung thật trước khi mở index.";
const PATH = "/video-editor";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  // Placeholder copy — keep out of the index until the real content lands.
  noindex: true,
});

export default function VideoEditorPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Video Editing & Motion Design",
            description: DESCRIPTION,
            path: PATH,
            serviceType: "Video Production",
          }),
          faqSchema(veFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Video Editor", path: PATH },
          ]),
        ]}
      />
      <VideoEditorPageView />
    </>
  );
}
