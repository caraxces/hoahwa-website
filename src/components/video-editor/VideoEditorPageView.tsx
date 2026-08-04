import { ServiceFaqContact } from "@/components/service/ServiceFaqContact";
import { veContactServices, veFaqs } from "@/content/video-editor";
import { VeHero } from "./VeHero";
import { VeManifesto } from "./VeManifesto";
import { VeServices } from "./VeServices";
import { VeTrust } from "./VeTrust";
import { VeWork } from "./VeWork";

/**
 * The `ve` class scopes this page to a light surface — see
 * src/styles/video-editor.css. FAQ + contact reuse the shared service section,
 * which stays on the site's dark treatment and closes the page.
 */
export function VideoEditorPageView() {
  return (
    <>
      <div className="ve">
        <VeHero />
        <VeManifesto />
        <VeServices />
        <VeWork />
        <VeTrust />
      </div>
      <ServiceFaqContact
        faqs={veFaqs}
        contactTitle={["Lets Talk", "Video"]}
        contactServices={veContactServices}
      />
    </>
  );
}
