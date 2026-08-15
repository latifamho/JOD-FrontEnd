import { Sparkles } from "lucide-react";

import { RevealImageMask } from "@/components/ui/reveal-image-mask";
import { Reveal } from "@/components/pages/landing/reveal";

export function LandingRevealGallery() {
  return (
    <section id="story" className="py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" />
            لحظات من الأثر
          </span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            كل حملة قصة، وكل قصة تستحق أن تُروى
          </h2>
        </Reveal>

        <div className="mt-16 space-y-16">
          <RevealImageMask
            src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1400&q=80"
            alt="متطوعون يوزعون صناديق الطعام على المستفيدين"
            title="من القلب... يبدأ العطاء"
            caption="كل تبرع يبدأ بنية صادقة تجمع المتبرع بمن يحتاج مساعدته."
          />

          <RevealImageMask
            shape="rounded"
            src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1400&q=80"
            alt="أطفال مستفيدون يبتسمون بفرح"
            title="أثرٌ يصل لكل مستفيد"
            caption="وراء كل ابتسامة حملة تبرع وصلت في وقتها إلى من يستحقها."
          />

          <RevealImageMask
            src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1400&q=80"
            alt="يدان تحملان عملات معدنية وورقة مكتوب عليها 'أحدث فرقًا'"
            title="الطريق إلى الأثر"
            caption="من التبرع الأول حتى وصول الأثر، نرافق كل خطوة بشفافية وتقارير واضحة."
          />
        </div>
      </div>
    </section>
  );
}
