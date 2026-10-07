import type { FlowStep } from "@/lib/api";

export default function MoneyFlow({ title, steps }: { title: string; steps: FlowStep[] }) {
  return (
    <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
      <h2 className="text-xl font-bold text-brand-900">{title}</h2>
      <ol className="mt-5 space-y-0">
        {steps.map((step, i) => (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span className="absolute left-5 top-10 h-full w-px bg-brand-500/40" aria-hidden />
            )}
            <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm ring-1 ring-brand-100">
              {step.icon}
            </span>
            <div>
              <p className="font-semibold text-slate-900">
                <span className="mr-2 text-brand-600">{i + 1}.</span>
                {step.title}
              </p>
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
