import type { ReactNode } from "react";
import { PenLine, Radar, Send, TextQuote } from "lucide-react";
import { Section } from "../Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n/config";
import { FeedDemo } from "./FeedDemo";
import { TranscriptDemo } from "./TranscriptDemo";
import { ScriptDemo } from "./ScriptDemo";
import { PublishDemo } from "./PublishDemo";

function FeatureBlock({
  index,
  icon,
  eyebrow,
  title,
  body,
  demo,
}: {
  index: number;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  demo: ReactNode;
}) {
  const reversed = index % 2 === 1;
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn("order-2", reversed ? "lg:order-2" : "lg:order-1")}>
        <span className="lp-icon-tile mb-5">{icon}</span>
        <p className="lp-eyebrow mb-3">{eyebrow}</p>
        <h3 className="lp-h2 max-w-[16ch] text-balance text-foreground" style={{ fontSize: "clamp(1.6rem,1.2rem+1.6vw,2.25rem)" }}>
          {title}
        </h3>
        <p className="lp-lead mt-5 max-w-[46ch] text-muted-foreground">{body}</p>
      </Reveal>
      <Reveal className={cn("order-1 w-full", reversed ? "lg:order-1" : "lg:order-2")} delay={80}>
        {demo}
      </Reveal>
    </div>
  );
}

export function Features({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const f = dict.features;
  return (
    <Section id="features" className="bg-background">
      <Reveal className="mb-16 flex flex-col items-center gap-3 text-center">
        <span className="lp-eyebrow">{f.eyebrow}</span>
      </Reveal>

      <div className="flex flex-col gap-24 lg:gap-32">
        <FeatureBlock
          index={0}
          icon={<Radar size={22} />}
          eyebrow={f.f1.eyebrow}
          title={f.f1.title}
          body={f.f1.body}
          demo={<FeedDemo labels={f.f1.demo} />}
        />
        <FeatureBlock
          index={1}
          icon={<TextQuote size={22} />}
          eyebrow={f.f2.eyebrow}
          title={f.f2.title}
          body={f.f2.body}
          demo={<TranscriptDemo labels={f.f2.demo} />}
        />
        <FeatureBlock
          index={2}
          icon={<PenLine size={22} />}
          eyebrow={f.f3.eyebrow}
          title={f.f3.title}
          body={f.f3.body}
          demo={<ScriptDemo labels={f.f3.demo} defaultLang={locale} />}
        />
        <FeatureBlock
          index={3}
          icon={<Send size={22} />}
          eyebrow={f.f4.eyebrow}
          title={f.f4.title}
          body={f.f4.body}
          demo={<PublishDemo labels={f.f4.demo} />}
        />
      </div>
    </Section>
  );
}
